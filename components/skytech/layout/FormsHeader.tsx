"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FormsHeader() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 z-30 w-full">
      <div className="relative flex items-center justify-center bg-brand-700/95 px-4 py-2 shadow-soft backdrop-blur-md md:justify-start md:px-6">
        <Image
          src="/try1.png"
          alt="SkyTech Logo"
          width={800}
          height={300}
          sizes="128px"
          className="h-10 w-auto cursor-pointer transition hover:scale-[1.02] md:h-12"
          onClick={() => router.push("/")}
          priority
        />
      </div>
    </header>
  );
}
