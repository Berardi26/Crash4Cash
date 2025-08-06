'use client'
import React, { useMemo } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import AuthDebug from "@/components/auth/AuthDebug";
import ContextProvider from "./contextprovider";
import { PrivyProvider } from "@privy-io/react-auth";
import { ModalProvider } from "@/contexts/modalContext";


const Provider = ({ children }: any) => {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID


    return (
        <PrivyProvider
            appId={appId ?? ""}
            clientId={clientId}
            config={{
                "appearance": {
                    "accentColor": "#6A6FF5",
                    "theme": "#FFFFFF",
                    "showWalletLoginFirst": false,
                    logo: "https://lavender-necessary-trout-238.mypinata.cloud/ipfs/bafkreifjiniza7k2btq5jzpu355k6qvpgqhpspmgvc5tm44couwo3ngiru",
                    "walletChainType": "solana-only",
                    "walletList": [
                        "detected_solana_wallets",
                        "phantom",
                        "solflare",
                        "backpack",
                        "okx_wallet"
                    ]
                },
                "loginMethods": [
                    "wallet"
                ],
                "fundingMethodConfig": {
                    "moonpay": {
                        "useSandbox": true
                    }
                },
                "embeddedWallets": {
                    "requireUserPasswordOnCreate": false,
                    "showWalletUIs": true,
                    "ethereum": {
                        "createOnLogin": "off"
                    },
                    "solana": {
                        "createOnLogin": "users-without-wallets"
                    }
                },
            }}
        >
            <HeroUIProvider >
                <ContextProvider>
                    <ModalProvider>
                        <main className="dark text-foreground bg-background">
                            <ToastProvider placement="top-right" />
                            {children}
                            <AuthDebug />
                        </main>
                    </ModalProvider>
                </ContextProvider>
            </HeroUIProvider>
        </PrivyProvider >
    )
}

export default Provider;