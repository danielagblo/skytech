function TopScrollingBanner({ className }: { className?: string }) {
  return (
    <div className={className ? className : "flex bg-black text-white h-[45px] flex items-center overflow-hidden whitespace-nowrap border-b border-white/5"}>
      <div className="animate-marquee inline-block text-white font-display text-xs md:text-sm tracking-wide px-4">
        We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency.
      </div>
    </div>
  );
}

export default TopScrollingBanner;
