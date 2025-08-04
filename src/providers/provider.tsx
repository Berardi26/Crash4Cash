'use client'
import React, { useMemo } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import AuthDebug from "@/components/auth/AuthDebug";
import ContextProvider from "./contextprovider";
import { PrivyProvider } from "@privy-io/react-auth";

const Provider = ({ children }: any) => {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID

    return (
        <PrivyProvider
            appId={appId ?? ""}
            clientId={clientId}
            config={{
                appearance: {
                    logo: "/assets/logo.png"
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    createOnLogin: 'all-users'
                },
                solanaClusters: [{ name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' }]
            }}>
            <HeroUIProvider >
                <ContextProvider>
                    <main className="dark text-foreground bg-background">
                        <ToastProvider placement="top-right" />
                        {children}
                        <AuthDebug />
                    </main>
                </ContextProvider>
            </HeroUIProvider>
        </PrivyProvider>
    )
}

export default Provider;