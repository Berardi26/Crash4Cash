import Link from "next/link";
import { CoinIcon, XIcon } from "../icos/svg";
import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const Navbar = () => {
    return <div className="flex w-full">
        <div className="w-20 sm:w-32 lg:w-52">
            <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>
        <div className="flex flex-col w-full">
            <div className="items-center w-full h-[40px] bg-[#0D0D0D] shrink-0 px-6 hidden lg:flex gap-2">
                <div className="flex gap-1 md:gap-2.5">
                    <Link href={"https://x.com/cornel_p"} target="_blank" className="group relative overflow-hidden transition duration-300 bg-[#303030]  text-sm font-medium h-6 w-6 p-0 min-w-0 flex items-center justify-center text-white/50 hover:text-white rounded-[6px] cursor-pointer">
                        <XIcon />
                    </Link>
                </div>
                <div className="flex gap-1 md:gap-2.5">
                    <Link href={"https://x.com/cornel_p"} target="_blank" className="group relative overflow-hidden transition duration-300 bg-[#303030]  text-sm font-medium h-6 w-6 p-0 min-w-0 flex items-center justify-center text-white/50 hover:text-white rounded-[6px] cursor-pointer">
                        <DiscordLogoIcon />
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-end md:justify-between w-full px-6 grow bg-black/70">
                <Link href={`/leaderboard`} >
                    <div className="flex items-center gap-2">
                        <CoinIcon />
                        <span className="text-sm font-medium uppercase bg-gradient-to-r from-[#7858fe] via-[#bd74ff] to-[#7858fe] bg-clip-text text-transparent text-clip text-xl font-bold shadow-sm">Leaderboard</span>
                    </div>
                </Link>
            </div>
        </div>
    </div>;
};

export default Navbar;
