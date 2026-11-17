export interface TestimonialData {
  quote: string;
  name: string;
  title: string;
}

function TestimonialCard({ quote, name, title }: TestimonialData) {
  return (
    <figure className="flex h-full flex-col bg-white p-8">
      <blockquote className="text-[15px] leading-relaxed text-[#141413]">“{quote}”</blockquote>
      <figcaption className="mt-8 border-t border-[#E3DDD4] pt-4">
        <p className="text-sm font-medium text-[#141413]">{name}</p>
        {title ? <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#6B6560]">{title}</p> : null}
      </figcaption>
    </figure>
  );
}

export default function TestimonialsBanner({ testimonials }: { testimonials?: TestimonialData[] }) {
  const list = testimonials && testimonials.length > 0 ? testimonials : [];
  if (list.length === 0) return null;

  return (
    <section className="border-t border-[#E3DDD4] bg-[#F6F4F0] py-24 md:py-32">
      <div className="section-shell">
        <div className="max-w-2xl">
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title mt-5 text-balance">What our partners say</h2>
          <p className="section-lead mt-5">
            Notes from businesses we have helped grow across borders.
          </p>
        </div>
        <div className="mt-14 grid gap-px bg-[#E3DDD4] md:grid-cols-2 xl:grid-cols-3">
          {list.map((item, index) => (
            <TestimonialCard key={`${item.name}-${index}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
