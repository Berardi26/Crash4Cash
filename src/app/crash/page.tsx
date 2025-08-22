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
import { FaUser } from 'react-icons/fa6';
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

const Crash = () => {
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadinguser] = useState(false);
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
    const [game, setGame] = useState()
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
            const response = await fetch(`/api/game/crash`, {
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
            const res = await fetch(`/api/game/crash`);
            const data = await res.json();
            console.log("data", data)
            if (data.game) {
                setGame(data.game)
                setJoinedUser(data.game.players || []);
            }
        } catch (e) {
            console.error("Error fetching crash entered users:", e);
        }
        setLoadinguser(false)
        return [];
    }

    useEffect(() => {
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
                }
                else if (data.action === "launch" && data.launchAt && data.now) {

                    setLaunchAt(data?.launchAt - data?.now);
                }
            }
        };

        ws.addEventListener("message", handler);

        return () => {
            ws.removeEventListener("message", handler);
        };
    }, [ws]);

    return (
        <Layout className="bg-crash bg-cover bg-center">
            <div className='flex flex-col'>
                <div className='flex gap-2'>
                    <div
                        className="group w-40 rounded-lg bg-primary p-2 transition relative duration-300 cursor-pointer hover:translate-y-[3px] "
                    >
                        <p className="text-white text-2xl">2000</p>
                        <p className="text-white text-sm">lorem</p>
                        <svg
                            viewBox="0 0 512 512"
                            y="0"
                            x="0"
                            height="36"
                            width="36"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300"
                        >
                            <g>
                                <path
                                    className=""
                                    data-original="#000000"
                                    opacity="1"
                                    fill="#ffffff"
                                    d="M135.169 91.902c16.83 0 30.474-13.649 30.474-30.485 0-11.22-13.533-36.418-22.563-51.981-3.524-6.075-12.297-6.075-15.822 0-9.029 15.563-22.563 40.761-22.563 51.981 0 16.836 13.644 30.485 30.474 30.485zM256 91.902c16.83 0 30.474-13.649 30.474-30.485 0-11.22-13.533-36.418-22.563-51.981-3.524-6.075-12.297-6.075-15.822 0-9.029 15.563-22.563 40.761-22.563 51.981 0 16.836 13.643 30.485 30.474 30.485zM376.83 91.902c16.83 0 30.474-13.649 30.474-30.485 0-11.22-13.533-36.418-22.563-51.981-3.525-6.075-12.297-6.075-15.822 0-9.029 15.563-22.563 40.761-22.563 51.981 0 16.836 13.644 30.485 30.474 30.485zM118.391 116.951c-7.454 0-13.497 6.045-13.497 13.502v108.924h60.55V130.454c0-7.457-6.042-13.502-13.497-13.502h-33.556zM239.221 116.951c-7.454 0-13.497 6.045-13.497 13.502v108.924h60.55V130.454c0-7.457-6.043-13.502-13.497-13.502h-33.556zM360.052 116.951c-7.454 0-13.497 6.045-13.497 13.502v108.924h60.55V130.454c0-7.457-6.043-13.502-13.497-13.502h-33.556zM66.25 356.095a26.11 26.11 0 0 0 7.425-1.08l37.866-11.209c12.377-3.664 25.284-5.496 38.19-5.496s25.813 1.832 38.19 5.496l29.888 8.848c12.377 3.664 25.284 5.496 38.19 5.496s25.813-1.832 38.19-5.496l29.888-8.848c12.377-3.664 25.284-5.496 38.19-5.496s25.813 1.832 38.19 5.496l37.866 11.209a26.146 26.146 0 0 0 7.425 1.08c12.118 0 22.787-8.481 22.787-19.746v-38.672c0-12.82-12.02-23.213-26.848-23.213H70.312c-14.828 0-26.848 10.393-26.848 23.213v38.672c0 11.265 10.67 19.746 22.786 19.746zM497 477.12h-40.946v-91.989a56.002 56.002 0 0 1-10.305.964 56.132 56.132 0 0 1-15.941-2.313l-37.866-11.209c-9.553-2.828-19.537-4.262-29.674-4.262s-20.121 1.434-29.674 4.262l-29.888 8.848c-15.086 4.466-30.799 6.73-46.705 6.73s-31.62-2.264-46.706-6.73l-29.888-8.848c-9.553-2.828-19.537-4.262-29.674-4.262s-20.121 1.434-29.674 4.262l-37.866 11.209a56.138 56.138 0 0 1-15.941 2.314c-3.487 0-6.935-.333-10.305-.964v91.989H15c-8.284 0-15 6.716-15 15s6.716 15 15 15h482c8.284 0 15-6.716 15-15s-6.716-15.001-15-15.001z"
                                ></path>
                            </g>
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col w-full bg-opacity-15 flex-1 md:flex-row">
                    <div className='relative w-[600px]'>
                        <div className="relative">
                            {/* <PhaserGame onReady={setGameInstance} /> */}
                        </div>
                    </div>
                    <div className='flex-1 flex-col gap-2 '>
                        <div className='max-w-[400px] flex flex-col gap-2 px-4 py-2 '>
                            <div className='h-[240px] bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-lg'>
                                {launchAt ? <Countdown time={launchAt} />
                                    :
                                    <Loader />
                                }
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
                                            <div className="flex items-center gap-2" style={{ color: "rgb(145, 118, 255);" }}>
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
