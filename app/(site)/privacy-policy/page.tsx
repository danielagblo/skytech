import Image from "next/image";

function PrivacyPolicyPage() {
  return (
    <div className="text-xl">
      {/* Banner Wrapper: dark background matching navbar to prevent white gaps, with top padding so image starts below navbar */}
      <div className="relative w-full bg-slate-950 pt-[60px] md:pt-[80px]">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src="/images/images/AboutBanner.png"
            alt="Privacy Policy"
            fill
            className="object-cover opacity-85"
            priority
          />
          {/* Dark gradient overlay on top of the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10" />
          
          {/* Title overlay directly on the hero image */}
          <div className="absolute bottom-6 left-6 md:left-12 z-20">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Last Updated: August 08, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping Content Section */}
      <div className="relative z-10 -mt-20 md:-mt-32 bg-white p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8 text-slate-700 leading-relaxed text-sm md:text-base pt-4">
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">1. Introduction</h2>
            <p>
              At Skytech Ghana, we respect your privacy and are committed to protecting the personal data we collect. This Privacy Policy outlines how we gather, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">2. Information We Collect</h2>
            <p>
              We may collect personal identification information from you in a variety of ways, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, telephone number, and company details when you submit contact forms or request quotes.</li>
              <li><strong>Usage Data:</strong> Information about your interaction with our website, such as IP address, browser type, pages visited, and time spent.</li>
              <li><strong>Cookies:</strong> We use cookies to improve your user experience and track site traffic patterns. You can disable cookies in your browser settings if preferred.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
            <p>
              Skytech Ghana uses the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, operate, and maintain our digital services.</li>
              <li>To respond directly to your customer support inquiries, feedback, and project requests.</li>
              <li>To improve website performance, usability, and tailored marketing services.</li>
              <li>To send periodic newsletters, updates, or service alerts (you can opt out at any time).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">4. Data Protection and Security</h2>
            <p>
              We implement industry-standard security measures (including SSL encryption) to ensure your personal information remains confidential. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">5. Third-Party Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to third parties. We may share generic aggregated demographic information not linked to any personal data with our trusted affiliates and business partners for analytical purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">6. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to incorrect data, or ask for the deletion of your personal records. Contact us at hello@skytechgh.com to request these changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">7. Changes to This Policy</h2>
            <p>
              Skytech Ghana reserves the right to update this policy at any time. When we do, we will update the &quot;Last Updated&quot; date at the top of this page. We encourage you to review this policy periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
