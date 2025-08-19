'use client'
import { AuthProvider } from "@/contexts/AuthContext"
import { ChatMessagesProvider } from "@/contexts/ChatContext"
import { SettingProvider } from "@/contexts/SettingContext"
import { WSProvider } from "@/contexts/SocketContext"
import { UserDataProvider } from "@/contexts/userDataContext"

const ContextProvider = ({ children }: any) => {
    return (
        <SettingProvider>
            <AuthProvider>
                <UserDataProvider>
                    <WSProvider>
                        {children}
                    </WSProvider>
                </UserDataProvider>
            </AuthProvider>
        </SettingProvider>
    )
}

export default ContextProvider