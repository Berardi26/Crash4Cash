import Navbar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-col w-full h-full">
        <Navbar />
        {children}
    </div>;
};

export default Layout;