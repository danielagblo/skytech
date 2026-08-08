import Image from "next/image";

const items = [
  {
    title: "8 Years of Proven Expertise",
    body: "Nearly a decade of hands-on experience delivering reliable, high-performing software and web solutions across borders.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: "Our Relationship with You",
    body: "We plug in like your internal IT department with absolute transparency. We don’t disappear suddenly, we stay.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4 4 4 0 004 4z" />
    ),
  },
  {
    title: "Complimentary Maintenance",
    body: "Enjoy peace of mind with free ongoing maintenance to keep your platforms secure, updated, and running smoothly.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: "Teamwork",
    body: "We integrate seamlessly with your team, working side by side to support your business goals.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m3-3.13a4 4 0 10-4-4 4 4 0 004 4zM12 4a4 4 0 100 8 4 4 0 000-8z" />
    ),
  },
];

function WhyYouNeedUs() {
  return (
    <section id="why-us" className="bg-white">
      {/* Header — image bleeding to the left screen edge */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60vw] md:block">
          <Image
            src="/images/images/manSitting.png"
            alt="Why You Need Us"
            fill
            sizes="60vw"
            priority
            className="object-contain object-left"
          />
        </div>

        <div className="md:hidden relative">
          <div className="pointer-events-none relative left-1/2 w-screen -translate-x-1/2">
            <Image
              src="/images/images/manSitting.png"
              alt="Why You Need Us"
              width={520}
              height={520}
              className="mx-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="section-shell relative md:flex md:min-h-[34rem] md:items-center">
          <h2 className="mx-auto w-full max-w-3xl px-5 pt-0 text-center font-display text-6xl font-semibold uppercase leading-[1.1] tracking-tight text-slate-900 sm:text-6xl md:absolute md:top-1/2 md:left-1/2 md:w-auto md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2 md:px-0 md:py-14 md:text-left md:text-5xl lg:text-6xl">
            Here is why
            <span className="block">
              <span className="font-outline text-[0.9em] font-semibold tracking-widest"> you need us</span>
            </span>
          </h2>
        </div>
      </div>

      {/* Floor + cards */}
      <div className="bg-[#f7f7f7] py-16 md:-mt-[8rem] md:pt-[11rem]">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-none p-6 shadow-soft bg-white text-slate-900"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-none bg-black/5">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  {item.icon}
                </svg>
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Risk reduction strip */}
        <div className="mx-auto mt-5 max-w-[80rem] px-5 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-none bg-white px-6 py-5 text-center shadow-soft sm:flex-row sm:text-left md:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Risk reduction</p>
            <p className="font-display text-2xl font-semibold text-slate-900">100% Transparency</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyYouNeedUs;