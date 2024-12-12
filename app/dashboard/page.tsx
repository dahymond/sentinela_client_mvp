"use client";

import { DashboardComponent } from "../components/sections/dashboard/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogoHeartBeat from "../components/ui/logoheartbeart";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <LogoHeartBeat/>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex w-screen h-screen gap-2 items-center justify-center bg-gray-200">
        Access Denied. Please refresh this page or {" "}
        <span
          onClick={() => push("/")}
          className="cursor-pointer underline text-blue-700"
        >
          log in.
        </span>
        here
      </div>
    );
  }
  return <DashboardComponent session={session} />;
};

export default Dashboard;
