import Chatbox from "./Chatbox";
import Navbar from "./navbar";

const Layout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={`flex flex-col w-full h-full ${className} min-h-screen`}>
        <Navbar />
        <div className="flex ">
            <Chatbox />
            {children}
        </div>
    </div>;
};

export default Layout;