import Image from "next/image";

interface AudienceItem {
  number: number;
  title: string;
  description: string;
  image: string | null;
  alt: string;
  wide: boolean;
}

const audiences: AudienceItem[] = [
  {
    number: 1,
    title: "Micro, Small and Medium Enterprise (MSME)",
    description:
      "We focus on SMEs because they have the biggest potential to scale, yet they are the most under served by world-class digital solutions leaving them vulnerable to operational leakages that we can instantly fix with world class affordable, custom automation.\n\nIn Ghana particularly - MSMEs are widely recognized as the primary engine of economic growth, employment, and social stability therefor its our mission to join hands with Government to empower the operations of this MSMEs.",
    image: "/images/images/eggSellerImage.png",
    alt: "Ghanaian market woman selling eggs",
    wide: true,
  },
  {
    number: 2,
    title: "Government (MDAs)",
    description:
      "We build secure e-governance portals, local revenue mobilization systems, and paperless workflow tracking tools designed to drive national digitization while remaining fully NITA and DPC compliant.",
    image: "/images/images/ghanaGovImage.png",
    alt: "Ghana Government coat of arms",
    wide: false,
  },
  {
    number: 3,
    title: "Corporate & Enterprise",
    description:
      "We optimize complex, multi-tiered business operations by architecting custom enterprise dashboards, legacy API integrations, and secure, high-volume payment and SMS processing layers.",
    image: "/images/images/corporateTableImage.png",
    alt: "Corporate meeting",
    wide: false,
  },
  {
    number: 4,
    title: "Startups & Tech Businesses",
    description:
      "We accelerate speed-to-market by engineering highly scalable Minimum Viable Products (MVPs), flexible API architectures, and specialized microservices built to handle rapid user growth.",
    image: "/images/images/NGOsHandsImage.png",
    alt: "Team collaborating",
    wide: false,
  },
  {
    number: 5,
    title: "NGO's, International Body",
    description:
      "We deliver real-time Monitoring & Evaluation (M&E) dashboards, offline-first field data collection applications, and clear donor-ready data visualizations to track and showcase grassroots socio-economic impact.",
    image: "/images/images/NGOsHandsImage.png",
    alt: "Hands joined together",
    wide: false,
  },
];

function AudienceCard({ number, title, description, image, alt }: AudienceItem) {
  return (
    <article className="flex h-full flex-col bg-white p-6 md:p-8">
      <p className="font-display text-sm tracking-[0.18em] text-[#1E5AC8]">{String(number).padStart(2, "0")}</p>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl font-medium leading-snug text-[#141413]">{title}</h3>
          <div className="mt-3 flex flex-col gap-3">
            {description.split("\n\n").map((para, i) => (
              <p key={i} className="leading-relaxed text-[#5C574F]">{para}</p>
            ))}
          </div>
        </div>
        {image && (
          <div className="relative h-40 w-full shrink-0 overflow-hidden border border-[#E3DDD4] md:h-36 md:w-44">
            <Image src={image} alt={alt} fill className="object-cover" />
          </div>
        )}
      </div>
    </article>
  );
}

export default function TargetMarketAudience() {
  return (
    <section className="border-t border-[#E3DDD4] bg-[#F6F4F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Who we serve</span>
          <h2 className="section-title mt-5">Target market</h2>
        </div>
        <div className="grid gap-px bg-[#E3DDD4]">
          {audiences.map((item) => (
            <AudienceCard key={item.number} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
