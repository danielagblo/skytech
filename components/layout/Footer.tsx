"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import sponsorImage from "@/assets/images/placeholderSponsor.png"
import LetsTalkButton from "../ui/LetsTalkButton"
import sponsorsBigPicture from "@/assets/images/sponsors/sponsorsBigPicture.png"
import { getLatestBlogPosts, type BlogPost } from "@/lib/blog"

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
  const currentPath = usePathname()
  const isLandingPage = currentPath === "/landing"

  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    getLatestBlogPosts(4).then(setLatestPosts)
  }, [])

  if (isLandingPage) return null

  return (
    <div className={className ?? ""}>
      <div className="max-md:flex max-md:flex-col-reverse max-md:mt-6 max-md:items-center max-md:gap-6 grid grid-cols-3 px-4 gap-4 bg-[#f9f9f9]">
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
          {latestPosts.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Key Blog Articles</p>
              <ul className="space-y-2">
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center flex-1">
          <LetsTalkButton className="bg-[#f1f1f1]" />
          <a href="mailto:info@skytechghana.com" className="text-black hover:underline">
            info@skytechghana.com
          </a>
        </div>
      </div>
      <div className="bg-black text-white p-4 flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-1">
        <p>Copyright © 2026 Skytech Ghana Inc • All rights reserved</p>
        <p className="flex items-center gap-2">
          <a href="/terms-of-use" className="hover:underline">
            Terms of use
          </a>
          <span aria-hidden>•</span>
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
