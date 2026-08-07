import Image from "next/image";

function GPSTracking() {
  return (
    <>
      <p>
        In an era of rising logistical complexities and security concerns, keeping real-time visibility over your mobile assets is crucial. We offer enterprise-grade GPS tracking solutions designed to monitor fleets, protect valuable machinery, and secure personal or corporate vehicles across Ghana.
      </p>
      <br />
      <p>
        Our systems combine high-precision satellite telemetry with powerful, cloud-based analytics, letting you view locations, track behavior, and secure assets 24/7.
      </p>
      <button
        className="bg-white rounded-full px-6 py-3 my-6 hover:bg-gray-200 hover:scale-[0.97] active:scale-[1.02] transition-all cursor-pointer duration-300 border border-slate-200 text-slate-800 font-semibold"
        onClick={() => {}}
      >
        Request Quote &#10132;
      </button>
      <Image
        src="/images/images/logisticsAndFleetImage.png"
        alt="GPS Tracking and Fleet Monitoring"
        width={1600}
        height={900}
        className="w-screen h-auto rounded-2xl border border-slate-100"
      />
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl uppercase">Tracking Framework</h2>
      <p>
        A premium GPS tracking setup requires robust hardware integrated into the vehicle's electrical system, paired with a resilient cellular/satellite backup system for uninterrupted reporting.
      </p>
      <br />
      <p>
        Here is the technical infrastructure we deploy to guarantee full asset security and real-time telemetry.
      </p>
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Core System Components</h2>
      <p>
        Every active tracker is configured with industrial components to ensure it operates under harsh conditions and remains concealed from unauthorized detection.
      </p>

      <hr className="my-6" />

      <ul className="list-disc pl-10 space-y-4">
        <li>
          <strong>OBD &amp; Hardwired Telemetry Units:</strong> Hardwired deep within the dashboard or plugged directly into the OBD-II port, pulling power directly from the vehicle battery with internal backups.
        </li>
        <li>
          <strong>Dual-Band GNSS Receiver:</strong> Connects to multiple satellite constellations (GPS, GLONASS, Galileo) for accurate positioning down to less than 2.5 meters.
        </li>
        <li>
          <strong>Smart Power Management:</strong> Automatically switches to an internal battery backup if the main vehicle battery is disconnected, triggering an instant tampering alert.
        </li>
        <li>
          <strong>Secure IoT Gateway:</strong> Transmits coordinates, speed, and diagnostics via encrypted 4G/LTE protocols directly to our cloud monitoring platforms.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Key Features &amp; Capabilities</h2>
      <p>
        Our tracking platform does more than just show a dot on a map. It equips fleet managers and vehicle owners with active security protocols and driver insights.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Real-Time Geofencing</h3>
          <p className="text-slate-600 text-sm">
            Define precise geographical boundaries. Receive instant SMS or push notifications the moment a vehicle enters or exits designated work zones.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Remote Engine Immobilization</h3>
          <p className="text-slate-600 text-sm">
            In the event of unauthorized use or theft, safely send a secure command to disable the starter motor, preventing the vehicle from restarting.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Fuel &amp; Behavior Analytics</h3>
          <p className="text-slate-600 text-sm">
            Monitor idling times, rapid acceleration, harsh braking, and fuel consumption to optimize driver habits and reduce operational costs.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Historical Route Playback</h3>
          <p className="text-slate-600 text-sm">
            Access up to 90 days of detailed route history, stops, speeds, and idle durations for compliance and incident investigations.
          </p>
        </div>
      </div>
    </>
  );
}

export default GPSTracking;
