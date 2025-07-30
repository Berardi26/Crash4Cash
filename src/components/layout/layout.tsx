import { ReactNode } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import { useSetting } from '@/contexts/SettingContext';

type LayoutProps = {
    children: ReactNode;
    className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
    return <div className={`flex flex-col w-full h-full ${className} min-h-screen `}>
        <Navbar />
        <div className="flex w-full pt-20">
            <Sidebar />
            <div className={`mx-auto w-full duration-150 max-w-screen-lg pt-24 `}>
                {children}
            </div>
        </div>
    </div>;
};

export default Layout;