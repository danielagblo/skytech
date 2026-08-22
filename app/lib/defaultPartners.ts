import type { IAffiliate } from "./affiliates";

/** Companies Skytech Ghana has built websites/apps for */
const SKYTECH_CLIENTS: Omit<IAffiliate, "order">[] = [
  { name: "Accord Industrial Services", logoUrl: "/images/clients/accord-industrial.png" },
  { name: "Atlas Rent-A-Car", logoUrl: "/images/clients/atlas-rent-a-car.png" },
  { name: "Star Pace Car Rental", logoUrl: "/images/clients/star-pace.png" },
  { name: "Kambel Consult", logoUrl: "/images/clients/kambel-consult.png" },
  { name: "Bricsky", logoUrl: "/images/clients/bricsky.png" },
  { name: "Très Jolie", logoUrl: "/images/clients/tres-jolie.png" },
  { name: "Finlays", logoUrl: "/images/clients/finlays.png" },
];

/** Industry leaders (Accord Industrial Services network) */
const INDUSTRY_PARTNERS: Omit<IAffiliate, "order">[] = [
  { name: "Gold Recovery Ghana", logoUrl: "/images/partners/gold-recovery-ghana.jpg" },
  { name: "GHACEM", logoUrl: "/images/partners/ghacem.png" },
  { name: "Flour Mills of Ghana", logoUrl: "/images/partners/flour-mills-ghana.png" },
  { name: "Bunge Loders Croklaan", logoUrl: "/images/partners/bunge-loders-croklaan.jpg" },
  { name: "Afrotropic Cocoa", logoUrl: "/images/partners/afrotropic-cocoa.jpg" },
  { name: "Cocoa Touton", logoUrl: "/images/partners/cocoa-touton.png" },
  { name: "Meridian Port Services", logoUrl: "/images/partners/meridian-port-services.jpg" },
  { name: "GB Foods", logoUrl: "/images/partners/gb-foods.png" },
  { name: "SGS Laboratory", logoUrl: "/images/partners/sgs-laboratory.png" },
  { name: "VRA", logoUrl: "/images/partners/vra.png" },
  { name: "Dzata Cement", logoUrl: "/images/partners/dzata-cement.png" },
  { name: "GPHA", logoUrl: "/images/partners/gpha.png" },
  { name: "PSC Tema Shipyard", logoUrl: "/images/partners/psc-tema-shipyard.png" },
  { name: "Accra Marriott", logoUrl: "/images/partners/accra-marriott.png" },
  { name: "Contracta", logoUrl: "/images/partners/contracta.jpg" },
];

function withDefaults(partners: Omit<IAffiliate, "order">[], startOrder = 0): IAffiliate[] {
  return partners.map((partner, index) => ({
    ...partner,
    order: startOrder + index,
    colSpan: 1,
    rowSpan: 1,
    visible: true,
  }));
}

export const SKYTECH_BUILD_CLIENTS = withDefaults(SKYTECH_CLIENTS);
export const INDUSTRY_LEADER_PARTNERS = withDefaults(INDUSTRY_PARTNERS, SKYTECH_CLIENTS.length);

export const DEFAULT_PARTNERS: IAffiliate[] = [
  ...SKYTECH_BUILD_CLIENTS,
  ...INDUSTRY_LEADER_PARTNERS,
];
