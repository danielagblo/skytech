import Image from "next/image";

const flags = [
  "/images/icons/GhanaFlag.svg",
  "/images/icons/KenyaFlag.svg",
  "/images/icons/USFlag.svg",
  "/images/icons/UKFlag.svg",
  "/images/icons/NigeriaFlag.svg",
];

function FlagsList() {
  return (
    <div className="flex flex-row gap-2 items-center justify-end">
      {flags.map((flag, index) => (
        <div key={index} className="w-9 h-9 rounded-full overflow-hidden">
          <Image
            src={flag}
            alt={`Flag ${index}`}
            width={36}
            height={36}
            className="w-full h-full object-cover scale-[1.35]"
          />
        </div>
      ))}
    </div>
  );
}

export default FlagsList;
