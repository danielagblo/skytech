import Link from "next/link";

export const metadata = {
  title: "Gallery - Skytech Ghana",
  description: "Showcase of our latest web and mobile app projects.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="section-shell space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="pill">Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Work in Action
          </h1>
          <p className="text-lg text-slate-600">
            A selection of projects where we've helped businesses transform their digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div 
              key={idx} 
              className="group relative overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 aspect-[4/5] hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
              {/* Placeholder for project image */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium italic">
                {project.category} Project Image
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {project.description}
                </p>
                <Link 
                  href="/site/contact" 
                  className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all"
                >
                  View Case Study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[3rem] bg-slate-50 border border-slate-100 p-12 text-center space-y-6 shadow-sm">
          <h2 className="text-3xl font-black text-slate-900">Ready to start your project?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Let's build something world-class together. We're currently taking on new projects for the upcoming quarter.
          </p>
          <Link href="/site/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10">
            Get a Free Proposal
          </Link>
        </div>
      </div>
    </main>
  );
}

const projects = [
  {
    title: "EcoDrive Solutions",
    category: "Mobile App",
    description: "A comprehensive fleet management and tracking system for logistics companies.",
  },
  {
    title: "Lumina Real Estate",
    category: "Web Platform",
    description: "Premium property listing and virtual tour platform with advanced search.",
  },
  {
    title: "Aura Wellness",
    category: "E-commerce",
    description: "Customized online store for premium wellness products with subscription features.",
  },
  {
    title: "Nexus Banking",
    category: "Fintech",
    description: "Secure, fast, and intuitive digital banking interface for the modern age.",
  },
  {
    title: "Vivid Media",
    category: "Brand Design",
    description: "Complete digital rebranding and website launch for a global media agency.",
  },
  {
    title: "Swift Logistics",
    category: "Internal Tool",
    description: "Custom ERP system for managing complex supply chains across Africa.",
  },
];
