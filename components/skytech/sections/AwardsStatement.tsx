import Image from "next/image";

function AwardMedallion() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-brand-200 to-brand-500 opacity-40 blur-2xl" />
      <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-brand-100 bg-white shadow-lift sm:h-72 sm:w-72">
        <div className="relative h-44 w-44 sm:h-52 sm:w-52">
          <Image
            src="/images/images/homePageAward.png"
            alt="Award"
            width={256}
            height={256}
            className="aspect-square object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function AwardsStatement({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-10 px-6 py-16 md:flex-row md:justify-between md:gap-0 ${className || ""}`}
    >
      <div className="md:hidden">
        <AwardMedallion />
      </div>
      <div className="max-w-xl text-center md:text-left">
        <span className="section-tag justify-center md:justify-start">2+ Top Awards</span>
        <p className="section-title mt-3 text-3xl uppercase sm:text-4xl text-balance">
          Recognition for digital excellence
        </p>
        <p className="section-lead mt-5">
          Our commitment to delivering exceptional digital business
          development and other IT Services has made us an
          award-winning agency trusted by businesses worldwide.
        </p>
      </div>
      <div className="hidden md:block">
        <AwardMedallion />
      </div>
    </div>
  );
}

export default AwardsStatement;