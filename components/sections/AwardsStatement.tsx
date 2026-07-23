import Image from 'next/image'

import awardImage from "@/assets/images/homePageAward.png"

function AwardsStatement( {className}: {className?: string}) {
  return (
      <div className={`flex flex-col items-center justify-center gap-8 w-screen h-auto py-10 px-6 bg-white md:flex-row md:items-center md:justify-between md:gap-0 md:h-[55vh] md:py-0 md:px-0 ${className || ''}`}>
        <div className="text-center md:w-[66vw] md:pl-6 md:pr-30 md:text-left">
          <p className="subtitle">2+ TOP AWARDS</p>
          <p className="text-2xl uppercase md:text-4xl">Recognition for digital excellence</p>
          <p className="mt-7 md:pr-10">
            Our commitment to delivering exceptional digital business
            development and other IT Services has made us an
            award-winning agency trusted by businesses worldwide.
          </p>
        </div>
        <div className="w-40 h-40 flex items-center justify-center md:w-[34vw] md:h-full md:flex-1 md:pr-20">
          <div className="bg-[#f7f7f7] rounded-full aspect-square p-8 flex items-center justify-center">
            <div className="bg-white rounded-full aspect-square p-2">
              <div className="border-2 border-[#d9d9d9]  rounded-full aspect-square">
                <Image
                  src={awardImage}
                  alt="Award"
                  className="aspect-square object-contain -mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AwardsStatement
