'use client';

import Image from 'next/image';

const industries = [
  {
    title: "Fintech & Payments",
    desc: "Seamless, secure, and robust transaction systems tailored for modern digital ecosystems.",
    image: "/images/images/fintechAndPaymentsImage.png",
  },
  {
    title: "Health Tech",
    desc: "Intelligent medical records, consultation tools, and data systems built with modern security protocols.",
    image: "/images/images/healthtechImage.png",
  },
  {
    title: "Logistics & Fleet",
    desc: "Real-time tracking, dispatching systems, and robust routing infrastructure that scales.",
    image: "/images/images/logisticsAndFleetImage.png",
  },
  {
    title: "Property Tech",
    desc: "Real estate listings, agent portals, and booking systems built to optimize operations.",
    image: "/images/images/propertytechImage.png",
  },
  {
    title: "Education Tech",
    desc: "Interactive classrooms, student portals, and administrative tools that optimize learning.",
    image: "/images/images/educationtechImage.png",
  },
  {
    title: "Online E-commerce",
    desc: "High-performance online storefronts, optimized shopping paths, and checkout flows.",
    image: "/images/images/onlineEcommerceImage.png",
  }
];

export default function IndustriesWeServe() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="section-shell space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="pill text-blue-600 bg-blue-50">INDUSTRIES WE SERVE</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Digital Solutions for Key Sectors
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            We deliver tailored solutions across diverse domains to accelerate growth and operational efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={ind.image}
                  alt={ind.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>
              <div className="p-8 space-y-3">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {ind.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {ind.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
