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
    <div className="grid grid-cols-1 divide-y-[5px] divide-white rounded-xl overflow-hidden mx-6 md:grid-cols-3 md:divide-x-[5px] md:divide-y-0 md:mx-10">
      {problems.map((problem, index) => (
        <div key={index} className="p-6 bg-[#f9f9f9] flex flex-col gap-3">
          <h3 className="font-bold text-xl leading-snug md:h-12">{problem.title}</h3>
          <p className="text-gray-700 text-base leading-relaxed">{problem.body}</p>
        </div>
      ))}
    </div>
  );
}
