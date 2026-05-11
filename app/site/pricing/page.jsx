import PDFViewer from "../../../components/PDFViewer";

export const metadata = {
  title: "Pricing & Investment | Skytech Ghana",
  description: "Transparent, value-based pricing for high-performance web and mobile solutions.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="section-shell">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <div className="space-y-4">
            <span className="pill bg-blue-600/10 text-blue-700 border-blue-600/20">Investment Guide</span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight">
              Transparent Pricing. <br /> Maximum Velocity.
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We provide fixed-price solutions and dedicated team models tailored to your project's specific complexity and goals.
            </p>
          </div>

          <div className="rounded-[3rem] border border-slate-200 bg-white p-12 shadow-2xl shadow-slate-200/50 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Standard Rate Card & Packages</h2>
              <p className="text-slate-500">
                Download or view our latest pricing guide for 2024, including web development, mobile apps, and growth retainers.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <PDFViewer src="/static/pricing.pdf" label="Open Interactive Pricing Guide" />
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Secure PDF • 2.4 MB • Updated May 2024
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {[
              { title: "No Hidden Costs", desc: "Every quote includes development, QA, and initial deployment." },
              { title: "Value-Based", desc: "We price based on the impact and complexity of the solution." },
              { title: "Flexible Stages", desc: "Scale your investment as your product grows from MVP to Enterprise." }
            ].map(item => (
              <div key={item.title} className="text-left space-y-3 p-6 rounded-3xl bg-white border border-slate-100">
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
