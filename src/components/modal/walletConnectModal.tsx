'use client'
import { useState } from 'react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/modal";
import { Button, Image, Link, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import PrimaryButton from '../button/primary';
import { BellIcon, CaretRightIcon, DotIcon, DrawingPinFilledIcon, DrawingPinIcon, EnterIcon, EnvelopeClosedIcon, GroupIcon, LightningBoltIcon, MixerHorizontalIcon, ReaderIcon, TextAlignJustifyIcon } from '@radix-ui/react-icons';

const walletsList = [
    { name: 'Phantom', icon: '/assets/images/icons/phantom.svg', adapterName: 'Phantom' },
    { name: 'Backpack', icon: '/assets/images/icons/backpack.png', adapterName: 'Backpack' },
    { name: 'Solflare', icon: '/assets/images/icons/solflare.svg', adapterName: 'Solflare' },
    { name: 'Glow', icon: '/assets/images/icons/glow.png', adapterName: 'Glow' },
];


const WalletConnectModal = () => {

    const { wallets, select, connect, connected, disconnect } = useWallet();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const handleConnect = async (adapterName: string) => {
        console.log("adapter", adapterName)
        select(adapterName as WalletName);
        // Wait until the selected wallet updates
        setTimeout(async () => {
            try {
                await connect();
            } catch (err) {
                console.error("Connection error:", err);
            }
        }, 100);
    };

    const handleDisconnect = async () => {
        await disconnect()
    }

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

    return (
        <>
            <div className='flex'>
                {connected ? <div className='flex items-center gap-2 '>

                    <Popover classNames={{
                        content: "bg-black/60 backdrop-blur-sm"
                    }} placement={"bottom"}>
                        <PopoverTrigger>
                            <Button className='bg-transparent'>
                                <EnvelopeClosedIcon className='scale-150' />
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
                                    <Image src={"/assets/images/avatar/ada.jpg"} alt='avatar' className='rounded-md w-10 h-10' />
                                </div>
                                <div className='min-w-0 rounded-md bg-transparent w-12 h-12 items-center justify-center flex'>
                                    <TextAlignJustifyIcon className=' scale-150' />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='border rounded-md border-white/20 w-56 pt-2'>
                            <div className='flex flex-col w-full divide-y-1 divide-white/20 gap-1'>
                                <Link href='/profile' className='hover:bg-gradient-to-r from-primary-600 via-primary-200 to-primary-600 p-px rounded-lg flex  justify-between items-center w-full hover:bg-white/10'>
                                    <div className='flex items-center w-full rounded-lg justify-between bg-black'>
                                        <div className='flex items-center gap-2 bg-transparent min-w-0 '>
                                            <div className='bg-white/10 rounded-md p-px flex items-center justify-center flex-col'>
                                                <Image src={"/assets/images/avatar/ada.jpg"} alt='avatar' className='rounded-md w-10 h-10' />
                                            </div>
                                            <div>
                                                <div className='flex flex-col'>
                                                    <p className='text-white/60'>{`Ada`}</p>
                                                    <p className='text-xs'>Level 12</p>
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
                                        onPress={() => handleDisconnect()}>
                                        <EnterIcon />
                                        <p>Disconnect</p>
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
                    : <PrimaryButton
                        className=""
                        onClick={() => onOpen()}
                    >
                        {connected ? 'Connected' : 'Connect'}
                    </PrimaryButton>
                }
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='dark' size='xs'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 uppercase italic text-3xl">Connect</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2">
                                    {walletsList.map((wallet) => (
                                        <Button
                                            key={wallet.adapterName}
                                            variant="light"
                                            className="flex items-center justify-start gap-4 py-2 bg-black/40  font-bold text-white text-base h-14"
                                            onPress={async () => { await handleConnect(wallet.adapterName); onClose() }}
                                        >
                                            <Image src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-md" />
                                            {wallet.name}
                                        </Button>
                                    ))}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default WalletConnectModal;