import { Image } from "@heroui/react"
import RecentGame from "./recentgame"

const StatisticsPanel = () => {
    return (
        <div className="flex flex-col gap-4 ">
            <p className="text-white/80 text-lg">Total Profit</p>
            <div className="rounded-lg bg-gradient-to-r from-green-700 via-green-400 to-green-900 p-px">
                <div className="bg-black/90 rounded-lg flex items-center gap-3 p-4">
                    <p className="text-success-500 text-4xl">+</p>
                    <Image src="/assets/game/image/token.png" alt="token" className="w-12 h-12" />
                    <p className="text-3xl font-bold text-white">1000</p>
                </div>
            </div>

            <p className="text-white/80 text-lg">Recent Game</p>
            <RecentGame />


        </div>
    )
}


export default StatisticsPanel

