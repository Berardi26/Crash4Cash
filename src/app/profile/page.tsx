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

const ProfilePage = () => {

    const [selected, setSelected] = useState("options")
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
            action: () => handleDisconnect()
        },
    ]

    const handleDisconnect = () => {

    }


    return (
        <Layout className="bg-crash bg-cover bg-center">
            <div className="flex flex-col gap-4 w-full bg-black/70 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl uppercase font-bold italic text-white">Profile</p>
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
    )
}


export default ProfilePage