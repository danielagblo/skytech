import Image from "next/image";

const steps = [
  {
    title: "Discovery & Planning",
    description: "This ensures we are perfectly aligned on your vision, budget, and deadlines before building starts.",
    image: "/images/images/process-planning.png",
    alt: "Team planning",
  },
  {
    title: "Execution & Development",
    description: "Our design and engineering teams bring the concept to life, building the interface and the core technology.",
    image: "/images/images/process-development.png",
    alt: "Developer at work",
  },
  {
    title: "Testing & Maintenance",
    description: "We test the software, launch it securely, and stay on for updates.",
    image: "/images/images/process-testing.png",
    alt: "Engineer monitoring screens",
  },
];

export default function WorkingProcess() {
  return (
    <section className="border-t border-[#E3DDD4] bg-[#F6F4F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-14 max-w-2xl">
          <span className="eyebrow">How we work</span>
          <h2 className="section-title mt-5">A working process for growing the business</h2>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="border-t border-[#E3DDD4] pt-6">
              <div className="relative mb-6 aspect-[4/3] overflow-hidden border border-[#E3DDD4] bg-white">
                <Image src={step.image} alt={step.alt} fill className="object-cover" />
              </div>
              <p className="font-display text-sm tracking-[0.18em] text-[#1E5AC8]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl font-medium text-[#141413]">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-[#5C574F]">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
