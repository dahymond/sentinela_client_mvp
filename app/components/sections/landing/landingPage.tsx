'use client'
import { useState } from "react"
import RightSectionLandingPage from "./rightSection"
import { LoginComp } from "./loginComp"
import RegisterComp from "./registerComp"
import Image from "next/image"

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    return (
        <div className="flex min-h-screen">
            {/* Left Side */}
            <div className="flex-1 flex flex-col items-center px-12 py-8 bg-white pt-20">
                {/* Logo */}
                <div className="max-w-md ">
                    <Image src={"/brandLogo/sentinela03.png"} width={300} height={300} alt={"sentinela logo"} className='-ml-4' />
                    {isLogin ? <LoginComp setIsLogin={setIsLogin} /> : <RegisterComp setIsLogin={setIsLogin} />}

                </div>
            </div>
            {/* Right Side */}
            <RightSectionLandingPage />
        </div>
    )
}

export default LandingPage