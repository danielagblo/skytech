import { useState } from "react";

import Image from "next/image"

import starsAndLinesSVG from "../../assets/icons/stars-line-svgrepo-com.svg";
import PricingCards from "./PricingCards";
import WhyYouNeedUs from "./WhyYouNeedUs";

function PricingModel( { showWhyYouNeedUs = true }: { showWhyYouNeedUs?: boolean } ) {

  const [currency, setCurrency] = useState<"GHC" | "USD">("GHC");
  const [serviceType, setServiceType] = useState<"Website" | "Mobile App">("Website");

  return (
    <div className="bg-white">
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 max-w-[3000px] items-center justify-center mt-8 md:grid-cols-2">
          <div className="max-md:relative">
            <p className="text-2xl uppercase md:text-4xl">SIMPLE RATE CARD <br/>WITH ZERO SURPRISES</p>
            <div className="md:hidden max-md:absolute right-0 -top-2 flex h-[8vh] items-center justify-center">
              <Image
                src={starsAndLinesSVG}
                alt="Award"
                className="h-full w-full object-contain"
              />
            </div>
            <ul className="leading-8 mt-4 pl-3">
              <li>
                &#10004; We do regular maintenance on your site at NO FEES
              </li>
              <li>
                &#10004; We program,we don’t use template or wordpress.
              </li>
            </ul>
          </div>
          <div className="max-md:hidden flex h-[25vh] items-center justify-center md:h-[35vh]">
            <Image
              src={starsAndLinesSVG}
              alt="Award"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-6 py-8 md:grid-cols-2 md:gap-0 md:px-12">
        <div>
          <p className="hover:underline underline-offset-3 text-gray-500 font-bold decoration-2 decoration-[#1E5AC8] cursor-pointer" onClick={() =>
              serviceType === "Website"
                ? setServiceType("Mobile App")
                : setServiceType("Website")
              }
            >
            <span className={serviceType === "Mobile App" ? "hidden" : "text-[#1E5AC8] font-bold"}>Website Rates</span>
            <span className={serviceType === "Mobile App" ? "hidden" : "font-bold"}>     &#10132;     </span>

            <span className={serviceType === "Mobile App" ? "text-[#1E5AC8] font-bold" : ""}>Mobile App Rates</span>
            <span className={serviceType === "Website" ? "hidden" : "font-bold"}>     &#10132;     </span>

            <span className={serviceType === "Website" ? "hidden" : ""}>Website Rates</span>
          </p>
        </div>
        <div className="flex flex-row gap-4 justify-start font-medium uppercase text-lg md:justify-end">
          <p 
            className={"inline hover:underline underline-offset-4 text-gray-500 font-bold decoration-2 decoration-[#1E5AC8] cursor-pointer"
              + (currency === "GHC" ? " text-[#1E5AC8] underline" : "")
            }
            onClick={() => setCurrency("GHC")}
          >
            GHC
          </p>
          <p 
            className={"inline hover:underline underline-offset-4 text-gray-500 font-bold decoration-2 decoration-[#1E5AC8] cursor-pointer"
              + (currency === "USD" ? " text-[#1E5AC8] underline" : "")
            }
            onClick={() => setCurrency("USD")}
          >
            USD
          </p>
        </div>
      </div>

      <PricingCards currency={currency} />
      {showWhyYouNeedUs && <WhyYouNeedUs />}
    </div>
  )
}

export default PricingModel
