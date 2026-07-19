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
    <div className="p-6 -my-8 grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:p-10">
      {industryCards.map((card, index) => (
        <div key={index} className="flex flex-col justify-start max-w-[25rem] max-h-[25rem]">
          <Image
            src={card.image}
            alt={card.title}
            width={400}
            height={300}
            className="mb-4"
          />
          <h3 className="text-2xl pl-4">{card.title}</h3>
          <p className="text-gray-600 pl-4 text-lg">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

export default IndustryCards;
