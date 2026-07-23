import Image from "next/image"

import discoeryAndPlanningImage from "@/assets/images/process-planning.png"
import executionAndDevelopmentImage from "@/assets/images/process-development.png"
import testingAndMaintenanceImage from "@/assets/images/process-testing.png"

const steps = [
  {
    title: 'Discovery & Planning',
    description: 'This ensures we are perfectly aligned on your vision, budget, and deadlines before building starts.',
    image: discoeryAndPlanningImage,
    alt: 'Team planning with sticky notes',
  },
  {
    title: 'Execution & Development',
    description: 'Our design and engineering teams bring the concept to life, building the user interface and the core technology.',
    image: executionAndDevelopmentImage,
    alt: 'Developer writing code checklist',
  },
  {
    title: 'Testing & Maintenance',
    description: 'We rigorously test the software for bugs, launch it securely to the public, and provide ongoing updates.',
    image: testingAndMaintenanceImage,
    alt: 'Engineer monitoring screens',
  },
]

export default function WorkingProcess() {
  return (
    <section className="py-12 px-6 md:py-20 md:px-10">
      <h2 className="text-3xl text-center font-normal leading-tight mb-10 max-w-3xl mx-auto md:text-5xl md:mb-24">
        Our working process on how to grow your business
      </h2>

      <div className="relative">
        <div className="hidden md:block absolute top-2/7 left-0 right-0 border-t-3 border-dashed border-gray-300 z-0" />

        <div className="grid grid-cols-1 gap-10 relative z-10 md:grid-cols-3 md:gap-8 md:px-17.5">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-8 bg-black shrink-0 md:w-60 md:h-60">
                <Image
                  src={step.image}
                  alt={step.alt}
                  className="w-40 h-40 object-cover md:w-60 md:h-60"
                />
              </div>

              <div className="px-2">
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}