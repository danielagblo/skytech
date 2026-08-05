import Image from "next/image";

function TermsOfUsePage() {
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
      <p className="p-6">terms of use page</p>
    </div>
  );
}

export default TermsOfUsePage;
