'use client';

import dynamic from 'next/dynamic';
import Layout from "../../components/layout/layout";
import { useGameController } from "../../hooks/useCrashGameController";
import PrimaryButton from '../../components/button/primary';
import { useWebSocket } from '@/contexts/SocketContext';
import { usePrivy, useSolanaWallets, useWallets } from '@privy-io/react-auth';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { addToast, Button, Image, Skeleton } from '@heroui/react';
import { WSMessage } from '@/types/socket';
import { BaseUser, GameMessage } from '@/types/types';
import TileCard from '@/components/card/tile';
import { FaParachuteBox, FaScreenpal, FaUser } from 'react-icons/fa6';
import Countdown from '@/components/countdown/CountdownTimer';
import Loader from '@/components/loading/Loader';

// ✅ dynamically import PhaserGame with SSR disabled
const PhaserGame = dynamic(() => import('../engine/CrashGame'), {
    ssr: false,
});

declare global {
    interface Window {
        game: Phaser.Game;
        sizeChanged: () => void;
    }
}

interface Game {
    betAmount: number,
    crashAt: Date,
    createdAt: Date,
    feeRate: number,
    launchAt: Date,
    round: number,
    status: string,
    ticket: number,
    players: [
        {
            status: string,
            user: BaseUser
        }
    ]
}

const Crash = () => {
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadinguser] = useState(false);
    const [loadingGame, setLoadingGame] = useState(false);
    const [launchAt, setLaunchAt] = useState<number>()
    const {
        setGameInstance,
        startGame,
        triggerCrash,
        triggerLaunch,
        triggerEscape,
        score,
        crashed,
    } = useGameController();

    const {
        authenticated,
        getAccessToken
    } = usePrivy()

    const [joinedUser, setJoinedUser] = useState<{ user: BaseUser }[]>([]);
    const [games, setGames] = useState<Game[]>([])
    const [game, setGame] = useState<Game>()
    const { sendTransaction } = useSendTransaction();
    const { wallets } = useSolanaWallets();
    const transaction = new Transaction();
    // Join game
    const handleBuyTicket = async () => {
        setLoading(true);
        const token = await getAccessToken();
        const body = {
            action: "join",
            game: "crash"
        };

        try {
            // const transferInstruction = SystemProgram.transfer({
            //     fromPubkey: new PublicKey(wallets[0].address), // Replace with the sender's address
            //     toPubkey: new PublicKey('DGtbRfRTqAxYomc2BjCU4FXYPTc2jZbDqQhpfKa1xBpJ'), // Replace with the recipient's address
            //     lamports: 1000000 // Amount in lamports (1 SOL = 1,000,000,000 lamports)
            // });
            // transaction.add(transferInstruction);
            // const connection = new Connection('https://api.devnet.solana.com'); // Replace with your Solana RPC endpoint
            // const latestBlockhash = await connection.getLatestBlockhash();
            // transaction.recentBlockhash = latestBlockhash.blockhash;
            // transaction.feePayer = new PublicKey(wallets[0].address); // Set fee payer

            // // Send the transaction
            // const receipt = await sendTransaction({
            //     transaction: transaction,
            //     connection: connection,
            //     address: wallets[0].address, // Optional: Specify the wallet to use for signing. If not provided, the first wallet will be used.
            // });
            // setLoading(false);
            // console.log("Transaction sent with signature:", receipt.signature);


            // Test logic
            const response = await fetch(`/api/game/crash/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token || "", // forward token to backend
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Failed to join game");
            }


            const data = await response.json();
            console.log("Join game response:", data);
            if (data.message)
                addToast({
                    title: data.message,
                    color: data.type,
                    timeout: 3000,
                })
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error joining game:", error);
        }
    }

    const { ws, newEnteredUsers } = useWebSocket()

    const getCrashEnteredUser = async () => {
        try {
            setLoadinguser(true)
            const res = await fetch(`/api/game/crash/get`);
            const data = await res.json();
            console.log("load single game data", data)
            if (data.game) {
                setGame(data.game)
                if (data.launchAt && data.now) {
                    const offsetMs = new Date(data.launchAt).getTime() - new Date(data.now).getTime();
                    setLaunchAt(offsetMs / 1000); // Convert to seconds
                }
                setJoinedUser(data.game.players || []);
            }
        } catch (e) {
            console.error("Error fetching crash entered users:", e);
        }
        setLoadinguser(false)
    }

    const getAllGames = async () => {
        try {
            setLoadingGame(true)
            const res = await fetch(`/api/game/crash`);
            const data = await res.json();
            if (data.game) {
                setGames(data.game || []);

            }
        } catch (e) {
            console.error("Error fetching crash entered users:", e);
        }
        setLoadingGame(false)
    }

    const launchRocket = () => {
        if (!game) {
            console.error("No game instance found");
            return;
        }
        if (game.status !== "PENDING") {
            console.error("Game is not in PENDING state");
            return;
        }
    }


    useEffect(() => {
        getAllGames()
        getCrashEnteredUser()
    }, [])

    useEffect(() => {
        if (!ws) return;
        const handler = (event: MessageEvent) => {
            const msg: WSMessage = JSON.parse(event.data);
            console.log('📩 Incoming:Crash:', msg);
            if (msg.type === "game") {
                const data = msg.data as GameMessage;
                if (data.category === "crash")
                    console.log("Crash Game Message::::", data);
                if (data.action === "join") {
                    setJoinedUser((prev) => [...prev, { user: data.user as BaseUser }]);
                    if (data.launchAt && data.now) {
                        console.log("launch", data.launchAt, data.now)
                        console.log("launch At", data.launchAt - data.now)
                        const offsetMs = new Date(data.launchAt).getTime() - new Date(data.now).getTime();
                        setLaunchAt(offsetMs / 1000); // Convert to seconds
                    }
                }
                else if (data.action === "launch" && data.launchAt && data.now) {
                    setGame((prev) => (prev ? { ...prev, status: 'STARTED' } : undefined));
                    triggerLaunch()
                }
                else if(data.action === "settled"){
                    triggerCrash()
                }
            }
        };

        ws.addEventListener("message", handler);

        return () => {
            ws.removeEventListener("message", handler);
        };
    }, [ws]);

    useEffect(() => {
        console.log("launch at changed", launchAt)
    }, [launchAt])

    return (
        <Layout className="bg-crash bg-cover bg-center">
            <div className='flex flex-col'>
                <div className='flex gap-2 horizontal-scrollbar scrollbar-hide overflow-x-auto w-full py-4 px-2'>
                    {loadingGame && new Array(10).fill(null).map((_, index) => (
                        <div className="">
                            <div className="w-full flex rounded-lg">
                                <div className="relative bg-gradient-to-b from-[#241c1c] to-[#221a1a] p-3 pl-4 rounded-lg cursor-pointer transition-colors duration-200 w-full flex gap-2">
                                    <div className="relative z-3 flex flex-col gap-1 justify-center ">
                                        <div className="flex items-center gap-1.5">
                                            <Skeleton className="w-20 rounded-lg">
                                                <div className="text-sm font-bold max-w-[150px] truncate text-white w-10 h-3"></div>
                                            </Skeleton>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Skeleton className="w-8 rounded-lg">
                                                <div className="text-sm font-bold max-w-[150px] truncate text-white w-10 h-3"></div>
                                            </Skeleton>
                                        </div>
                                    </div>
                                    <Skeleton className=" bg-[#2a3c58] w-12 h-12 rounded-lg" >
                                        <div className="text-[11px] leading-[16px] text-[#cecece] w-8 h-3"></div>
                                    </Skeleton>
                                </div>
                            </div>
                        </div>
                    ))}

                    {games.map((game, idx) => (
                        <div
                            className={`group flex items-center justify-between shrink-0 w-50 rounded-lg border-1 relative
                                    ${game.status === "PENDING" ? "bg-primary" : "border border-p"}
                                border-primary p-2 pt-3 transition relative duration-300 cursor-pointer hover:translate-y-[3px] `}
                            key={idx}
                        >
                            <p className='absolute left-1/2 top-0 -translate-x-1/2 text-xs text-whtie/20 px-4 rounded-b-lg bg-linear-to-b from-primary to-primary-700'>{game.status}</p>
                            <div className=''>
                                <p className="text-white text-2xl">{game.betAmount * game.players.length} <span className='text-sm'> SOL</span></p>
                                <p className="text-white/50 text-sm">Joined <span>{game.players.length}</span> Players</p>
                            </div>
                            {game.status === "PENDING" ? <FaScreenpal size={30} className='text-white/30 animate-spin' />
                                : <FaParachuteBox size={30} className='text-primary ' />}
                        </div>
                    )
                    )}

                </div>
                <div className="flex flex-col w-full bg-opacity-15 flex-1 md:flex-row">
                    <div className='relative w-[600px]'>
                        <div className="relative">
                            <PhaserGame onReady={setGameInstance} />
                        </div>
                    </div>
                    <div className='flex-1 flex-col gap-2 '>
                        <div className='max-w-[400px] flex flex-col gap-2 px-4 py-2 '>
                            <div className='h-[240px] relative bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl'>
                                {launchAt ? <Countdown time={launchAt} />
                                    :
                                    <Loader />
                                }
                                <p className='absolute left-1/2 -translate-x-1/2 top-1 animate-bounce'>{game?.status}</p>
                            </div>

                            <div>
                                Ticket : 0.05 SOL
                            </div>
                            <div className='flex'>
                                <PrimaryButton onClick={() => handleBuyTicket()} className='w-full' loading={loading} disabled={loading}>Buy Ticket</PrimaryButton>
                            </div>
                            <div>
                                <PrimaryButton onClick={() => triggerLaunch()}>Launch</PrimaryButton>
                                <PrimaryButton onClick={() => triggerCrash()}>crash</PrimaryButton>
                                <PrimaryButton onClick={() => triggerEscape()}>Escape</PrimaryButton>
                                <PrimaryButton onClick={() => {
                                    setJoinedUser([]);
                                    getAllGames();
                                }}>Refresh</PrimaryButton>
                            </div>
                            {/* Entered User List */}
                            <div className='pt-4'>
                                <div className='w-full justify-between flex px-2'>
                                    <div className="text-primary flex items-center justify-center gap-2">
                                        <FaUser size={14} />
                                        <p className='text-white'>{joinedUser.length} Playsers</p>
                                    </div>
                                    <p>
                                        Round <span className='text-xl text-primary'>#</span><span>{1}</span>
                                    </p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    {/* loadingUser && List of users who entered the game */}
                                    {loadingUser && new Array(5).fill(null).map((_, index) => (
                                        <div className="">
                                            <div className="w-full flex rounded-lg">
                                                <div className="relative bg-gradient-to-b from-[#241c1c] to-[#221a1a] p-3 pl-4 rounded-lg cursor-pointer transition-colors duration-200 w-full flex gap-2">
                                                    <Skeleton className=" bg-[#2a3c58] w-12 h-12 rounded-lg" >
                                                        <div className="text-[11px] leading-[16px] text-[#cecece] w-8 h-3"></div>
                                                    </Skeleton>
                                                    <div className="relative z-3 flex flex-col gap-1 justify-center ">
                                                        <div className="flex items-center gap-1.5">
                                                            <Skeleton className="w-20 rounded-lg">
                                                                <div className="text-sm font-bold max-w-[150px] truncate text-white w-10 h-3"></div>
                                                            </Skeleton>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Skeleton className="w-8 rounded-lg">
                                                                <div className="text-sm font-bold max-w-[150px] truncate text-white w-10 h-3"></div>
                                                            </Skeleton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {!loadingUser && joinedUser.map((user, idx) => (
                                        <TileCard key={idx} className="w-full">
                                            <div className="flex items-center gap-2" >
                                                <div className="flex items-center">
                                                    <div className="rounded-[8px] overflow-hidden border-[1px] aspect-square hover:brightness-125 duration-300 cursor-pointer w-12 h-12 transition-[filter] will-change-[filter] group-hover:brightness-125 shrink-0 shadow-[0px_1.48px_0px_0px_#FFFFFF1A_inset] bg-[#303045] p-[1px] border-none">
                                                        <div className="w-full h-full p-0.5 border-[1px] border-[#222222] relative overflow-hidden rounded-[10px]">
                                                            <Image src="/assets/images/avatar/ada.jpg" className="object-cover object-center w-full h-full rounded-md gb-blur-image" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start gap-1 ml-2 -top-[2px] relative">
                                                    <p className="text-sm font-book text-[#C4C4C4]  truncate">{user?.user?.username}</p>
                                                    <div className="p-[1px] rounded-md overflow-hidden bg-[#2A417C] text-[#60AAFF]">
                                                        <div className="flex items-center justify-center rounded-[5px] overflow-hidden bg-[#22222D]/80 font-semibold w-[28px] h-5 text-[11px]">{21}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TileCard>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Crash;
