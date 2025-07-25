import { AuthProvider } from "@/contexts/AuthContext"
import { SettingProvider } from "@/contexts/SettingContext"
import { UserDataProvider } from "@/contexts/userDataContext"

const ContextProvider = ({ children }: any) => {
    return (
        <SettingProvider>
            <AuthProvider>
                <UserDataProvider>
                    {children}
                </UserDataProvider>
            </AuthProvider>
        </SettingProvider>
    )
}

export default ContextProvider