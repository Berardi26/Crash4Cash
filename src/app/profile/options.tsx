import PrimaryButton from "@/components/button/primary"
import { Image, Input } from "@heroui/react"
import { CheckIcon, Link1Icon, LinkBreak1Icon } from "@radix-ui/react-icons"
import { useRef, useState } from "react"

const EditName = () => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleEdit = () => {
        // Handle edit logic here
        if (focused) {

        }
        else {
            inputRef.current?.focus();
            setFocused(true);
        }
    }

    return (
        <div className="flex gap-3 items-end">
            <Input ref={inputRef} label="Name" type="text" value={"Ada"} labelPlacement="outside" className="max-w-lg" onFocusChange={(e) => setFocused(e)} classNames={{
                label: "!text-white/30",
                inputWrapper: "rounded-lg",
                base: ""
            }} />
            <PrimaryButton onClick={handleEdit} className="min-w-0">
                {focused ? <CheckIcon className="scale-150" /> :
                    "Edit"}</PrimaryButton>
        </div>
    )
}

const EditEmail = () => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleEdit = () => {
        // Handle edit logic here
        if (focused) {

        }
        else {
            inputRef.current?.focus();
            setFocused(true);
        }
    }

    return (
        <div className="flex gap-3 items-end">
            <Input ref={inputRef} label="Email" type="Email" value={"Ada"} labelPlacement="outside" className="max-w-lg" onFocusChange={(e) => setFocused(e)} classNames={{
                label: "!text-white/30",
                inputWrapper: "rounded-lg",
                base: ""
            }} />
            <PrimaryButton onClick={handleEdit} className="min-w-0">
                {focused ? <CheckIcon className="scale-150" /> :
                    "Edit"}</PrimaryButton>
        </div>
    )
}

const OptionPanel = () => {
    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex gap-8">
                <div className="flex flex-col gap-2">
                    <div className="p-1 border border-white/10 rounded-xl">
                        <Image src={"/assets/images/avatar/ada.jpg"} alt="Avatar" className="w-24 h-24 rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xl text-white">Cornan</p>
                            <p className="px-2 rounded-md border border-white/30 bg-white/10 text-white/40">3</p>
                        </div>
                        <p className="text-sm text-white/40">Joined <span>July 12th, 2025</span></p>
                    </div>
                    <p className="text-sm text-white/30">Exp: <span>3340/5000</span></p>
                </div>
            </div>

            <div className="flex flex-col gap-6 justify-end">
                <EditName />
                <EditEmail />
                <div className="flex gap-3 items-end">
                    <Input label="Conneted Account" type="address" disabled value={"5rdfasd...asd"} labelPlacement="outside" className="max-w-lg" classNames={{
                        label: "!text-white/30",
                        inputWrapper: "rounded-lg",
                        base: ""
                    }} />
                </div>
                <div className="flex gap-3 flex-col">
                    <p className="text-white/30 text-sm">Connected Apps</p>
                    <div className="flex gap-4 items-start justify-start">
                        <div className="rounded-lg flex border border-white/20 p-4  w-full max-w-[250px]">
                            <div>
                                <Image src={"/assets/images/icons/discord.png"} alt="Discord" className="flex-shrink-0 w-20 object-cover rounded-lg" />
                            </div>
                            <div className="flex flex-col items-center w-full gap-2">
                                <p className="text-xs">Airgear1336</p>
                                <PrimaryButton onClick={() => { }}>
                                    <LinkBreak1Icon className="scale-110" />
                                    Disconnect
                                </PrimaryButton>

                            </div>
                        </div>
                        <div className="rounded-lg flex border border-white/20 p-4  w-full max-w-[250px]">
                            <div>
                                <Image src={"/assets/images/icons/x.png"} alt="Discord" className="border border-white/20 rounded-full flex-shrink-0 w-20 object-cover shadow-md" />
                            </div>
                            <div className="flex flex-col items-center w-full gap-2">
                                <p className="text-xs">Twitter</p>
                                <PrimaryButton onClick={() => { }}>
                                    <Link1Icon className="scale-110" />
                                    Connect
                                </PrimaryButton>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


export default OptionPanel