'use client'
import Layout from "@/components/layout/layout"
import { BarChartIcon, ClockIcon, EnterIcon, GearIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import OptionPanel from "./options"
import StatisticsPanel from "./statistics"
import TransactionsPanel from "./transactions"
import { option } from "framer-motion/client"
import { Button } from "@heroui/react"
import MenuButton from "@/components/button/menu"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import LogoutConfirm from "@/components/auth/LogoutConfirm"

const ProfilePage = () => {
    const { userProfile, logout } = useAuth()
    const { disconnect } = useWallet()
    const router = useRouter()
    const [selected, setSelected] = useState("options")
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    
    const options = [
        {
            icon: <GearIcon />,
            title: "Options",
            action: () => setSelected('options')
        },
        {
            icon: <BarChartIcon />,
            title: "Statistics",
            action: () => setSelected("statistics")
        },
        {
            icon: <ClockIcon />,
            title: "Transactions",
            action: () => setSelected("transactions")
        },
        {
            icon: <EnterIcon />,
            title: "Disconnect",
            action: () => setShowLogoutConfirm(true)
        },
    ]

    const handleLogoutConfirm = () => {
        logout()
        // Router redirect is handled in the logout function
    }

    const handleLogoutCancel = () => {
        setShowLogoutConfirm(false)
    }

    return (
        <ProtectedRoute>
            <Layout className="bg-crash bg-cover bg-center">
                <div className="flex flex-col gap-4 w-full bg-black/70 p-4 rounded-lg backdrop-blur-sm sm:h-[70vh] overflow-auto">
                    <div className="flex items-center justify-between">
                        <p className="text-3xl uppercase font-bold italic text-white">Profile</p>
                        {userProfile && (
                            <div className="text-right">
                                <p className="text-white text-sm">Welcome, {userProfile.username}!</p>
                                <p className="text-gray-400 text-xs">{userProfile.walletAddress?.slice(0, 4)}...{userProfile?.walletAddress?.slice(-4)}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            {options.map((option, idx) => (
                                <MenuButton key={idx} onPress={option.action} className={`w-full ${selected === option.title.toLocaleLowerCase() ? "bg-white/10 text-white" : ""}`} >
                                    {option.icon}
                                    {option.title}
                                </MenuButton>
                            ))}
                        </div>
                        <div className="flex flex-col w-full">
                            {selected === "options" && <OptionPanel />}
                            {selected === "statistics" && <StatisticsPanel />}
                            {selected === "transactions" && <TransactionsPanel />}
                        </div>
                    </div>
                </div>
            </Layout>
            
            <LogoutConfirm
                isOpen={showLogoutConfirm}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </ProtectedRoute>
    )
}

export default ProfilePage