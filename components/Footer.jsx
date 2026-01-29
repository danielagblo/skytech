import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-200 py-16 px-4 mt-20">
      <div className="absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-blue-600 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-cyan-400 blur-3xl" />
      </div>

      <div className="section-shell relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold tracking-tight">SkyTech</h3>
            <p className="text-sm text-slate-300/90">
              Professional software development partners delivering web, mobile, and cloud solutions.
            </p>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Trusted engineering team
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/site/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/site/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><Link href="/site/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Expertise</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Product Engineering</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cloud & DevOps</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data & AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile Experiences</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <p className="flex items-center gap-2"><span className="text-blue-300">●</span> hello@skytech.com</p>
            <p className="flex items-center gap-2"><span className="text-blue-300">●</span> +1 (555) 123-4567</p>
            <div className="flex items-center gap-4 pt-2 text-sm">
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2025 SkyTech. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
