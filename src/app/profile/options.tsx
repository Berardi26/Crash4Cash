import PrimaryButton from "@/components/button/primary"
import { useAuth } from "@/contexts/AuthContext"
import { addToast, Image, Input, Spinner, toast, user } from "@heroui/react"
import { CheckIcon, Link1Icon, LinkBreak1Icon } from "@radix-ui/react-icons"
import { useEffect, useRef, useState } from "react"
import React from "react"
import { useProfile } from "@/hooks/useProfile"
import LoadingSpinner from "@/components/auth/LoadingSpinner";

const EditName = () => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const [userName, setUserName] = useState(user?.username);
    const { updateProfile, loading, error, success } = useProfile();

    // Sync input with user changes
    useEffect(() => {
        setUserName(user?.username);
    }, [user?.username]);

    // Reset to default state after update
    useEffect(() => {
        if (!loading && focused) {
            setFocused(false);
        }
    }, [loading]);

    const handleEdit = async () => {
        console.log("A")
        if (userName && userName !== user?.username) {
            console.log("B")
            const result = await updateProfile({ username: userName });
            addToast({
                title: result ? "Success" : "Failed",
                description: result ? "User name updated successfully" : "Updating username failed",
                color: result ? "success" : "danger",
                variant:"bordered",
                classNames:{
                    base:"text-white",
                    title:"text-white",
                    description:"text-white"
                }
            })
            setFocused(false)
        }
        // Spinner will show while loading, then useEffect will reset focus
    };

    return (
        <div className="flex gap-3 items-end">
            <Input
                ref={inputRef}
                label="Name"
                type="text"
                value={userName}
                labelPlacement="outside"
                className="max-w-lg"
                onValueChange={setUserName}
                onFocusChange={setFocused}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); }}
                classNames={{
                    label: "text-white/30!",
                    inputWrapper: "rounded-lg",
                    base: ""
                }}
            />
            <PrimaryButton onMouseDown={handleEdit} className="min-w-0" disabled={loading}>
                {loading ? <Spinner size="sm" color="white" /> : (focused ? <CheckIcon className="scale-150" /> : "Edit")}
            </PrimaryButton>
        </div>
    );
};

const EditEmail = () => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const [email, setEmail] = useState(user?.email || "");
    const { updateProfile, loading, error, success } = useProfile();

    // Sync input with user changes
    useEffect(() => {
        setEmail(user?.email || "");
    }, [user?.email]);

    // Reset to default state after update
    useEffect(() => {
        if (!loading && focused) {
            setFocused(false);
        }
    }, [loading]);


    const handleEdit = async () => {
        console.log("A")
        if (email !== user?.email) {
            console.log("B")
            const result = await updateProfile({ email: email || null });
            addToast({
                title: result ? "Success" : "Failed",
                description: result ? "Email updated successfully. Verify now" : "Updating Email failed",
                color: result ? "success" : "danger",
                variant:"bordered",
                classNames:{
                    base:"text-white",
                    title:"text-white",
                    description:"text-white"
                }
            })
            setFocused(false)
        }
        // Spinner will show while loading, then useEffect will reset focus
    };

    return (
        <div className="flex gap-3 items-end">
            <Input
                ref={inputRef}
                label="Email"
                type="Email"
                value={email}
                onValueChange={setEmail}
                labelPlacement="outside"
                className="max-w-lg"
                onFocusChange={setFocused}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); }}
                classNames={{
                    label: "text-white/30!",
                    inputWrapper: "rounded-lg",
                    base: ""
                }}
            />
            <PrimaryButton onMouseDown={handleEdit} className="min-w-0" disabled={loading}>
                {loading ? <Spinner size="sm" color="white" /> : (focused ? <CheckIcon className="scale-150" /> : "Edit")}
            </PrimaryButton>
        </div>
    );
};

const OptionPanel = () => {
    const { user, isAuthenticated } = useAuth()
    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex gap-8">
                <div className="flex flex-col gap-2">
                    <div className="p-1 border border-white/10 rounded-xl">
                        <Image src={"/assets/images/avatar/default.webp"} alt="Avatar" className="w-24 h-24 rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xl text-white">{user?.username}</p>
                            <p className="px-2 rounded-md border border-white/30 bg-white/10 text-white/40">{user?.level ?? 0}</p>
                        </div>
                        <p className="text-sm text-white/40">
                            Joined <span>{user?.createdAt?.toString() ?? new Date().getUTCDate()}</span>
                        </p>
                    </div>
                    <p className="text-sm text-white/30">Exp: <span>{user?.exp}/5000</span></p>
                </div>
            </div>

            <div className="flex flex-col gap-6 justify-end">
                <EditName />
                <EditEmail />
                <div className="flex gap-3 items-end">
                    <Input label="Conneted Account" type="address" disabled value={"5rdfasd...asd"} labelPlacement="outside" className="max-w-lg" classNames={{
                        label: "text-white/30!",
                        inputWrapper: "rounded-lg",
                        base: ""
                    }} />
                </div>
                <div className="flex gap-3 flex-col">
                    <p className="text-white/30 text-sm">Connected Apps</p>
                    <div className="flex gap-4 items-start justify-start">
                        <div className="rounded-lg flex border border-white/20 p-4  w-full max-w-[250px]">
                            <div>
                                <Image src={"/assets/images/icons/discord.png"} alt="Discord" className="shrink-0 w-20 object-cover rounded-lg" />
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
                                <Image src={"/assets/images/icons/x.png"} alt="Discord" className="border border-white/20 rounded-full shrink-0 w-20 object-cover shadow-md" />
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