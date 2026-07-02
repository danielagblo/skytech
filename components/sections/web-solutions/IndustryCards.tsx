import Image from "next/image"

import fintechAndPaymentsImage from "@/assets/images/fintechAndPaymentsImage.png"
import healthTechImage from "@/assets/images/healthtechImage.png"
import logisticsAndFleetImage from "@/assets/images/logisticsAndFleetImage.png"
import propertyTechImage from "@/assets/images/propertytechImage.png"
import educationTechImage from "@/assets/images/educationtechImage.png"
import onlineEcommerceImage from "@/assets/images/onlineEcommerceImage.png"

const industryCards = [
  {
    title: "Fintech & Payments",
    description: "Secure transaction processing and financial data architectures.",
    image: fintechAndPaymentsImage
  },
  {
    title: "Health Tech",
    description: "Privacy - complaint medical platforms and diagnostic tools.",
    image: healthTechImage
  }, 
  {
    title: "Logistics & Fleet",
    description: "Realtime tracking systems and supply chain automation",
    image: logisticsAndFleetImage
  },
  {
    title: "Property Tech",
    description: "Real estate management and listings platform.",
    image: propertyTechImage
  },
  {
    title: "Education Tech",
    description: "LMS Platforms and interactive learning ecosystems.",
    image: educationTechImage
  },
  {
    title: "Online E-Commerce",
    description: "High-end marketplaces and headless commerce solutions.",
    image: onlineEcommerceImage
  }
]

function IndustryCards() {
  return (
    <div className="p-10 -my-8 grid grid-cols-3 gap-4 gap-y-10">
      {
        industryCards.map((card, index) => (
          <div key={index} className="flex flex-col justify-start  max-w-100 max-h-100">
            <Image src={card.image} alt={card.title}className="mb-4" />
            <h3 className="text-2xl pl-4">{card.title}</h3>
            <p className="text-gray-600 pl-4 text-lg">{card.description}</p>
          </div>
        ))
      }
    </div>
  )
}

export default IndustryCards
