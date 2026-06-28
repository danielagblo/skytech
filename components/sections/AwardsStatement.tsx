import Image from 'next/image'

import awardImage from "@/assets/images/homePageAward.png"

function AwardsStatement( {className}: {className?: string}) {
  return (
      <div className={`flex flex-row items-center justify-between w-screen h-[55vh] bg-white ${className || ''}`}>
        <div className="w-[66vw] pl-6 pr-30">
          <p className="subtitle">2+ TOP AWARDS</p>
          <p className="text-4xl uppercase">Recognition for digital excellence</p>
          <p className="mt-7 pr-10">
            Our commitment to delivering exceptional digital business
            development and other IT Services has made us an 
            award-winning agency trusted by businesses worldwide.
          </p>
        </div>
        <div className="w-[34vw] h-full flex flex-1 items-center justify-center pr-20">
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
