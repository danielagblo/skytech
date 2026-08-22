/** Fixed row height for uniform partner grid cells (px). */
export const PARTNER_GRID_ROW_HEIGHT = 88;

/** Base max logo height inside a single grid cell (px). */
export const PARTNER_LOGO_BASE_HEIGHT = 48;

export function getPartnerLogoScale(logoScale?: number): number {
  return (logoScale ?? 100) / 100;
}

export function getPartnerLogoStyle(logoScale?: number): {
  maxHeight: string;
  transform: string;
  transformOrigin: string;
} {
  const scale = getPartnerLogoScale(logoScale);
  return {
    maxHeight: `${PARTNER_LOGO_BASE_HEIGHT}px`,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };
}

