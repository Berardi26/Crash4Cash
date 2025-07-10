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
import { Button, Image } from '@heroui/react';
import PrimaryButton from '../button/primary';

const walletsList = [
    { name: 'Phantom', icon: '/assets/images/icons/phantom.svg', adapterName: 'Phantom' },
    { name: 'Backpack', icon: '/assets/images/icons/backpack.png', adapterName: 'Backpack' },
    { name: 'Solflare', icon: '/assets/images/icons/solflare.svg', adapterName: 'Solflare' },
    { name: 'Glow', icon: '/assets/images/icons/glow.png', adapterName: 'Glow' },
];


const WalletConnectModal = () => {

    const { wallets, select, connect, connected } = useWallet();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const handleConnect = async (adapterName: string) => {
        select(adapterName as WalletName);
        await connect();
        onClose()
    };

    return (
        <>
            <PrimaryButton
                className=""
                onClick={() => onOpen()}
            >
                {connected ? 'Connected' : 'Connect'}
            </PrimaryButton>

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
                                            onPress={() => handleConnect(wallet.adapterName)}
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