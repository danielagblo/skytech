import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    id: "choose",
    label: "01",
    body: "Year after year, businesses choose us for reliable digital business development services.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M12 3.5 14.2 8l4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 17l.8-4.8L5 8.7 9.8 8 12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "support",
    label: "02",
    body: "We provide lasting support that drives real-world results for your business.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M7 8h10v7.5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 15.5V8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M9 8V6.5A3 3 0 0 1 12 3.5v0A3 3 0 0 1 15 6.5V8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.5 18.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "grow",
    label: "03",
    body: "Your success is our mission, and your growth is our commitment.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M5 16.5 10 11l3.5 3.5L19 8.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14.5 8.5H19v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/** Presentational — scroll pin/scrub lives in FilmHome with the other homepage hijacks. */
export default function HowItWorks() {
  return (
    <section className="relative px-3 pb-3 pt-5 md:px-5 md:pt-6">
      <div data-founder-pin className="mx-auto max-w-[1180px]">
        <div className="overflow-hidden rounded-[28px] bg-white px-5 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">From the founder</p>
            <h2 className="mt-2 font-display text-[clamp(1.7rem,3.8vw,2.5rem)] font-medium tracking-tight text-[#161616]">
              Founder&apos;s Remark
            </h2>
          </header>

          <div className="mt-5 grid items-center gap-6 lg:mt-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[20px] bg-[#f3f3f1]">
                <Image
                  src="/images/images/manSitting.png"
                  alt="Skytech Ghana work in progress"
                  fill
                  className="object-cover object-[50%_18%]"
                  sizes="(min-width: 1024px) 480px, 90vw"
                />
              </div>
              <div className="absolute bottom-3 right-3 rounded-full bg-[#d5f5a8] px-3 py-1.5 text-xs font-medium text-[#161616] shadow-sm">
                <Link href="#offers" className="inline-flex items-center gap-1.5">
                  See the offers
                  <span aria-hidden>↗</span>
                </Link>
              </div>
            </div>

            <div className="relative lg:pl-1">
              <div
                aria-hidden
                className="absolute bottom-3 left-[1.15rem] top-3 hidden w-px overflow-hidden bg-black/10 sm:block"
              >
                <span data-founder-line className="absolute inset-0 origin-top scale-y-0 bg-[#8dce3a]" />
              </div>
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={step.id} data-founder-step className="relative flex gap-3.5">
                    <span
                      data-founder-icon
                      className={`relative z-[1] grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#161616] ${
                        index === 0 ? "bg-[#d5f5a8]" : "border border-black/10 bg-white"
                      }`}
                    >
                      {step.icon}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40">{step.label}</p>
                      <p className="mt-1 text-sm font-medium leading-snug tracking-tight text-[#161616] sm:text-[15px]">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
