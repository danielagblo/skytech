"use client";

import { useWhatsAppModal } from "@/components/WhatsAppModal";

interface TopScrollingBannerProps {
  className?: string;
  contactPhone?: string;
  whatsapp?: string;
}

function TopScrollingBanner({
  className,
  contactPhone = "+233538311626",
  whatsapp = "233538311626",
}: TopScrollingBannerProps) {
  const { open } = useWhatsAppModal();
  const digits = whatsapp.replace(/\s+/g, "").replace("+", "");

  return (
    <div className={className ? className : "relative flex bg-black text-white h-[45px] items-center overflow-hidden whitespace-nowrap border-b border-white/5 w-full z-10"}>
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />

      <div className="animate-marquee inline-block text-white font-display text-xs md:text-sm tracking-wide px-4">
        We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency.
      </div>

      <div className="absolute right-0 top-0 h-full flex items-center pr-4 pl-16 bg-gradient-to-l from-black via-black/95 to-transparent z-20 gap-3">
        <a
          href={`tel:${contactPhone}`}
          className="text-white hover:text-brand-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M21.38 15.22c-1.24-1.24-2.88-1.24-4.12 0l-1.37 1.37c-.11-.06-.22-.12-.32-.19-.94-.61-1.84-1.4-2.61-2.17-.77-.77-1.56-1.67-2.17-2.61-.07-.1-.13-.21-.19-.32l1.37-1.37c1.24-1.24 1.24-2.88 0-4.12L9.22 3.06C7.98 1.82 6.34 1.82 5.1 3.06L3.64 4.52c-1.12 1.12-1.46 2.76-.84 4.2 1.48 3.47 4.14 6.7 7.51 10.07s6.6 6.03 10.07 7.51c1.44.62 3.08.28 4.2-.84l1.46-1.46c1.24-1.24 1.24-2.88 0-4.12l-4.66-4.66z" />
          </svg>
          <span className="inline">{contactPhone}</span>
        </a>

        <span className="text-white/20 h-4 w-[1px] inline" />

        <button
          onClick={() => open(digits)}
          className="bg-black hover:bg-white/10 text-white px-3 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
            <path d="M12.031 2c-5.514 0-9.989 4.478-9.989 9.99 0 1.763.459 3.42 1.261 4.876l-1.303 4.76 4.876-1.277a9.923 9.923 0 0 0 4.887 1.277c5.515 0 10.026-4.484 10.026-9.99A10.007 10.007 0 0 0 12.03 2zm4.7 13.385c-.21.589-1.218 1.127-1.68 1.176-.462.05-1.034.075-2.735-.623-2.176-.893-3.576-3.111-3.685-3.259-.11-.148-.894-1.189-.894-2.27 0-1.082.563-1.613.765-1.838.201-.225.441-.282.589-.282.148 0 .294.002.422.008.132.006.31.025.474.413.164.388.563 1.378.613 1.479.05.101.083.219.016.353-.067.135-.1.219-.201.336-.1.118-.21.265-.3.353-.1.101-.205.21-.088.409.117.197.521.859 1.119 1.39.771.688 1.419.902 1.621.99.201.088.319.074.437-.062.118-.137.513-.598.648-.8.135-.203.27-.169.455-.1.186.068 1.176.554 1.378.656.202.101.337.151.387.235.05.488-.16.1.077z" />
          </svg>
          <span>WhatsApp Us</span>
        </button>
      </div>
    </div>
  );
}

export default TopScrollingBanner;
