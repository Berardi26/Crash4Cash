'use client';

import dynamic from 'next/dynamic';
import Layout from "../components/layout/layout";
import { useGameController } from "../hooks/useCrashGameController";

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
    score,
    crashed,
  } = useGameController();

  return (
    <Layout className="bg-crash bg-cover bg-center">
      <div className="flex flex-col w-full bg-opacity-15 flex-1">
        <div className="flex flex-col w-full h-full bg-black/70">
          <div className="w-[800px] h-[600px] relative">
            <PhaserGame onReady={setGameInstance} />
          </div>

          <button onClick={() => triggerLaunch()}>Launch</button>
        </div>
      </div>
    </Layout>
  );
};

export default Crash;
