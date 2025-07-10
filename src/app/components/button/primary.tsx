import React from "react";

const PrimaryButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className="flex items-center justify-center">
            <button className="bg-gradient-to-t from-[#222222] to-[#303030] p-[3px] rounded-2xl transition-opacity duration-300 cursor-pointer gb-blur-background-image">
                <div className={`flex flex-col justify-center items-center w-[123px] text-base gap-0.5 transition-colors duration-300 text-primary relative h-full ${className || ''}`}>
                    <div className="group relative h-10 min-w-10 overflow-hidden rounded-xl transition duration-300 px-4 w-full bg-primary hover:bg-primary/75 text-sm font-bold text-white flex items-center justify-center gap-1.5 ml-auto cursor-pointer">
                        {children}
                    </div>
                </div>
            </button>
        </div>
    )
}

export default PrimaryButton;