import Image from "next/image"
import sponsorImage from "@/assets/images/placeholderSponsor.png"
import whatsAppIcon from "@/assets/icons/whatsappLogo.svg"

const sponsorSizes = [
  "w-18 h-auto",
  "w-24 h-auto", 
  "w-16 h-auto",
  "w-28 h-auto",
  "w-30 h-auto",
  "w-32 h-auto",
  "w-16 h-auto",
  "w-20 h-auto",
  "w-24 h-auto",
  "w-20 h-auto",
  "w-18 h-auto",
]

function Footer( { className }: { className?: string } ) {
  return (
    <div>
      <div className="grid grid-cols-3 px-4 space-x-4 bg-white">
        {/* Will later make an array of sponsor images and loop over that */}
        <div className="flex flex-row flex-wrap items-center justify-start gap-x-2">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className={`${sponsorSizes[index % sponsorSizes.length]} shrink-0`}>
            <Image
              src={sponsorImage}
              alt="Skytech Ghana Logo"
              className="object-contain"
            />
          </div>
        ))}
        </div>
        <div className="space-y-6 pt-10">
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/pricing">Best Pricing</a>
              </li>
              <li>
                <a href="/about">Why Choose Us?</a>
              </li>
              <li>
                <a href="/web-solutions">Website Development</a>
              </li>
              <li>
                <a href="/home">Award Winning Tech Company</a>
              </li>
            </ul>
          </div>
          {/* i need to check if there are any blog articles to display from sanity (display about 5-6 latest/top) */}
          {/* <div>
            <p className="font-semibold">Key Blog Articles</p>
            <ul>
              
            </ul>
          </div> */}
        </div>
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center flex-1">
          <button className="bg-[#f1f1f1] text-center rounded-xl py-2 px-3 hover:scale-97 active:scale-102 cursor-pointer transition-all duration-300 ease-in-out">
            Click, let's talk!
            <Image 
              src={whatsAppIcon}
              alt="WhatsApp Icon"
              className="ml-2 mb-1 h-4 w-4 inline-block"
            />
            &nbsp;&nbsp;&#x276F;
          </button>
          <a href="mailto:info@skytechghana.com" className="text-black hover:underline">
            info@skytechghana.com
          </a>
        </div>
      </div>
      <div className="bg-black text-white p-4 flex items-center justify-center">
        <p className="text-center">
          Copyright © 2026 Skytech Ghana Inc • All rights reserved •&nbsp;
          <a href="/terms-of-use" className="hover:underline">
            Terms of use
          </a>&nbsp;•&nbsp;
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
