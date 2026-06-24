import Image from 'next/image'
import { useRouter } from 'next/navigation'
import homeBannerImage from '@/assets/images/homePageBannerImage.png'
import homeAward from '@/assets/images/homePageAward.png'
import homeAward2 from '@/assets/images/homePageAward2.png'
import StatsBanner from './StatsBanner'

function LandingScreen() {

  const router = useRouter();

  return (
    <div>
      <Image 
        src={homeBannerImage}
        alt="Landing Image"
        className='absolute top-12 left-0 -z-10 h-[80vh] w-screen'
      />
      <div className='uppercase h-[65vh] flex justify-center items-end px-10 mb-6 text-white'>
        <div
          className='w-[75vw]'
        >
          <div>
            <h1 className='text-8xl font-bold'>
              8 + years <br />
              in operation
            </h1>
          </div>
          <div>
            <div className='space-x-4 mt-8 mb-2'>
              <button 
                className="uppercase bg-[#1E5AC8] py-2 px-3 rounded-xs hover:scale-97 active:scale-102"
                onClick={()  => {
                  router.push("/contact")
                }}
              >
                Book a Meeting
              </button>
              <button 
                className="uppercase bg-white text-black py-2 px-3 rounded-xs hover:scale-97 active:scale-102"
                onClick={() => {
                  router.push("/pricing")
                }}
            >
                Pricing
                </button>
            </div>
            <p>FOR WEBSITE MOBILE APP DEVELOPMENT AND IT INSTALLATIONS</p>
          </div>
        </div>
        <div
          className='w-[25vw] flex flex-col justify-end items-end gap-5'
        >
          <div className='flex flex-row justify-center items-end'>
            <Image 
              src={homeAward2}
              alt="Award 2"
              className='-mb-4 h-18 -mr-15 object-contain'
            />
            <Image
              src={homeAward}
              alt="Award"
              className='-mb-4 h-40 object-contain'
            />
          </div>
          <p className='pr-13.5'>2+ top awards</p>
        </div>
      </div>
      <StatsBanner />
    </div>
  )
}

export default LandingScreen
