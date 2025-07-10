'use client';

import dynamic from 'next/dynamic';
import Layout from "../components/layout/layout";
import { useGameController } from "../hooks/useCrashGameController";
import PrimaryButton from '../components/button/primary';

// ✅ dynamically import PhaserGame with SSR disabled
const PhaserGame = dynamic(() => import('../engine/CrashGame'), {
    ssr: false,
});

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

    return (
        <Layout className="bg-crash bg-cover bg-center">
            <div className="flex flex-col w-full bg-opacity-15 flex-1">
                <div className="flex flex-col w-full h-full bg-black/70 items-center justify-center">
                    <div className="w-[800px] h-[600px] relative">
                        <PhaserGame onReady={setGameInstance} />
                    </div>
                    <div className='flex gap-2'>
                        <PrimaryButton onClick={() => triggerLaunch()}>Launch</PrimaryButton>
                        <PrimaryButton onClick={() => triggerCrash()}>crash</PrimaryButton>
                        <PrimaryButton onClick={() => triggerEscape()}>Escape</PrimaryButton>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Crash;
