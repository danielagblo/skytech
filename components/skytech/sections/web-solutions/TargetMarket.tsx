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
    alt: "NGO workers collaborating",
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

function AudienceCard({ number, title, description, image, alt, wide }: AudienceItem) {
  return (
    <div className="relative flex h-full flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 pt-10 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift md:p-8 md:pt-10">
      <div className="absolute -top-3 -left-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-semibold text-white shadow-soft">
        {number}
      </div>

      <div className={`flex h-full flex-col gap-4 md:flex-row ${wide ? "items-start" : "items-center"}`}>
        <div className="h-full min-w-0 flex-1 flex-col gap-3">
          <h3 className="font-display text-2xl font-semibold leading-snug text-slate-900">{title}</h3>
          <div className="mt-3 flex flex-col gap-3">
            {description.split("\n\n").map((para, i) => (
              <p key={i} className="leading-relaxed text-slate-600">
                {para}
              </p>
            ))}
          </div>
        </div>

        {image && (
          <div
            className={`shrink-0 overflow-hidden rounded-2xl ${
              wide ? "md:h-56 md:w-64 md:scale-[0.8]" : "md:h-28 md:w-28"
            } h-40 w-full`}
          >
            <Image src={image} alt={alt} width={256} height={224} className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TargetMarketAudience() {
  const [first, ...rest] = audiences;
  const pairs = rest.reduce<AudienceItem[][]>((acc, item, i) => {
    if (i % 2 === 0) acc.push([item]);
    else acc[acc.length - 1].push(item);
    return acc;
  }, []);

  return (
    <section className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-tag justify-center">Who we serve</span>
          <h2 className="section-title mt-4 text-3xl text-balance sm:text-4xl">
            Target Market Audience
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <AudienceCard {...first} />

          {pairs.map((pair, i) => (
            <div key={i} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pair.map((item) => (
                <AudienceCard
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  alt={item.alt}
                  wide={item.wide}
                  key={item.number}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}