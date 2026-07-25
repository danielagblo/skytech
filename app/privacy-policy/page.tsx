import Image from "next/image"

import SkytechBanner0 from "@/assets/images/SkytechBanner0.png"

function page() {
  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <Image src={SkytechBanner0} alt="Skytech Ghana" className="w-screen h-auto" />
      </div>
      privacy policy page
    </div>
  )
}

export default page
