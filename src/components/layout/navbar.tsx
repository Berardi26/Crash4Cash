'use client'
import Link from "next/link";
import { CoinIcon, XIcon } from "../icos/svg";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import WalletConnectModal from "../modal/walletConnectModal";
import { Image } from "@heroui/react";

const Navbar = () => {

    return <div className="flex w-full fixed top-0 left-0 z-50">
        <div className="w-20 sm:w-32 lg:w-52 min-w-[320px] bg-black/80 flex items-center justify-center flex-col">
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="logo" className="w-20 h-20" />
                <div className="relative">
                    <div className="text-2xl font-bold italic">
                        <span className="uppercase text-primary-400">futuresea</span>
                    </div>
                    <div className="text-2xl font-bold italic absolute top-0">
                        <span className="transition duration-150 uppercase animate-ping">F</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-75">u</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-150">t</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-200">U</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-300">R</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-400">E</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-500">s</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-600">E</span>
                        <span className="transition duration-150 uppercase animate-ping animation-delay-700">A</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col w-full">
            <div className="items-center w-full h-[40px] bg-black/90 flex shrink-0 px-6 gap-2">
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
            <div className="flex items-center h-[60px] justify-end md:justify-between w-full px-6 grow bg-black/80">
                <div className="flex items-center gap-4">
                    <Link href={`/crash`} >
                        <div className="flex items-center gap-2">
                            <span className="uppercase bg-linear-to-r from-primary-500 via-primary-200 to-primary-700 bg-clip-text text-transparent text-clip text-xl font-bold shadow-sm">Crash</span>
                        </div>
                    </Link>
                    <Link href={`/coinflip`} >
                        <div className="flex items-center gap-2">
                            <span className="uppercase bg-linear-to-r from-primary-500 via-primary-200 to-primary-700 bg-clip-text text-transparent text-clip text-xl font-bold shadow-sm">Coinflip</span>
                        </div>
                    </Link>
                    <Link href={`/fomo`} >
                        <div className="flex items-center gap-2">
                            <span className="uppercase bg-linear-to-r from-primary-500 via-primary-200 to-primary-700 bg-clip-text text-transparent text-clip text-xl font-bold shadow-sm">Fomo</span>
                        </div>
                    </Link>
                    {/* {isAuthenticated && user && (
                        <Link href="/profile" className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition-colors">
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white text-sm font-medium hidden sm:block">
                                {user.username}
                            </span>
                        </Link>
                    )} */}
                </div>
                <WalletConnectModal />
            </div>
        </div>
    </div>;
};

export default Navbar;
