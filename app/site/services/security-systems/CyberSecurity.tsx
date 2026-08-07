import Image from "next/image";

function CyberSecurity() {
  return (
    <>
      <p>
        As digital systems become core to daily business operations, protecting sensitive data and networks is a priority. We offer comprehensive cyber security solutions engineered to shield your business from evolving digital threats, ransomware, data leaks, and unauthorized intrusions.
      </p>
      <br />
      <p>
        Our proactive security services help secure your corporate networks, optimize device endpoints, and establish a culture of digital safety through audits and continuous monitoring.
      </p>

      <Image
        src="/images/images/globeImage.png"
        alt="Cyber Security Solutions and Infrastructure"
        width={1600}
        height={900}
        className="w-full h-auto rounded-2xl border border-slate-100"
      />
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl uppercase">Security Operations Framework</h2>
      <p>
        Building a strong digital defense requires a multi-layered approach. We combine state-of-the-art security appliances with smart monitoring systems to identify, block, and mitigate digital risks.
      </p>
      <br />
      <p>
        Here is the design methodology we use to secure enterprise and corporate networks.
      </p>
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Core Defense Solutions</h2>
      <p>
        We build protection systems at the network edge, inside the server room, and directly on user devices.
      </p>

      <hr className="my-6" />

      <ul className="list-disc pl-10 space-y-4">
        <li>
          <strong>Next-Generation Firewalls (NGFW):</strong> High-performance hardware appliances that inspect all incoming and outgoing network traffic, filtering out malicious payloads and unauthorized protocols.
        </li>
        <li>
          <strong>Endpoint Detection &amp; Response (EDR):</strong> Advanced antivirus and anti-ransomware software deployed on all corporate laptops, desktops, and servers to identify threats in real time.
        </li>
        <li>
          <strong>Multi-Factor Authentication (MFA):</strong> Secure identity verification setups that ensure only authorized staff can access corporate systems and databases.
        </li>
        <li>
          <strong>Intrusion Detection Systems (IDS/IPS):</strong> Constant network scanners that identify suspicious activity, alerting security administrators and blocking attacks as they happen.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Professional Audit &amp; Analysis</h2>
      <p>
        Cyber security is not just about installing software—it requires continuous review and adaptation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Vulnerability Assessments</h3>
          <p className="text-slate-600 text-sm">
            We scan your active servers, websites, and local networks to identify unpatched software or weak configurations before hackers can exploit them.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Penetration Testing</h3>
          <p className="text-slate-600 text-sm">
            Simulated cyber attacks conducted by our security experts to test the resilience of your defenses and evaluate response times.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Data Backup &amp; Disaster Recovery</h3>
          <p className="text-slate-600 text-sm">
            Secure, encrypted backup routines that duplicate critical databases to offline and cloud storage, ensuring recovery in case of ransomware incidents.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Security Awareness Training</h3>
          <p className="text-slate-600 text-sm">
            Educating your team on how to recognize phishing emails, practice safe browsing, and protect access passwords.
          </p>
        </div>
      </div>
    </>
  );
}

export default CyberSecurity;
