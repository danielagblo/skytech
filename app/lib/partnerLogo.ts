export function getPartnerLogoHeight(
  partner: { rowSpan?: number; logoScale?: number },
  base = 40,
): number {
  return Math.round((partner.rowSpan ?? 1) * base * ((partner.logoScale ?? 100) / 100));
}
