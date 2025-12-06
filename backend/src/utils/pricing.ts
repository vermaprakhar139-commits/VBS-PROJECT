// Simple dynamic pricing: increases price based on occupancy and days to departure.
export function applyDynamicPricing(basePrice: number, occupancyRatio: number, daysToDeparture: number): number {
  let multiplier = 1;

  if (occupancyRatio > 0.7) multiplier += 0.15;
  else if (occupancyRatio > 0.4) multiplier += 0.05;

  if (daysToDeparture <= 1) multiplier += 0.2;
  else if (daysToDeparture <= 3) multiplier += 0.1;

  const finalPrice = Math.round(basePrice * multiplier);
  return finalPrice;
}