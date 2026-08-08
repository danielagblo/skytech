import Image from "next/image";

function CCTVSurveillance() {
  return (
    <>
      <p>
        In today&apos;s world, securing your assets requires more than just physical locks, it demands continuous, intelligent visibility. We engineer and deploy professional-grade CCTV surveillance systems tailored to protect homes, businesses, and industrial facilities across Ghana.
      </p>
      <br />
      <p>
        Whether you need to monitor remote perimeters, secure high-traffic retail spaces, or establish secure corporate surveillance networks, our end-to-end solutions keep you connected to what matters most, 24/7
      </p>

      <Image
        src="/images/images/manFixingCamera.png"
        alt="CCTV Surveillance"
        width={1600}
        height={900}
        className="w-full h-auto rounded-none"
      />
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl uppercase">Installation framework</h2>
      <p>
        To pull off a clean, professional NVR/DVR machine room setup that looks great on your website portfolio and keeps the system running 24/7, you need to move away from just dropping equipment on a desk.
      </p>
      <br />
      <p>
        Here is the professional framework for setting up the central surveillance station (the &quot;brain&quot; of the system).
      </p>
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Core Server Room components</h2>
      <p>
        A professional installation centralizes all hardware inside a secure enclosure. This protects against tampering, manages heat, and organizes power layout.
      </p>

      <hr className="my-6" />

      <ul className="list-disc pl-10 space-y-4">
        <li>
          The Server Rack (Data Cabinet): A wall-mounted or floor-standing 6U, 9U, or 12U network rack with a lockable glass front. This keeps the NVR, network switches, and power supplies securely locked away.
        </li>
        <li>
          The NVR/DVR (The Recorder): The central machine fitted with high-capacity surveillance-grade hard drives (e.g., WD Purple or Seagate SkyHawk) to handle continuous data streams.
        </li>
        <li>
          Central PoE Switch: Connects all incoming Cat6 lines from the cameras, powering them and aggregating all video traffic into a single uplink cable to the NVR.
        </li>
        <li>
          The UPS (Uninterruptible Power Supply): A battery backup unit that keeps the NVR and core cameras running seamlessly during a power flash or local blackout.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Project Execution framework</h2>
      <p>
        When a client hires you for a CCTV and security setup, they aren&apos;t just buying hardware&mdash;they are buying a flawless deployment process. Here is the end-to-end framework for how to execute a professional security project from first contact to final handover.
      </p>

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">The 5-phase project execution framework</h2>

      <ol className="capitalize">
        <li>
          <p className="font-semibold">1. Site Survey &amp; Risk Assessment:</p>
          <p className="subtitle">Phase 1: Discovery</p>
          <p className="mb-5">
            Walk through the property with the client to map out clear vulnerabilities. We identify high-risk areas&mdash;such as entry/exit perimeters, dark zones, and cash-handling points&mdash;and establish the target Field of View (FOV) for every intended camera drop.
          </p>
        </li>
        <li>
          <p className="font-semibold">2. System Engineering &amp; Design Approval:</p>
          <p className="subtitle">Phase 2: Architecture</p>
          <p className="mb-5">
            We build a complete schematic layout of the network topology. This includes selecting the ideal hardware combination (Domes indoors, Bullets outdoors, Smart Sensors for entryways) and calculating power consumption constraints to size the PoE switches and UPS backups perfectly.
          </p>
        </li>
        <li>
          <p className="font-semibold">3. Civil Works, Cable Containment &amp; Infrastructure:</p>
          <p className="subtitle">Phase 3: Deployment</p>
          <p className="mb-5">
            The actual physical layout begins. Our technicians run solid copper Cat6 cabling entirely enclosed within heavy-duty, weatherproof PVC conduits or galvanized metal trunking. This guarantees absolute protection against both rough weather elements and intentional manual tampering.
          </p>
        </li>
        <li>
          <p className="font-semibold">Machine Room Setup &amp; System Tuning:</p>
          <p className="subtitle">Phase 4: Optimization</p>
          <p className="mb-5">
            We mount the core equipment inside a secure, lockable network rack. Hard drives are initialized, cameras are fine-tuned for crisp day/night visibility, and compression protocols like H.265+ are activated to maximize recording storage days without losing image quality.
          </p>
        </li>
        <li>
          <p className="font-semibold">5. remote Gateway Syncing &amp; Client Sign-Off:</p>
          <p className="subtitle">Phase 5: Handover</p>
          <p className="mb-5">
            We establish an encrypted P2P cloud connection so you can view crystal-clear video streams on your phone from anywhere. We train your team on how to retrieve footage, review safety sensor alerts, and complete the official project handover with documentation.
          </p>
        </li>
      </ol>
    </>
  );
}

export default CCTVSurveillance;
