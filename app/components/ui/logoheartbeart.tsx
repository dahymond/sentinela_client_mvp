import Image from "next/image";

const LogoHeartBeat = () => {
  return (
    <>
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
    </>
  );
};

export default LogoHeartBeat;
