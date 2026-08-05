import Image from "next/image";

function PrivacyPolicyPage() {
  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <Image
          src="/images/images/SkytechBanner0.png"
          alt="Skytech Ghana"
          width={1600}
          height={240}
          className="w-screen h-auto"
        />
      </div>
      <p className="p-6">privacy policy page</p>
    </div>
  );
}

export default PrivacyPolicyPage;
