"use client";

interface TopScrollingBannerProps {
  className?: string;
}

function TopScrollingBanner({ className }: TopScrollingBannerProps) {
  return (
    <div
      className={
        className
          ? className
          : "relative flex bg-black text-white h-[45px] items-center overflow-hidden whitespace-nowrap border-b border-white/5 w-full z-10"
      }
    >
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />

      <div className="animate-marquee inline-block text-white font-display text-xs md:text-sm tracking-wide px-4">
        We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency.
      </div>
    </div>
  );
}

export default TopScrollingBanner;
