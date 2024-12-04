'use client'

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '../../ui/button'
import { signIn } from "next-auth/react";
import Image from 'next/image'
import { toast } from 'react-toastify'



export function LoginComp(
    { setIsLogin }:
        { setIsLogin?: Dispatch<SetStateAction<boolean>> }
) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const { push } = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (result && result.error) {
            toast.error(result.error)
        } else {
            toast.success('Welcome back')
            push("/dashboard?tab=setup");
        }
    }

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Sign In Form */}
            <h1 className="mt-[40px] text-3xl font-semibold text-[#0a192f]">Sign In</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                    type="submit"
                    className="w-full bg-[#0a192f] hover:bg-[#172a46] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-8">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <span onClick={() =>setIsLogin? setIsLogin(false):push('/register')} className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                        Start Free Trial
                    </span>
                </p>
            </div>

            <div className="mt-6 p-4 bg-[#e8f5e9] rounded-md">
                <p className="text-sm text-gray-700">
                    Sentinela AI accounts now feature enhanced security protocols. Please ensure your password meets our new requirements.
                </p>
            </div>
        </div>
    )
}