import Link from 'next/link';
import { getSettings } from '../app/lib/settings';

export default async function Footer({ settings }) {
  const resolved = settings || (await getSettings());
  const {
    siteName,
    siteDescription,
    contactEmail,
    contactPhone,
    address,
  } = resolved;
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-200 py-16 px-4 mt-16">
      <div className="absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-blue-600 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-cyan-400 blur-3xl" />
      </div>

      <div className="section-shell relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold tracking-tight">{siteName}</h3>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Engineering high-performance digital ecosystems and mobile experiences for the next generation of global business.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-blue-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Clear and honest work
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Performance-First Engineering
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/site/about" className="hover:text-white transition-colors">About Skytech</Link></li>
              <li><Link href="/site/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/site/gallery" className="hover:text-white transition-colors">Project Gallery</Link></li>
              <li><Link href="/site/blog" className="hover:text-white transition-colors">Tech Blog</Link></li>
              <li><Link href="/site/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          {/* Inquiries */}
          <div>
            <h4 className="text-white font-semibold mb-4">Inquiries</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/site/faqs" className="hover:text-white transition-colors">Common Questions</Link></li>
              <li><Link href="/site/contact" className="hover:text-white transition-colors">Project Inquiry</Link></li>
              <li><Link href="/site/internship" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/site/seo" className="hover:text-white transition-colors">Free Forensic Audit</Link></li>
              <li><Link href="/site/contact" className="hover:text-white transition-colors">Partner with Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <p className="flex items-center gap-2">
              <span className="text-blue-300">●</span>
              <a href="mailto:hello@skytech.com" className="hover:text-white transition-colors">hello@skytech.com</a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-blue-300">●</span>
              <a href="tel:+2330552892433" className="hover:text-white transition-colors">+233 055 289 2433</a>
            </p>
            <p className="flex items-center gap-2 text-slate-300/90">
              <span className="text-blue-300">●</span>
              <span>Nii Ankrah Road - Dnor Plaza Spintex</span>
            </p>
            <div className="pt-3">
              <Link href="/site/contact" className="inline-flex btn-primary px-5 py-2 rounded-2xl">
                Start a project
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {year} {siteName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <span className="text-slate-500 md:ml-4">Built for speed & SEO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
