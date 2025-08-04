import { ReactNode } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import { useSetting } from '@/contexts/SettingContext';

type LayoutProps = {
    children: ReactNode;
    className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
    return <div className={`flex h-dvh w-full overflow-hidden pt-[100px] text-white ${className}`}>
        <Navbar />
        <Sidebar />
        <div className={`w-full pl-[300px] flex place-content-center`}>
            <div className='max-w-7xl w-full px-2 xl:px-4 overflow-auto'>
            {children}
            </div>
        </div>
    </div>;
};

export default Layout;