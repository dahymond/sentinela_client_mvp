"use client";

import { DashboardComponent } from "../components/sections/dashboard/dashboard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="image-container">
          <Image
            src={"/brandLogo/sentinela-04.jpg"}
            width={200}
            height={200}
            alt="sentinela_logo"
            className="w-[100px] h-[100px]"
          />
        </div>
        {/* <p>Loading</p> */}
        <style jsx>{`
          @keyframes heartbeat {
            0% {
              transform: scale(0.7);
              opacity: 1;
            }
            50% {
              transform: scale(1);
              opacity: 0.5;
            }
            100% {
              transform: scale(0.7);
              opacity: 1;
            }
          }

          .image-container :global(img) {
            animation: heartbeat 1.5s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex w-screen h-screen gap-2 items-center justify-center bg-gray-200">
        Access Denied. Please{" "}
        <span
          onClick={() => push("/")}
          className="cursor-pointer underline text-blue-700"
        >
          log in.
        </span>
      </div>
    );
  }
  return <DashboardComponent session={session} />;
};

export default Dashboard;
