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
import { addToast, Button, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from '@heroui/react';
import { WSMessage } from '@/types/socket';
import { BaseUser, Game, GameMessage } from '@/types/types';
import TileCard from '@/components/card/tile';
import { FaCrown, FaParachuteBox, FaScreenpal, FaUser } from 'react-icons/fa6';
import Countdown from '@/components/countdown/CountdownTimer';
import Loader from '@/components/loading/Loader';
import { useAuth } from '@/contexts/AuthContext';
import CrashGameModal from '@/components/modal/crashGameModal';
import CrashRewardModal from '@/components/modal/crashRewardModa';

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

const Crash = () => {
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(false)
    const [loadingUser, setLoadinguser] = useState(false);
    const [loadingGame, setLoadingGame] = useState(false);
    const [gameModalOpen, setGameModalOpen] = useState(false)
    const [rewardModalOpen, setRewardModalOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState<Game>()
    const [launchAt, setLaunchAt] = useState<number>()
    const [rewardSummary, setRewardSummary] = useState<any>()
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

    const [joinedUser, setJoinedUser] = useState<{ status?: String, user: BaseUser }[]>([]);
    const [games, setGames] = useState<Game[]>([])
    const [game, setGame] = useState<Game>()
    const { userProfile } = useAuth()
    const { sendTransaction } = useSendTransaction();
    const { wallets } = useSolanaWallets();
    const transaction = new Transaction();
    const TREASURY = process.env.NEXT_PUBLIC_TREASURY || "DGtbRfRTqAxYomc2BjCU4FXYPTc2jZbDqQhpfKa1xBpJ"
    const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'
    // Join game
    const handleBuyTicket = async () => {
        setLoading(true);


        try {


            // const res = await fetch(`/api/game/crash/validate`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         action: "validate",
            //         game: "crash",
            //     })
            // });
            // const data = await res.json();
            // if (!data.valid) {
            //     addToast({
            //         title: data.message,
            //         color: data.type === "error" ? "danger" : data.type,
            //         timeout: 3000,
            //     })
            //     return
            // }
            // console.log('validate', data)

            const transferInstruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(wallets[0].address), // Replace with the sender's address
                toPubkey: new PublicKey(TREASURY), // Replace with the recipient's address
                lamports: 1000000 // Amount in lamports (1 SOL = 1,000,000,000 lamports)
            });
            transaction.add(transferInstruction);
            const connection = new Connection(RPC); // Replace with your Solana RPC endpoint
            const latestBlockhash = await connection.getLatestBlockhash();
            transaction.recentBlockhash = latestBlockhash.blockhash;
            transaction.feePayer = new PublicKey(wallets[0].address); // Set fee payer

            // Send the transaction
            const receipt = await sendTransaction({
                transaction: transaction,
                connection: connection,
                address: wallets[0].address, // Optional: Specify the wallet to use for signing. If not provided, the first wallet will be used.
            });
            console.log("Transaction sent with signature:", receipt.signature);


            const body = {
                action: "join",
                game: "crash",
                tx: receipt.signature
            };

            // Test logic
            const response = await fetch(`/api/game/crash/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Failed to join game");
            }
            setJoined(true)

            const data = await response.json();
            console.log("Join game response:", data);
            if (data.message)
                addToast({
                    title: data.message,
                    color: data.type,
                    timeout: 3000,
                })
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.error("Error joining game:", error.message);
            addToast({
                title: error?.message,
                color: "danger",
                timeout: 3000,
            })
        }
    }

    const handleEscape = async () => {
        setLoading(true);
        sendMessage({
            type: "game",
            action: "escape",
        })
        // try {
        //     const body = {
        //         action: "escape",
        //         game: "crash",
        //     };

        //     const response = await fetch(`/api/game/crash/escape`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(body),
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to escape game");
        //     }

        // }
        // catch (error) {
        //     console.error("Error escaping game:", error);
        // }
        setLoading(false);
    }

    const { ws, newEnteredUsers, sendMessage } = useWebSocket()

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
                if (data.game[0].status !== "SETTLED") {
                    setGame(data.game[0])
                    setJoinedUser(data.game[0].players || []);
                }
                if (data.game[0].launchAt && data.game[0].now) {
                    const offsetMs = new Date(data.game[0].launchAt).getTime() - new Date(data.game[0].now).getTime();
                    setLaunchAt(parseInt((offsetMs / 1000).toString())); // Convert to seconds
                }
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
        // getCrashEnteredUser()
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
                    console.log("data.user", data.user)
                    setJoinedUser((prev) => [...prev, data.user as any]);
                    if (data.launchAt && data.now) {
                        const offsetMs = new Date(data.launchAt).getTime() - new Date(data.now).getTime();
                        setLaunchAt(parseInt((offsetMs / 1000).toString())); // Convert to seconds
                    }
                    setGames(prevGames => {
                        if (prevGames.length === 0) return [data?.game as Game]; // if empty, just add
                        const updatedGames = [...prevGames]; 
                        updatedGames[0] = data?.game as Game; // replace first item
                        return updatedGames;
                      });
                }
                else if (data.action === "escape") {
                    console.log("data.user", data.users)
                    setJoinedUser(data.users as any);
                    triggerEscape(data.user.avatar)
                }
                else if (data.action === "create") {
                    console.log("data.user", data.user)
                    setGame(data.game);
                    setGames(prevGames => [data?.game as Game, ...prevGames]);
                    setJoinedUser((prev) => [...prev, data.user as any]);
                }
                else if (data.action === "launch" && data.launchAt && data.now) {
                    setGame(data.game);
                    setGames(prevGames => {
                        if (prevGames.length === 0) return prevGames;
                        const updatedGames = [...prevGames];
                        updatedGames[0] = {
                            ...updatedGames[0],
                            status: "STARTED",
                        };
                        return updatedGames;
                    });
                    triggerLaunch()
                }
                else if (data.action === "settled") {
                    triggerCrash()
                    setGames(prevGames => {
                        if (prevGames.length === 0) return prevGames;
                        const updatedGames = [...prevGames];
                        updatedGames[0] = {
                            ...updatedGames[0],
                            status: "SETTLED",
                        };
                        return updatedGames;
                    });
                    setGame(undefined)
                    setJoinedUser([]);
                    setJoined(false)
                    setLaunchAt(undefined);
                }
                else if (data.action === "reward") {
                    console.log("Reward", data?.summary)
                    setRewardSummary(data?.summary)
                    setRewardModalOpen(true)
                }
            }
        };

        ws.addEventListener("message", handler);

        return () => {
            ws.removeEventListener("message", handler);
        };
    }, [ws]);

    useEffect(() => {
        console.log("Current Game", game, userProfile)
    }, [game, userProfile])

    return (
        <Layout className="bg-crash bg-cover bg-center">
            <div className='flex flex-col'>
                <div className='flex gap-2 horizontal-scrollbar scrollbar-hide overflow-x-auto w-full py-4 px-2'>
                    {loadingGame && new Array(10).fill(null).map((_, index) => (
                        <div className="" key={index}>
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
                                    ${game.status === "PENDING" || game.status === "STARTED" ? "bg-primary" : "border border-p"}
                                border-primary p-2 pt-3 transition relative duration-300 cursor-pointer hover:translate-y-[3px] `}
                            key={idx} onClick={() => { setGameModalOpen(true); setSelectedGame(game) }}
                        >
                            <p className='absolute left-1/2 top-0 -translate-x-1/2 text-xs text-whtie/20 px-4 rounded-b-lg bg-linear-to-b from-primary to-primary-700'>{game.status}</p>
                            <div className=''>
                                <p className="text-white text-2xl">{ Math.round(game.betAmount * game.players.length * 10000) / 10000} <span className='text-sm'> SOL</span></p>
                                <p className="text-white/50 text-sm">Joined <span>{game.players.length}</span> Players</p>
                            </div>
                            {game.status === "PENDING" || game.status === "STARTED" ? <FaScreenpal size={30} className='text-white/30 animate-spin' />
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
                            <div className='h-[240px] relative bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl content-center flex items-center justify-center'>
                                {launchAt ? <Countdown time={launchAt} />
                                    :
                                    game?.status === "PENDING" ? <Image src="/assets/images/pending.png" alt='cloud' className='w-40 h-40 m-auto  animate-float-cloud' /> :
                                        <Loader />
                                }
                                <p className='absolute left-1/2 -translate-x-1/2 top-1 animate-bounce'>{game?.status}</p>
                            </div>

                            <div>
                                Ticket : 0.05 SOL
                            </div>
                            <div className='flex'>
                                {game?.status === "LAUNCHED" && <PrimaryButton onClick={() => handleEscape()} className='w-full' loading={loading} disabled={!userProfile}>Escape</PrimaryButton>}
                                {(!game || game.status === "PENDING" || game.status === "STARTED") && (!game?.players.some(p => p.user._id === userProfile?._id)) && <PrimaryButton onClick={() => handleBuyTicket()} className='w-full' loading={loading} disabled={!userProfile}>Join</PrimaryButton>}
                            </div>
                            <div>
                                <PrimaryButton onClick={() => triggerLaunch()}>Launch</PrimaryButton>
                                <PrimaryButton onClick={() => triggerCrash()}>crash</PrimaryButton>
                                {/* <PrimaryButton onClick={() => triggerEscape()}>Escape</PrimaryButton> */}
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
                                        <div className="" key={index}>
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
                                        <TileCard key={idx} className="w-full justify-between">
                                            <div className="flex items-center gap-2" >
                                                <div className="flex items-center">
                                                    <div className="rounded-[8px] overflow-hidden border-[1px] aspect-square hover:brightness-125 duration-300 cursor-pointer w-12 h-12 transition-[filter] will-change-[filter] group-hover:brightness-125 shrink-0 shadow-[0px_1.48px_0px_0px_#FFFFFF1A_inset] bg-[#303045] p-[1px] border-none">
                                                        <div className="w-full h-full p-0.5 border-[1px] border-[#222222] relative overflow-hidden rounded-[10px]">
                                                            <Image src={user?.user?.avatar ?? "/assets/images/avatar/default.webp"} className="object-cover object-center w-full h-full rounded-md gb-blur-image" alt="" />
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
                                            <div>
                                                <p>{user?.status}</p>
                                                {user?.status === "WIN" && <FaCrown className='text-xl text-success' />}
                                            </div>
                                        </TileCard>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CrashGameModal game={selectedGame} open={gameModalOpen} setOpen={setGameModalOpen} />
            <CrashRewardModal summary={rewardSummary} open={rewardModalOpen} setOpen={setRewardModalOpen} />
        </Layout>
    );
};

export default Crash;
