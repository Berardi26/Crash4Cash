import { ReactNode } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import { useSetting } from '@/contexts/SettingContext';

type LayoutProps = {
    children: ReactNode;
    className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
    return <div className={`flex h-dvh w-full overflow-hidden pt-[68px] text-white md:pt-[73px] lg:-mt-[73px] ${className}`}>
        <Navbar />
        <Sidebar />
        <div className={`ml-[300px] h-full min-h-[80vh] w-[calc(100vw-300px)] grow overflow-auto overflow-x-hidden scrollbar-hidden pt-24 `}>
            {children}
        </div>
    </div>;
};

export default Layout;