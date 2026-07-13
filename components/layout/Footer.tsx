import Image from "next/image"
import sponsorImage from "@/assets/images/placeholderSponsor.png"
import LetsTalkButton from "../ui/LetsTalkButton"
import sponsorsBigPicture from "@/assets/images/sponsors/sponsorsBigPicture.png"  

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
      <div className="max-md:flex max-md:flex-col-reverse max-md:mt-6 max-md:items-center grid grid-cols-3 px-4 space-x-4 bg-[#f9f9f9]">
        {/* Will later make an array of sponsor images and loop over that */}
        <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 max-md:hidden">
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
        <div className="md:hidden mt-4">
          <Image
            src={sponsorsBigPicture}
            alt="Sponsors"
            className="w-full h-auto"
          />
        </div>
        <div className="space-y-6 pt-10 max-md:text-center">
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
          <LetsTalkButton className="bg-[#f1f1f1]" />
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
