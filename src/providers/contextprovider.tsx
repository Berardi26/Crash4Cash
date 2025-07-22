import { AuthProvider } from "@/contexts/AuthContext"
import { SettingProvider } from "@/contexts/SettingContext"

const ContextProvider = ({ children }: any) => {
    return(
        <SettingProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </SettingProvider>
    )
}

export default ContextProvider