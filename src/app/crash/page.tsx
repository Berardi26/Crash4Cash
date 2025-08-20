'use client';

import dynamic from 'next/dynamic';
import Layout from "../../components/layout/layout";
import { useGameController } from "../../hooks/useCrashGameController";
import PrimaryButton from '../../components/button/primary';
import { useWebSocket } from '@/contexts/SocketContext';
import { usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';

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
        getAccessToken
    } = usePrivy()
    const { wallets } = useWallets()
    const { sendTransaction } = useSendTransaction();

    // Join game
    const handleBuyTicket = async () => {
        const token = await getAccessToken();
        const body = {
            action: "join",
            game: "crash"
        };

        try {
            sendTransaction(
                {
                    to: 'DGtbRfRTqAxYomc2BjCU4FXYPTc2jZbDqQhpfKa1xBpJ',
                    value: 100000
                },
                {
                    address: wallets[0].address // Optional: Specify the wallet to use for signing. If not provided, the first wallet will be used.
                }
            );

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
        } catch (error) {
            console.error("Error joining game:", error);
        }
    }

    const { newEnteredUsers } = useWebSocket()

    return (
        <Layout className="bg-crash bg-cover bg-center">
            <div className="flex flex-col w-full bg-opacity-15 flex-1 md:flex-row">
                <div className='relative w-[600px]'>
                    <div className="relative">
                        <PhaserGame onReady={setGameInstance} />
                    </div>
                </div>
                <div className='flex-1 flex-col gap-2 '>
                    <div className='max-w-[400px]'>
                        <div className='h-40 '>
                            Rocket select (ticket select area)
                        </div>

                        <div>
                            Ticket : 0.05 SOL
                        </div>
                        <div>
                            <PrimaryButton onClick={() => handleBuyTicket()}>Buy Ticket</PrimaryButton>
                        </div>
                        <PrimaryButton onClick={() => triggerLaunch()}>Launch</PrimaryButton>
                        <PrimaryButton onClick={() => triggerCrash()}>crash</PrimaryButton>
                        <PrimaryButton onClick={() => triggerEscape()}>Escape</PrimaryButton>
                        {/* Entered User List */}
                        <div>
                            <h3 className='text-lg font-bold'>Entered Users</h3>
                            <div className='flex flex-col gap-2'>
                                {/* List of users who entered the game */}
                                {/* Example user */}
                                {newEnteredUsers.map((user, idx) => (
                                    <div key={idx} className='flex items-center justify-between p-2 bg-gray-800 rounded-md'>
                                        <span>{user.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Crash;
