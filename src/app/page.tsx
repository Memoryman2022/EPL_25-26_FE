import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Image
          src="/icons/predict.png"
          alt="WELCOME"
          width={180}
          height={180}
          priority
          className="-mt-28"
        />
      </main>
    </div>
  );
}
