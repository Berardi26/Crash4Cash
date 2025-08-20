import { ReactNode } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import AuthDebug from '../auth/AuthDebug';
type LayoutProps = {
    children: ReactNode;
    className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
    return <div className={`flex h-dvh w-full overflow-hidden pt-[100px] text-white ${className}`}>
        <Navbar />
        <Sidebar />
        <div className={`w-full pl-[300px] flex place-content-center`}>
            <div className='w-full overflow-auto scrollbar-hide'>
                {children}
            </div>
            <AuthDebug />
        </div>
    </div>;
};

export default Layout;