const problems = [
  {
    title: 'Orphaned Tech "Dilemma"',
    body: `The founders observed a frustrating cycle where businesses and organizations invested heavily in expensive software, digital tools, or infrastructure, only for those tools to break down without any reliable local support. Technology was being sold as a product rather than a continuous partnership.`,
  },
  {
    title: 'The "Build-and-Vanish" Agency Model',
    body: `Traditional development teams treated client engagements as short-term transactions. They would deliver code, collect the final invoice, and immediately drop communication. This left businesses stranded with highly complex systems they didn't know how to maintain, secure, or update.`,
  },
  {
    title: 'The Fortune-500 Price Trap & High Maintenance Charges',
    body: `Tech firms charge astronomical consultant fees tailored for global conglomerates, paired with exploitative, hidden post-launch upkeep fees. Local small-to-medium enterprises (SMEs) are completely priced out, locked out of the tools they need to automate, scale, or secure their operations.`,
  },
];

export default function ProblemCards() {
  return (
    <div className="section-shell">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="flex flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 font-display text-base font-semibold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-3 text-xl font-semibold leading-snug text-slate-900">{problem.title}</h3>
            <p className="text-base leading-relaxed text-slate-600">{problem.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}