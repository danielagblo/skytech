import Image from "next/image";

const steps = [
  {
    title: "Discovery & Planning",
    description: "This ensures we are perfectly aligned on your vision, budget, and deadlines before building starts.",
    image: "/images/images/process-planning.png",
    alt: "Team planning with sticky notes",
  },
  {
    title: "Execution & Development",
    description: "Our design and engineering teams bring the concept to life, building the user interface and the core technology.",
    image: "/images/images/process-development.png",
    alt: "Developer writing code checklist",
  },
  {
    title: "Testing & Maintenance",
    description: "We rigorously test the software for bugs, launch it securely to the public, and provide ongoing updates.",
    image: "/images/images/process-testing.png",
    alt: "Engineer monitoring screens",
  },
];

export default function WorkingProcess() {
  return (
    <section className="bg-slate-50 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="section-tag justify-center">How we work</span>
          <h2 className="section-title mt-4 max-w-3xl text-balance">
            Our working process on how to grow your business
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 border-t-[3px] border-dashed border-brand-200 lg:block" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:px-[4.375rem]">
            {steps.map((step, index) => (
              <div key={index} className="group relative flex flex-col">
                <div className="relative mx-auto mb-8 shrink-0">
                  <span className="absolute -top-3 -left-3 z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 font-display text-base font-semibold text-white shadow-soft">
                    {index + 1}
                  </span>
                  <div className="h-40 w-40 overflow-hidden rounded-full bg-slate-900 md:h-56 md:w-56">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      width={240}
                      height={240}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="px-2 text-center md:text-left">
                  <h3 className="font-display text-2xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}