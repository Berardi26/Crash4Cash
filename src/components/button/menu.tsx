import { Button } from "@heroui/react"

interface MenuButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
}

const MenuButton = ({ children, onPress, className }: MenuButtonProps) => {
    return (
        <Button onPress={onPress} className={`hover:bg-white/10 rounded-md flex gap-2 items-center bg-transparent text-white/40 hover:text-white justify-start ${className}`}>
            {children}
        </Button>
    )
}

export default MenuButton;