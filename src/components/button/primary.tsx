import { Button } from "@heroui/react";
import React from "react";
import { FaScreenpal } from "react-icons/fa6";

const PrimaryButton = ({ children, className, onClick, disabled = false, loading = false }: { children: React.ReactNode, className?: string, onClick?: () => void, onMouseDown?: (e: React.MouseEvent) => void, disabled?: boolean, loading?: boolean }) => {
    return (
        <Button color='default' className={`${disabled ? "cursor-not-allowed" : ""} p-[2px] rounded-xl ${className}`} onPress={onClick} disabled={disabled || loading}>
            <div className={`${disabled ? "bg-black/20" : "bg-primary"} flex items-center justify-center rounded-[10px] w-full h-full content-center font-bold px-3`}>
                {loading ? (
                    <FaScreenpal className="animate-spin mx-auto" />
                )
                    :
                    children
                }
            </div>
        </Button>
    )
}

export default PrimaryButton;