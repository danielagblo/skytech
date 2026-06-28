type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP'

const symbols: Record<Currency, string> = {
  GHS: 'GH₵',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function formatCurrency(
  amount: number,
  currency: Currency = 'GHS',
  inSubunit: boolean = false
): string {
  const value = inSubunit ? amount / 100 : amount
  return `${symbols[currency]}${value.toFixed(2)}`
}