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
        <div className="grid grid-cols-2 gap-4 max-w-[3000px] items-center justify-center mt-8">
          <div>
            <p className="text-4xl uppercase">SIMPLE RATE CARD <br/>WITH ZERO SURPRISES</p>
            <ul className="leading-8 mt-4 pl-3">
              <li>
                &#10004; We do regular maintenance on your site at NO FEES
              </li>
              <li>
                &#10004; We program,we don’t use template or wordpress.
              </li>
            </ul>
          </div>
          <div className="flex h-[35vh] items-center justify-center">
            <Image 
              src={starsAndLinesSVG}
              alt="Award"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 px-12 py-8">
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
        <div className="flex flex-row gap-4 justify-end font-medium uppercase text-lg">
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
