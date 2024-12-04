'use client'
import { DashboardComponent } from "../components/sections/dashboard/dashboard";
import { useSession } from "next-auth/react";

const Dashboard = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Please log in</div>;
    }
    return <DashboardComponent />
}

export default Dashboard