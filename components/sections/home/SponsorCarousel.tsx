// import sponsorImage from "@/assets/images/placeholderSponsor.png"
// import Image from "next/image"

// function SponsorCarousel() {
//   return (
//     <div className="flex p-4 gap-4 bg-[#1e59c81e]">
//       {Array.from({ length: 15 }).map((_, index) => (
//         <div key={index} className="shrink-0 px-2">
//           <Image 
//             src={sponsorImage}
//             alt="Sponsor Logo"
//             className="object-contain"
//           />
//         </div>
//       ))}
//     </div>
//   )
// }

// export default SponsorCarousel

// // would later add code to make this animate moving from right to left when theres many sponsors, and also add the actual sponsor images instead of the placeholder.

import sponsorImage from "@/assets/images/placeholderSponsor.png";
import Image from "next/image";

function SponsorCarousel() {
  const sponsors = Array.from({ length: 15 });

  return (
    <div className="overflow-hidden bg-[#1e59c81e] py-4">
      <div className="flex w-max animate-sponsor-scroll">
        {[...sponsors, ...sponsors].map((_, index) => (
          <div key={index} className="shrink-0 px-4">
            <Image
              src={sponsorImage}
              alt="Sponsor Logo"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SponsorCarousel;