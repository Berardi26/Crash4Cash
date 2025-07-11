import { ReactNode } from 'react';
import Navbar from "./navbar";
import Chatbox from '../chatbox/chatbox';

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
    return <div className={`flex flex-col w-full h-full ${className} min-h-screen`}>
        <Navbar />
        <div className="flex ">
            <Chatbox />
            {children}
        </div>
    </div>;
};

export default Layout;