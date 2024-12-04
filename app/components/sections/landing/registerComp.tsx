"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

export default function RegisterComp(
    { setIsLogin }:
        { setIsLogin?: Dispatch<SetStateAction<boolean>> }
) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const { push } = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            // Check for HTTP status
            if (!response.ok) {
                const errorText = await response.json();
                toast.error("Registration failed: " + errorText.message);
                return;
            }
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (result && result.error) {
                toast.error(result.error)
            } else {
                toast.success("Successful. Welcome to Sentinela");
                push("/dashboard?tab=setup");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong during registration.");
        }
    };
    

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Registration Form */}
            <h1 className="mt-[40px] text-3xl font-semibold text-[#0a192f]">Start Free Trial</h1>

            <form className="mt-8 space-y-6">
                <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email*
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password*
                    </Label>
                    <div className="relative mt-1">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="text-sm">
                    <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </Link>
                </div>

                <Button
                    onClick={handleRegister}
                    className="w-full bg-[#0a192f] hover:bg-[#172a46] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Start Free Trial
                </Button>
            </form>

            <div className="mt-8">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <span onClick={() =>setIsLogin? setIsLogin(true):push('/login')} className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                        Login
                    </span>
                </p>
            </div>

            <div className="mt-6 p-4 bg-[#e8f5e9] rounded-md">
                <p className="text-sm text-gray-700">
                    Sentinela AI accounts now feature enhanced security protocols. Please ensure your password meets our new requirements.
                </p>
            </div>
        </div>
    );
}