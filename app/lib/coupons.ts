export interface CouponOffer {
  code: string;
  percent: number;
  label: string;
}

/** Valid promo codes for /forms. Codes are matched case-insensitively. */
const COUPON_LIST: CouponOffer[] = [
  { code: "SKYTECH10", percent: 10, label: "10% off" },
  { code: "WELCOME15", percent: 15, label: "15% off" },
  { code: "SKY20", percent: 20, label: "20% off" },
];

export function lookupCoupon(raw: string): CouponOffer | null {
  const code = String(raw || "").trim().toUpperCase();
  if (!code) return null;
  return COUPON_LIST.find((c) => c.code === code) || null;
}
