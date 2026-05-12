import Link from "next/link";

export const metadata = {
  title: "Blog - Skytech Ghana",
  description: "Insights on web design, mobile development, and SEO growth.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="section-shell space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="pill">Insights</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            The Digital Edge
          </h1>
          <p className="text-lg text-slate-600">
            Expert advice on building, scaling, and optimizing your digital products.
          </p>
        </div>

        {/* Featured Post */}
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-50 aspect-[21/9] flex items-end p-8 md:p-16 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
            <div className="relative z-20 max-w-2xl space-y-4">
                <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-black w-fit">Featured Insight</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                    Why Core Web Vitals are the <br /> New SEO Standard in 2024
                </h2>
                <p className="text-slate-500 text-lg hidden md:block leading-relaxed font-medium">
                    Google's latest algorithm updates prioritize user experience more than ever. Learn how to optimize for speed, stability, and responsiveness.
                </p>
                <div className="flex items-center gap-6 pt-4">
                    <Link href="#" className="btn-primary px-8 py-4">Read Article</Link>
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">12 min read • May 10, 2024</span>
                </div>
            </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, idx) => (
            <article key={idx} className="group space-y-5">
              <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 border border-slate-200">
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                    {post.category} Image
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {post.category}
                    </span>
                    <span className="text-xs text-slate-400">{post.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:gap-3 transition-all">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-panel rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-blue-100 bg-blue-50/30">
            <div className="space-y-3 max-w-md">
                <h2 className="text-3xl font-bold text-slate-900">Stay Updated</h2>
                <p className="text-slate-600">Get the latest insights on technology and design delivered straight to your inbox.</p>
            </div>
            <form className="w-full max-w-md flex gap-3">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button type="submit" className="btn-primary">Join</button>
            </form>
        </div>
      </div>
    </main>
  );
}

const blogPosts = [
  {
    title: "10 Principles of High-Converting Landing Pages",
    category: "Conversion",
    date: "May 8, 2024",
    excerpt: "Conversion rate optimization is an art and a science. We break down the key elements that turn visitors into customers.",
  },
  {
    title: "The Rise of Progressive Web Apps in Africa",
    category: "Technology",
    date: "May 5, 2024",
    excerpt: "Why PWAs are the perfect solution for markets with varying internet connectivity and diverse device ecosystems.",
  },
  {
    title: "Mastering Color Theory in Modern Web Design",
    category: "Design",
    date: "May 2, 2024",
    excerpt: "How to use color to evoke emotion, establish brand identity, and improve accessibility in your digital products.",
  },
  {
    title: "Building Scalable Backend Systems with Node.js",
    category: "Engineering",
    date: "April 28, 2024",
    excerpt: "Deep dive into microservices, database optimization, and cloud infrastructure for growing applications.",
  },
  {
    title: "The Future of AI in Mobile App Development",
    category: "Innovation",
    date: "April 25, 2024",
    excerpt: "From personalized recommendations to advanced image processing, AI is changing how we interact with apps.",
  },
  {
    title: "SEO Myths You Need to Stop Believing",
    category: "Marketing",
    date: "April 22, 2024",
    excerpt: "Separating fact from fiction in the ever-evolving world of search engine optimization.",
  },
];
