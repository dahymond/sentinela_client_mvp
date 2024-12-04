'use client'

import { DashboardComponent } from "../components/sections/dashboard/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const { data: session, status } = useSession();
    const { push } = useRouter()
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div className='flex w-screen h-screen items-center justify-center bg-gray-200'>
            Access Denied. Please {" "}
            <span onClick={() => push('/')} className='cursor-pointer underline text-blue-700'>log in.</span>
        </div>;
    }
    return <DashboardComponent />
}

export default Dashboard