'use client'
import { useEffect, useState } from 'react';
import { useLogin, usePrivy } from "@privy-io/react-auth";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/modal";
import { Button, Image, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import PrimaryButton from '../button/primary';
import { BellIcon, CaretRightIcon, DrawingPinIcon, EnterIcon, EnvelopeClosedIcon, GroupIcon, LightningBoltIcon, MixerHorizontalIcon, ReaderIcon, TextAlignJustifyIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FaScreenpal, FaSolarPanel } from 'react-icons/fa6';

const walletsList = [
    { name: 'Phantom', icon: '/assets/images/icons/phantom.svg', adapterName: 'Phantom' },
    { name: 'Solflare', icon: '/assets/images/icons/solflare.svg', adapterName: 'Solflare' },
];


const WalletConnectModal = () => {

    const { userProfile, loading, fetchingBalance, balance } = useAuth();
    const {
        user,
        authenticated,
        linkWallet,
        login,
        logout
    } = usePrivy();
    const quickLinks = [
        {
            icon: <DrawingPinIcon />,
            title: "FF Leaderboard",
            path: "/leaderboard"
        },
        {
            icon: <MixerHorizontalIcon />,
            title: "Options",
            path: "/options"
        },
        {
            icon: <LightningBoltIcon />,
            title: "Statistac",
            path: "/statistic"
        },
        {
            icon: <ReaderIcon />,
            title: "Transactions",
            path: "/transactions"
        },
    ]

    useEffect(() => {
        console.log("wallet", user?.wallet)
    }, [user?.wallet])

    return (
        <>
            <div className='flex'>
                {userProfile?.walletAddress ? <div className='flex items-center gap-2 '>
                    <Popover classNames={{
                        content: "bg-black/60 backdrop-blur-sm"
                    }} placement={"bottom"}>
                        <PopoverTrigger>
                            <Button className='bg-white/10 rounded-md relative'>
                                <Image src={`/assets/images/solana.png`} alt='solana' className='w-5 h-5' />
                                <p>{balance.toFixed(3)}</p>
                                <div className='bg-primary w-12 rounded-t-xl h-[2px] bottom-0 absolute left-1/2 -translate-x-1/2'> </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='border rounded-md border-white/20 w-20'>
                            <div className='flex flex-col w-full divide-y-1 divide-white/20 gap-1'>
                                <div className='min-h-32'>

                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Popover classNames={{
                        content: "bg-black/60 backdrop-blur-sm"
                    }} placement={"bottom"}>
                        <PopoverTrigger>
                            <Button className='bg-white/10 rounded-md relative'>
                                <EnvelopeClosedIcon className='scale-150' />
                                <div className='bg-primary w-12 rounded-t-xl h-[2px] bottom-0 absolute left-1/2 -translate-x-1/2'> </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='border rounded-md border-white/20 w-56'>
                            <div className='flex flex-col w-full divide-y-1 divide-white/20 gap-1'>
                                <div className=' flex justify-between items-center w-full'>
                                    <div className='flex items-center gap-2'>
                                        <BellIcon />
                                        <p className='text-white/30'>Notifications</p>
                                    </div>
                                    <div>
                                        <span className='px-2 flex items-center h-8 border rounded-md border-white/20 text-white/30'>
                                            {0}
                                        </span>
                                    </div>
                                </div>
                                <div className='min-h-32'>

                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover classNames={{
                        content: "bg-black/60 backdrop-blur-sm"
                    }} placement={"bottom-end"}>
                        <PopoverTrigger>
                            <Button className='flex items-center min-w-0 bg-transparent px-1'>
                                <div className='bg-white/10 rounded-md p-px flex items-center justify-center flex-col'>
                                    <Image src={userProfile?.avatar ?? '/assets/images/avatar/default.webp'} alt='avatar' className='rounded-md w-10 h-10' />
                                </div>
                                <div className='min-w-0 rounded-md bg-transparent w-12 h-12 items-center justify-center flex'>
                                    <TextAlignJustifyIcon className=' scale-150' />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='border rounded-md border-white/20 w-56 pt-2'>
                            <div className='flex flex-col w-full divide-y-1 divide-white/20 gap-1'>
                                <Link href='/profile' className='hover:bg-linear-to-r from-primary-600 via-primary-200 to-primary-600 p-px rounded-lg flex  justify-between items-center w-full hover:bg-white/10'>
                                    <div className='flex items-center w-full rounded-lg justify-between bg-black'>
                                        <div className='flex items-center gap-2 bg-transparent min-w-0 '>
                                            <div className='bg-white/10 rounded-md p-px flex items-center justify-center flex-col'>
                                                <Image src={userProfile?.avatar ?? '/assets/images/avatar/default.webp'} alt='avatar' className='rounded-md w-10 h-10' />
                                            </div>
                                            <div>
                                                <div className='flex flex-col'>
                                                    {/* <p className='text-white/60'>{user.username}</p>
                                                    <p className='text-xs'>Level {user.level}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                        <Button className='bg-transparent text-white/20 hover:text-white min-w-0'>
                                            <CaretRightIcon className='scale-150' />
                                        </Button>
                                    </div>
                                </Link>
                                <div className='min-h-32 flex flex-col gap-2 pt-2 pb-2'>

                                    {quickLinks.map((item, idx) => (
                                        <Button key={idx} className='hover:bg-white/10 rounded-md flex gap-2 items-center bg-transparent text-white/40 hover:text-white justify-start'>
                                            {item.icon}
                                            <p>{item.title}</p>
                                        </Button>
                                    ))}

                                    <Button className='hover:bg-white/10 rounded-md flex gap-2 items-center bg-transparent text-white/40 hover:text-white justify-start'
                                        onPress={() => logout()}>
                                        <EnterIcon />
                                        <p>Disconnect</p>
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
                    :
                    loading ?
                        <div className=''>
                            <FaScreenpal className="animate-spin mx-auto" />
                        </div> :
                        <PrimaryButton
                            className=""
                            onClick={
                                () => {
                                    console.log(user)
                                    if (authenticated) {
                                        logout()
                                    }
                                    else {
                                        if (user?.wallet) {
                                            linkWallet()
                                        }
                                        else {
                                            login()
                                        }
                                    }
                                }
                            }
                        >
                            {user?.wallet?.address ? user?.wallet?.address.slice(0, 5) + "..." + user?.wallet?.address.slice(-4) : "Sign in"}
                        </PrimaryButton>
                }
            </div>
        </>
    )
}

export default WalletConnectModal;