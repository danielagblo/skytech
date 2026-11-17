import Image from "next/image";

function AwardFrame() {
  return (
    <div className="border border-[#E3DDD4] bg-white">
      <div className="relative mx-auto my-8 h-52 w-40 sm:h-60 sm:w-48">
        <Image
          src="/images/images/homePageAward.png"
          alt="Award"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

function AwardsStatement({ className }: { className?: string }) {
  return (
    <div className={`border-t border-[#E3DDD4] bg-[#F6F4F0] py-20 ${className || ""}`}>
      <div className="section-shell grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-xl">
          <span className="eyebrow">Awards</span>
          <p className="section-title mt-5 text-balance">Recognition for digital excellence</p>
          <p className="section-lead mt-5">
            Our commitment to delivering exceptional digital business development and other IT services
            has made us an award-winning agency trusted by businesses worldwide.
          </p>
        </div>
        <AwardFrame />
      </div>
    </div>
  );
}

export default AwardsStatement;
