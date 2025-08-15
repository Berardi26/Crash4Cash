import { AuthProvider } from "@/contexts/AuthContext"
import { ChatMessagesProvider } from "@/contexts/ChatContext"
import { SettingProvider } from "@/contexts/SettingContext"
import { UserDataProvider } from "@/contexts/userDataContext"

const ContextProvider = ({ children }: any) => {
    return (
        <SettingProvider>
            <AuthProvider>
                <UserDataProvider>
                    <ChatMessagesProvider>
                        {children}
                    </ChatMessagesProvider>
                </UserDataProvider>
            </AuthProvider>
        </SettingProvider>
    )
}

export default ContextProvider