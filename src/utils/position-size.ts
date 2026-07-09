export interface CalculationResult {
  lotSize: number;
  unitsToTrade: number;
  riskAmount: number;
  pipValue: number;
  price: number;
}

export function calculateLotSize(
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValuePerLot: number,
  currentPrice: number,
  pair: string,
): CalculationResult {
  const riskAmount = (accountBalance * riskPercent) / 100;
  const lots = riskAmount / (stopLossPips * pipValuePerLot);
  return {
    lotSize: Math.round(lots * 100) / 100,
    unitsToTrade: Math.round(lots * 100_000),
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipValue: Math.round(pipValuePerLot * 100) / 100,
    price: currentPrice,
  };
}