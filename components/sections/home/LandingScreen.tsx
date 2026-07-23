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
        className='absolute top-12 left-0 -z-10 h-[60vh] w-screen object-cover md:h-[80vh] md:object-fill'
      />
      <div className='uppercase flex flex-col items-center justify-center gap-10 px-6 pt-28 pb-10 text-center text-white md:h-[65vh] md:flex-row md:items-end md:justify-center md:gap-0 md:px-10 md:pt-0 md:pb-0 md:mb-6 md:text-left'>
        <div
          className='w-full md:w-[75vw]'
        >
          <div>
            <h1 className='text-4xl font-bold sm:text-5xl md:text-8xl'>
              8 + years <br />
              in operation
            </h1>
          </div>
          <div>
            <div className='flex flex-wrap justify-center gap-3 mt-8 mb-2 md:justify-start md:space-x-4 md:gap-0'>
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
            <p className='text-sm md:text-base'>FOR WEBSITE MOBILE APP DEVELOPMENT AND IT INSTALLATIONS</p>
          </div>
        </div>
        <div
          className='flex flex-col items-center gap-5 md:w-[25vw] md:items-end md:justify-end'
        >
          <div className='flex flex-row justify-center items-end'>
            <Image
              src={homeAward2}
              alt="Award 2"
              className='h-14 -mr-8 object-contain md:-mb-4 md:h-18 md:-mr-15'
            />
            <Image
              src={homeAward}
              alt="Award"
              className='h-28 object-contain md:-mb-4 md:h-40'
            />
          </div>
          <p className='md:pr-13.5'>2+ top awards</p>
        </div>
      </div>
      <StatsBanner />
    </div>
  )
}

export default LandingScreen
