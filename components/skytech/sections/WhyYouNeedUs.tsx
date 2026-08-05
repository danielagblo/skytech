import Image from "next/image";

function WhyYouNeedUs() {
  return (
    <div className="mt-0 md:-mt-12">
      <div className="flex flex-col items-center justify-start text-center px-6 md:flex-row md:text-left md:px-0">
        <Image
          src="/images/images/manSitting.png"
          alt="Why You Need Us"
          width={600}
          height={600}
          className="max-md:-ml-[3.25rem] object-contain md:h-full md:w-[37.5rem] md:max-h-[37.5rem] md:object-fill"
        />
        <h1 className="font-medium uppercase text-5xl leading-tight max-md:-my-7 md:text-6xl md:-ml-[10rem] md:pt-[6.75rem] md:leading-[2.75rem]">
          Here is Why <br />
          <span className="text-4xl font-outline font-semibold tracking-widest"> you need us</span>
        </h1>
      </div>
      <div className="bg-[#f7f7f7] pt-8 pb-10 mt-6 w-full flex flex-col items-stretch justify-center gap-2 md:pt-[6.5rem] md:-mt-[10rem] md:flex-row">
        <div className="w-full flex flex-col gap-4 items-center justify-center px-6 md:pl-10 md:pr-4">
          <div className="w-full flex flex-col gap-4 items-center justify-center md:flex-row">
            <div className="bg-[#00FFF2] w-full rounded-2xl p-3">
              <p className="font-semibold text-xl mb-2 capitalize">8yrs Of Proven Expertise</p>
              <p className="text-lg">
                Nearly a decade of hands-on
                experience delivering reliable,
                high-performing software and
                web solutions across borders.
              </p>
            </div>
            <div className="bg-[#6878B1] w-full rounded-2xl p-3 text-white">
              <p className="font-semibold text-xl mb-2 capitalize">Our relationship with you</p>
              <p className="text-lg">
                We plug in like your internal
                IT department with absolute
                transparency. We don&apos;t disappear
                suddenly,we stay.
              </p>
            </div>
          </div>
          <div className="bg-[#FF6B6B] w-full rounded-2xl p-3 text-white">
            <p className="font-semibold text-xl mb-2 capitalize">Complimentary Maintenance</p>
            <p className="text-lg">
              Enjoy peace of mind with free ongoing maintenance to ensure your platforms stay secure, updated, and
              running smoothly.
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 px-6 md:h-full md:pl-0 md:pr-10">
          <div className="bg-[#F7CF94] w-full rounded-2xl p-3 h-auto md:h-[13.75rem]">
            <p className="font-semibold text-xl mb-2 capitalize">Teamwork</p>
            <p className="text-2xl">
              We integrate seamlessly with
              your Team, working side by
              side to support your business
              goals.
            </p>
          </div>
          <div className="w-full text-2xl rounded-2xl p-3">
            Risk Reduction, 100% Transparancy
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyYouNeedUs;
