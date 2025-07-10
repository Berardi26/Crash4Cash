import { ReactNode } from 'react';
import Chatbox from "./Chatbox";
import Navbar from "./navbar";

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