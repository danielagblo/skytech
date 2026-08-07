import Image from "next/image";

const industryCards = [
  {
    title: "Fintech & Payments",
    description: "Secure transaction processing and financial data architectures.",
    image: "/images/images/fintechAndPaymentsImage.png",
  },
  {
    title: "Health Tech",
    description: "Privacy - complaint medical platforms and diagnostic tools.",
    image: "/images/images/healthtechImage.png",
  },
  {
    title: "Logistics & Fleet",
    description: "Realtime tracking systems and supply chain automation",
    image: "/images/images/logisticsAndFleetImage.png",
  },
  {
    title: "Property Tech",
    description: "Real estate management and listings platform.",
    image: "/images/images/propertytechImage.png",
  },
  {
    title: "Education Tech",
    description: "LMS Platforms and interactive learning ecosystems.",
    image: "/images/images/educationtechImage.png",
  },
  {
    title: "Online E-Commerce",
    description: "High-end marketplaces and headless commerce solutions.",
    image: "/images/images/onlineEcommerceImage.png",
  },
];

function IndustryCards() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-tag justify-center">Industries</span>
          <h2 className="section-title mt-4 text-3xl text-balance sm:text-4xl">
            Built for the sectors that matter
          </h2>
          <p className="section-lead mt-3 max-w-xl">
            Tailored digital solutions for industries that demand technical rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industryCards.map((card, index) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold uppercase text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IndustryCards;