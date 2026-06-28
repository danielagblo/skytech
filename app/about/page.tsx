import Image from "next/image"

import ProblemCards from "@/components/sections/about/ProblemCards"
import WhyYouNeedUs from "@/components/sections/WhyYouNeedUs"
import AwardsStatement from "@/components/sections/AwardsStatement"

import aboutBanner from "@/assets/images/AboutBanner.png"
import DrivenByInnovationImage from "@/assets/images/DrivenByInnovationImage.png"
import HowSkytechCameToImage from "@/assets/images/HowSkytechCameToImage.png"
import MissionVisionImage from "@/assets/images/MissionVisionChessImage.png"

function AboutPage() {
  return (
    <div className="text-xl">
      <Image
        src={aboutBanner}
        alt="About Us"
        className="w-screen h-40 object-cover"
      />
      <div className="grid grid-cols-[2fr_1fr] pl-12 pr-15 gap-5 items-center justify-center">
        <div>
          <h1 className="text-5xl uppercase mb-3">
            Driven by innovation powered by people
          </h1>
          <p>
            With nearly a decade of hands on experience in Digital Business 
            Development  Solutions and Enterprise Security IT Services, 
            we empower businesses to adapt to changing technologies, 
            scale operations seamlessly, and thrive in an increasingly 
            competitive world.
          </p>
        </div>
        <div className="p-10">
          <Image 
            src={DrivenByInnovationImage}
            alt="Driven by Innovation"
            className="h-auto w-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr] bg-[#f1f1f1] pl-7 pr-15 gap-5 items-center justify-center">
        <div className="p-10 ">
          <Image 
            src={HowSkytechCameToImage}
            alt="How Skytech Came to Be"
            className="h-auto w-100"
          />
        </div>
        <div className="pl-10">
          <h2 className="text-gray-500 uppercase mb-3">
            How Skytech Came to Be?
          </h2>
          <h1 className="text-3xl uppercase mb-3">
            It all started with frustration
          </h1>
          <p>
            Like many of the world&apos;s most impactful technological ventures, its foundation was not built on a simple corporate plan, but rather on an urgent, exasperated realization that the existing ecosystem was failing the people it was meant to serve.
            <br /><br />
            Here is the narrative of why Skytech  started, detailing the core frustrations that sparked its creation and the mission driving its evolution.
          </p>
        </div>
      </div>

      <div className="p-10">
        <h1 className="text-3xl uppercase">
          The spark: a trifecta of frustration
        </h1>
        <p>
          The inception of Skytech Ghana was fueled by three 
          <br />
          glaring gaps in the regional technological landscape:
        </p>
      </div>

      <ProblemCards />

      <div className="bg-[#f1f1f1] p-10 mt-12">
        <h2 className="text-3xl mb-4 uppercase">Turning friction into fuel</h2>
        <p>
          Instead of merely complaining about fragmented local systems, the team channeled that friction into a clear corporate mission: &quot;Making Your Tech Dreams a Reality.&quot;
          <br/><br/>
          Skytech Ghana moved away from simply selling &quot;one-size-fits-all&quot; software packages. They pivoted to become a comprehensive digital transformation and spatial partner. They recognized that true digital evolution requires walking alongside a client—handling everything from raw data analysis and spatial information management to building the actual applications that streamline everyday business operations.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_2fr] pl-7 pr-17 gap-5 items-center justify-center">
        <div className="p-10 ">
          <Image 
            src={MissionVisionImage}
            alt="Mission and Vision"
            className="h-auto w-100"
          />
        </div>
        <div className="pl-10">
          <h1 className="text-3xl uppercase mb-2">
            Mission
          </h1>
          <p>
            We break the cycle of high costs and vanishing developers by serving as a continuous, reliable technical partner. Every solution we deploy is built for affordability, backed by predictable maintenance costs, and supported by a team that stays by your side long after launch day. 
          </p>

          <h1 className="text-3xl uppercase mt-6 mb-2">
            Vision
          </h1>
          <p>
            To be Africa’s most reliable and accessible technology partner, bridging the digital divide for small and medium enterprises by transforming complex tech into simple, continuous, and affordable operational growth.
          </p>
        </div>
      </div>

      <AwardsStatement className="-mb-30 p-6" />
      <WhyYouNeedUs />

      <div className="w-auto h-25"/>
    </div>
  )
}

export default AboutPage
