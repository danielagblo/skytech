import Image from "next/image";

const items = [
  {
    title: "Many Years of Proven Expertise",
    body: "Years of hands-on experience delivering reliable, high-performing software and web solutions across borders.",
  },
  {
    title: "Our Relationship with You",
    body: "We plug in like your internal IT department with absolute transparency. We don’t disappear suddenly, we stay.",
  },
  {
    title: "Complimentary Maintenance",
    body: "Enjoy peace of mind with free ongoing maintenance to keep your platforms secure, updated, and running smoothly.",
  },
  {
    title: "Teamwork",
    body: "We integrate seamlessly with your team, working side by side to support your business goals.",
  },
];

function WhyYouNeedUs() {
  return (
    <section id="why-us" className="border-t border-[#E3DDD4] bg-[#F6F4F0] py-24 md:py-32">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#E3DDD4] bg-white">
          <Image
            src="/images/images/manSitting.png"
            alt="A Skytech specialist at work"
            width={720}
            height={720}
            className="h-auto w-full object-contain"
          />
        </div>
        <div className="max-w-xl">
          <span className="eyebrow">Why Skytech</span>
          <h2 className="section-title mt-5">Here is why you need us</h2>
          <p className="section-lead mt-5">
            A direct partnership that stays after launch, with the work kept in the open.
          </p>
        </div>
      </div>

      <div className="section-shell mt-16 grid gap-px bg-[#E3DDD4] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.title} className="bg-white p-7">
            <span className="font-display text-sm tracking-[0.18em] text-[#1E5AC8]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-lg font-medium leading-snug text-[#141413]">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5C574F]">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="section-shell mt-10 flex flex-col gap-2 border-t border-[#E3DDD4] pt-6 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1E5AC8]">Risk reduction</p>
        <p className="font-display text-3xl font-medium tracking-tight text-[#141413]">100% Transparency</p>
      </div>
    </section>
  );
}

export default WhyYouNeedUs;
