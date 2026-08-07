import Image from "next/image";

function MobileTracking() {
  return (
    <>
      <p>
        Managing a mobile workforce and securing corporate devices requires advanced mobile tracking systems. We deliver specialized software-based mobile tracking solutions that help companies coordinate field agents, manage asset dispatching, and secure company smartphones and tablets.
      </p>
      <br />
      <p>
        Whether you are managing a delivery service, coordinating sales representatives, or ensuring the safety of remote workers, our mobile tracking systems provide the real-time insights you need.
      </p>
      <button
        className="bg-white rounded-full px-6 py-3 my-6 hover:bg-gray-200 hover:scale-[0.97] active:scale-[1.02] transition-all cursor-pointer duration-300 border border-slate-200 text-slate-800 font-semibold"
        onClick={() => {}}
      >
        Request Quote &#10132;
      </button>
      <Image
        src="/images/images/landingPageBanner.png"
        alt="Mobile Tracking & Device Management"
        width={1600}
        height={900}
        className="w-screen h-auto rounded-2xl border border-slate-100"
      />
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl uppercase">Mobile Deployment Framework</h2>
      <p>
        Unlike dedicated vehicle trackers, mobile tracking relies on smart application suites running on iOS and Android. This allows for direct messaging, task status reporting, and location telemetry in a single interface.
      </p>
      <br />
      <p>
        Here is the system architecture we establish for enterprise mobile tracking deployments.
      </p>
      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Core Solution Elements</h2>
      <p>
        Our mobile tracking platforms are designed with efficiency and privacy control in mind.
      </p>

      <hr className="my-6" />

      <ul className="list-disc pl-10 space-y-4">
        <li>
          <strong>Mobile Agent App:</strong> A lightweight native application running in the background of target devices, optimized to minimize battery consumption.
        </li>
        <li>
          <strong>Central Dispatch Dashboard:</strong> A web-based control panel displaying active user locations, travel routes, and task completion updates in real time.
        </li>
        <li>
          <strong>MDM (Mobile Device Management) Integration:</strong> Remote management tools that allow administrators to lock, locate, or wipe company data off lost devices.
        </li>
        <li>
          <strong>Offline Data Caching:</strong> Active tracking even when the internet drops, caching coordinates locally and uploading them automatically when connection resumes.
        </li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl mt-10 mb-4 md:text-4xl capitalize">Enterprise Features &amp; Functions</h2>
      <p>
        Our software platforms include advanced functions tailored for business logistics and field coordination.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Job dispatching &amp; Status</h3>
          <p className="text-slate-600 text-sm">
            Assign jobs directly to field agents through the tracking app, with status buttons like "On the way," "Arrived," or "Completed" linked to location coordinates.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Smart Privacy Scheduling</h3>
          <p className="text-slate-600 text-sm">
            Configure automated tracking schedules so locations are only reported during official working hours, respecting employee privacy.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Instant SOS Panic Button</h3>
          <p className="text-slate-600 text-sm">
            Equip staff with a quick-access panic button that immediately broadcasts their precise location to the security team during an emergency.
          </p>
        </div>
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
          <h3 className="text-xl font-semibold mb-2">Travel History &amp; Mileage Reports</h3>
          <p className="text-slate-600 text-sm">
            Automatically log routes and calculate mileage for reimbursement, reducing manual paperwork and entry errors.
          </p>
        </div>
      </div>
    </>
  );
}

export default MobileTracking;
