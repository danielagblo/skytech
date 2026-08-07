import Image from "next/image";

function BiometricAndAutomatedGate() {
  return (
    <>
      <p>
        Securing entry points is the first line of defense for any modern facility. We design and install high-performance biometric systems and automated gate barriers that regulate access, track attendance, and secure residential estates, corporate headquarters, and industrial plants.
      </p>
      <br />
      <p>
        From lightning-fast facial recognition terminals to heavy-duty automated barriers capable of continuous operation, our access solutions offer a smooth user experience while maintaining strict perimeter control.
      </p>
      <button
        className="bg-white rounded-full px-6 py-3 my-6 hover:bg-gray-200 hover:scale-[0.97] active:scale-[1.02] transition-all cursor-pointer duration-300 border border-slate-200 text-slate-800 font-semibold"
        onClick={() => {}}
      >
        Request Quote &#10132;
      </button>
      <Image
        src="/images/images/propertytechImage.png"
        alt="Biometric & Automated Gate Systems"
        width={1600}
        height={900}
        className="w-screen h-auto rounded-2xl border border-slate-100"
      />
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl uppercase">Access Control Framework</h2>
      <p>
        A professional entry-management deployment integrates physical barriers with electronic identity verification. Our installations prioritize durability, speed, and fail-safe safety protocols.
      </p>
      <br />
      <p>
        Here is the technical architecture we utilize to deliver secure, automated perimeters.
      </p>
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Core Hardware Components</h2>
      <p>
        We source commercial-grade parts designed to withstand heavy daily traffic and environmental elements.
      </p>

      <hr className="my-6" />

      <ul className="list-disc pl-10 space-y-4">
        <li>
          <strong>Biometric Terminals:</strong> Smart scanners equipped with facial recognition, fingerprint readers, and RFID/NFC modules, processing verification in under 0.2 seconds.
        </li>
        <li>
          <strong>Heavy-Duty Gate Operators:</strong> Industrial-grade swing or sliding gate motors (e.g., Centurion or FAAC) engineered for continuous cycles with battery backups.
        </li>
        <li>
          <strong>Automated Boom Barriers:</strong> High-speed traffic barriers with reflective arms and loop detectors to prevent accidental closure on vehicles.
        </li>
        <li>
          <strong>Centralized Access Controller:</strong> IP-based controller boards that link all readers, locks, and barriers to a central management server for real-time monitoring.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Key Features &amp; Integrations</h2>
      <p>
        Our systems are fully customizable, providing seamless control and comprehensive logs of all perimeter activities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Time &amp; Attendance Logs</h3>
          <p className="text-slate-600 text-sm">
            Automatically track employee clock-in and clock-out times, syncing directly with standard HR and payroll platforms.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Visitor Management Systems</h3>
          <p className="text-slate-600 text-sm">
            Generate temporary access PINs or QR codes for visitors, which auto-expire after a set period or single use.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">ANPR (License Plate) Integration</h3>
          <p className="text-slate-600 text-sm">
            Connect high-resolution cameras that read and verify vehicle license plates against a whitelist, opening gates automatically.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Fail-Safe Safety Protocols</h3>
          <p className="text-slate-600 text-sm">
            Configured to automatically unlock or open in emergency situations (e.g., fire alarm triggers) to guarantee safe evacuation routes.
          </p>
        </div>
      </div>
    </>
  );
}

export default BiometricAndAutomatedGate;
