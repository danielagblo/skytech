import Image from "next/image";

const industryCards = [
  {
    title: "Fintech & Payments",
    description: "Secure transaction processing and financial data architectures.",
    image: "/images/images/fintechAndPaymentsImage.png",
  },
  {
    title: "Health Tech",
    description: "Privacy-compliant medical platforms and diagnostic tools.",
    image: "/images/images/healthtechImage.png",
  },
  {
    title: "Logistics & Fleet",
    description: "Realtime tracking systems and supply chain automation.",
    image: "/images/images/logisticsAndFleetImage.png",
  },
  {
    title: "Property Tech",
    description: "Real estate management and listings platforms.",
    image: "/images/images/propertytechImage.png",
  },
  {
    title: "Education Tech",
    description: "Learning platforms and interactive classrooms.",
    image: "/images/images/educationtechImage.png",
  },
  {
    title: "Online E-Commerce",
    description: "Marketplaces and commerce built for real volume.",
    image: "/images/images/onlineEcommerceImage.png",
  },
];

function IndustryCards() {
  return (
    <section className="bg-[#F6F4F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Industries</span>
          <h2 className="section-title mt-5">Built for the sectors that matter</h2>
          <p className="section-lead mt-4">
            Tailored digital solutions for industries that demand technical rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[#E3DDD4] sm:grid-cols-2 lg:grid-cols-3">
          {industryCards.map((card) => (
            <article key={card.title} className="flex flex-col bg-white">
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#E3DDD4]">
                <Image src={card.image} alt="" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-medium text-[#141413]">{card.title}</h3>
                <p className="mt-2 leading-relaxed text-[#5C574F]">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IndustryCards;
