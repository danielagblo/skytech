import Image from "next/image";
import bannerImage from "@/assets/images/bannerImage.png";

export default function Home() {
  return (
    <>
      <div className="relative h-[3000px] overflow-x-hidden">
        <Image
          src={bannerImage}
          alt="Banner Image"
          className="absolute top-0 left-0 w-screen h-auto -z-10"
          loading="eager"
          priority
        />
      </div>
    </>
  );
}
