import Image from "next/image";

import ghanaFlag from "../../assets/icons/GhanaFlag.svg";
import kenyaFlag from "../../assets/icons/KenyaFlag.svg";
import USFlag from "../../assets/icons/USFlag.svg";
import UKFlag from "../../assets/icons/UKFlag.svg";
import nigeriaFlag from "../../assets/icons/NigeriaFlag.svg";

function FlagsList() {
  return (
    <div className="flex flex-row gap-2 items-center justify-end">
      {
        [
          ghanaFlag,
          kenyaFlag, 
          USFlag,
          UKFlag,
          nigeriaFlag
        ].map((flag, index) => (
          <div key={index} className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              key={index}
              src={flag}
              alt={`Flag ${index}`}
              className="w-full h-full object-cover scale-135"
            />
          </div>
        ))
      }
    </div>
  )
}

export default FlagsList
