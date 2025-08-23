import PrimaryButton from "@/components/button/primary"
import { useAuth } from "@/contexts/AuthContext"
import { addToast, Image, Input, Spinner, toast, user } from "@heroui/react"
import { CheckIcon, Link1Icon, LinkBreak1Icon } from "@radix-ui/react-icons"
import { useEffect, useRef, useState } from "react"
import React from "react"
import { useProfile } from "@/hooks/useProfile"
import LoadingSpinner from "@/components/auth/LoadingSpinner";
import { FaEdit } from "react-icons/fa"
import { FaCheck, FaScreenpal } from "react-icons/fa6"
import axios from "axios"

const EditName = () => {
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { userProfile } = useAuth();
    const [userName, setUserName] = useState(userProfile?.username || "");
    const { updateUser, } = useProfile();

    // Sync input with user changes
    useEffect(() => {
        setUserName(userProfile?.username ?? "");
    }, [userProfile?.username]);

    // Reset to default state after update
    useEffect(() => {
        if (!loading && focused) {
            setFocused(false);
        }
    }, [loading]);

    const handleEdit = async () => {
        if (userName && userName !== userProfile?.username) {
            setLoading(true);
            const result = await updateUserProfile({ username: userName })
            updateUser(result);
            setLoading(false);
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
            <PrimaryButton onClick={handleEdit} className="min-w-0" disabled={loading}>
                {loading ? <Spinner size="sm" color="white" /> : (focused ? <CheckIcon className="scale-150" /> : "Edit")}
            </PrimaryButton>
        </div>
    );
};

const EditEmail = () => {
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { userProfile } = useAuth();
    const [email, setEmail] = useState(userProfile?.email || "");
    const { updateUser, } = useProfile();

    // Sync input with userProfile changes
    useEffect(() => {
        setEmail(userProfile?.email || "");
    }, [userProfile?.email]);

    // Reset to default state after update
    useEffect(() => {
        if (!loading && focused) {
            setFocused(false);
        }
    }, [loading]);


    const handleEdit = async () => {
        if (email && email !== userProfile?.email) {
            setLoading(true);
            const result = await updateUserProfile({ email: email })
            updateUser(result);

            setLoading(false);
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
    const { userProfile, updateUser } = useAuth()
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(userProfile?.avatar ?? "/assets/images/avatar/default.webp");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const uploadFile = async () => {
        try {
            if (!file) {
                alert("No file selected");
                return;
            }
            setLoading(true);
            const data = new FormData();
            data.set("file", file);
            const uploadRequest = await fetch("/api/profile/avatar", {
                method: "POST",
                body: data,
            });
            const userData = await uploadRequest.json();
            if (userData)
                updateUser(userData)
            setFile(null)
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
            alert("Trouble uploading file");
        }
    };

    useEffect(() => {
        setPreview(userProfile?.avatar ?? "/assets/images/avatar/default.webp");
    }, [userProfile?.avatar])


    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex gap-8">
                <div className="flex flex-col gap-2">
                    <div className="p-1 border border-white/10 rounded-xl relative">
                        <Image src={preview} alt="Avatar" className="w-24 h-24 rounded-lg" />
                        {/* Upload button (styled label) */}
                        <div className="absolute right-0 top-0 bg-black/50 z-10 p-1 rounded-md cursor-pointer hover:scale-105 active:scale-100 hover:bg-black/60 transition"
                            onClick={() => inputRef.current?.click()} >
                            <FaEdit className="text-primary" />
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        {file !== null && <div className="absolute bottom-0 left-1/2 z-10 hover:scale-105 active:scale-100 cursor-pointer -translate-x-1/2 bg-success/80 hover:bg-success px-2  rounded-sm w-full content-center items-center flex justify-center text-center text-xs text-white/50 rounded-b-lg py-0.5"
                            onClick={() => uploadFile()}>
                            <FaCheck className="text-xl font-bold text-white" />
                        </div>}
                        {
                            loading && <div className="z-20 absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-md">
                                <FaScreenpal size={30} className='text-white/30 animate-spin' />
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xl text-white">{userProfile?.username}</p>
                            <p className="px-2 rounded-md border border-white/30 bg-white/10 text-white/40">{userProfile?.level ?? 0}</p>
                        </div>
                        <p className="text-sm text-white/40">
                            Joined <span>{userProfile?.createdAt?.toString() ?? new Date().getUTCDate()}</span>
                        </p>
                    </div>
                    <p className="text-sm text-white/30">Exp: <span>{userProfile?.exp}/5000</span></p>
                </div>
            </div>

            <div className="flex flex-col gap-8 justify-end pt-8">
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

const updateUserProfile = async (data: { username?: string, email?: string }) => {
    try {
        const uploadRequest = await fetch("/api/profile/info", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const userData = await uploadRequest.json();
        addToast({
            title: userData ? "Success" : "Failed",
            description: userData ? "User data updated successfully" : "Profile updating failed",
            color: userData ? "success" : "danger",
            variant: "bordered",
            classNames: {
                base: "text-white",
                title: "text-white",
                description: "text-white"
            }
        })
        return userData
    } catch (error) {
        console.error('Error updating profile:', error);
        return null;
    }
}


export default OptionPanel