import Image from "next/image";

function HardwareProcurementAndSupply() {
  return (
    <>
      <p>
        Building a reliable IT and security system requires high-quality, enterprise-grade hardware. We specialize in sourcing, verifying, and supplying top-tier networking hardware, security systems, server infrastructure, and power backup units from leading global manufacturers.
      </p>
      <br />
      <p>
        Instead of dealing with unreliable components or inconsistent suppliers, our team handles the sourcing process end-to-end, delivering tested and certified hardware tailored to your specific project needs.
      </p>

      <Image
        src="/images/images/hardware_procure_new.png"
        alt="Hardware Procurement and Supply"
        width={1600}
        height={900}
        className="w-full h-auto rounded-2xl border border-slate-100 object-cover max-h-[500px]"
      />
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl uppercase">Procurement Framework</h2>
      <p>
        Sourcing hardware is more than just placing orders. We employ a rigorous procurement process that guarantees item compatibility, quality verification, and efficient delivery logistics.
      </p>
      <br />
      <p>
        Here is the technical lifecycle we use to execute every procurement project successfully.
      </p>
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Our Core Supply Areas</h2>
      <p>
        We source and distribute hardware components across all major enterprise technology sectors.
      </p>

      <hr className="my-6" />

      <ul className="list-disc pl-10 space-y-4">
        <li>
          <strong>Network Infrastructure:</strong> Enterprise routers, switches, fiber optic patch panels, access points, and organized rack solutions.
        </li>
        <li>
          <strong>Surveillance Hardware:</strong> High-resolution IP cameras, NVR recorders, specialized security hard drives, and mounting equipment.
        </li>
        <li>
          <strong>Server &amp; Data Center Systems:</strong> Blade servers, rack-mount servers, network-attached storage (NAS), and storage enclosures.
        </li>
        <li>
          <strong>Power Solutions:</strong> Online UPS units, automatic voltage regulators (AVR), smart power distribution units (PDU), and batteries.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">The Sourcing &amp; Supply Framework</h2>
      <p>
        We handle all logistics steps to ensure your equipment arrives in perfect condition and is ready to deploy.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">1. Hardware Selection</h3>
          <p className="text-slate-600 text-sm">
            We evaluate your technical requirements and select hardware models that fit your performance targets and budget.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">2. OEM Sourcing</h3>
          <p className="text-slate-600 text-sm">
            We source directly from Original Equipment Manufacturers (OEMs) or authorized global distributors, ensuring all hardware is genuine and under warranty.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">3. Pre-Shipment Testing</h3>
          <p className="text-slate-600 text-sm">
            Every critical component undergoes testing in our lab to verify performance and eliminate Out-of-Box Failures (OBF).
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">4. On-Site Handover</h3>
          <p className="text-slate-600 text-sm">
            We deliver the hardware directly to your site, provide complete documentation, and offer optional installation and integration support.
          </p>
        </div>
      </div>
    </>
  );
}

export default HardwareProcurementAndSupply;
