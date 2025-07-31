import { Button } from "@heroui/react";
import React from "react";

const PrimaryButton = ({ children, className, onClick, onMouseDown, disabled }: { children: React.ReactNode, className?: string, onClick?: () => void, onMouseDown?: (e: React.MouseEvent) => void, disabled?: boolean }) => {
    return (
        <Button className="min-w-0 bg-linear-to-t from-[#222222] to-[#303030] p-[3px] rounded-xl transition-opacity duration-300 cursor-pointer gb-blur-background-image" onClick={onClick} onMouseDown={onMouseDown} disabled={disabled}>
            <div className={`flex flex-col justify-center items-center text-base gap-0.5 transition-colors duration-300 text-primary relative h-full ${className || ''}`}>
                <div className="group relative h-9 min-w-10 overflow-hidden rounded-lg transition duration-300 px-4 w-full bg-primary hover:bg-primary/75 text-sm font-bold text-white flex items-center justify-center gap-1.5 ml-auto cursor-pointer">
                    {children}
                </div>
            </div>
        </Button>
    )
}

export default PrimaryButton;