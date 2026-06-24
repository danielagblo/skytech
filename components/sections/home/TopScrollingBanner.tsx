function TopScrollingBanner({className}: {className?: string}) {
  return (
    <div className={className ? className : "bg-black text-white p-3 flex items-center justify-center"}>
      We will help you to rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparancy!
    </div>
  )
}

export default TopScrollingBanner

// this scrolls across the screen on smaller screens. will implement later.
