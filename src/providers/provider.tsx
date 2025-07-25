'use client'
import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider, } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthDebug from "@/components/auth/AuthDebug";
import { SettingProvider } from "@/contexts/SettingContext";
import ContextProvider from "./contextprovider";
require("@solana/wallet-adapter-react-ui/styles.css");

const Provider = ({ children }: any) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <HeroUIProvider >
                        <ContextProvider>
                            <main className="dark text-foreground bg-background">
                                <ToastProvider placement="top-right" />
                                {children}
                                <AuthDebug />
                            </main>
                        </ContextProvider>
                    </HeroUIProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default Provider;