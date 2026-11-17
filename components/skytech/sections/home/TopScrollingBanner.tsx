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
          : "relative z-10 flex h-[45px] w-full items-center overflow-hidden whitespace-nowrap border-b border-white/10 bg-[#0C0D10] text-white"
      }
    >
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-gradient-to-r from-[#0C0D10] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-gradient-to-l from-[#0C0D10] to-transparent" />

      <div className="animate-marquee inline-block px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 md:text-xs">
        We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency.
      </div>
    </div>
  );
}

export default TopScrollingBanner;
