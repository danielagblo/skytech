function TopScrollingBanner({ className }: { className?: string }) {
  return (
    <div className={className ? className : "hidden md:flex bg-black text-white p-3 items-center justify-center"}>
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        We will help you to rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparancy!
      </p>
    </div>
  );
}

export default TopScrollingBanner;
