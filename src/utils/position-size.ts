export interface PositionSizeInput {
  accountBalance: number;
  riskPercent: number;
  riskAmount?: number;
  stopLossPips: number;
  takeProfitPips?: number;
  pair: string;
  accountCurrency: string;
  isRiskAmount: boolean;
}

export interface PositionSizeOutput {
  moneyAtRisk: number;
  riskAmount: number;
  units: number;
  lotSize: number;
  potentialProfit: number | null;
  riskRewardRatio: number | null;
}

// Simplified pip value calculation - in production, this would use actual exchange rates
function getPipValue(pair: string, accountCurrency: string): number {
  // This is a simplified version. Real implementation would use current market rates
  if (pair === "EURUSD" && accountCurrency === "USD") return 10;
  if (pair === "GBPUSD" && accountCurrency === "USD") return 10;
  if (pair === "USDJPY" && accountCurrency === "USD") return 9.3;
  if (pair === "AUDUSD" && accountCurrency === "USD") return 10;
  if (pair === "USDCAD" && accountCurrency === "USD") return 7.4;
  if (pair === "USDCHF" && accountCurrency === "USD") return 10.8;
  // Default fallback
  return 10;
}

export function calculatePositionSize(
  input: PositionSizeInput,
): PositionSizeOutput {
  const {
    accountBalance,
    riskPercent,
    riskAmount,
    stopLossPips,
    takeProfitPips,
    pair,
    accountCurrency,
    isRiskAmount,
  } = input;

  // Calculate money at risk
  let moneyAtRisk: number;
  let riskAmountCalculated: number;

  if (isRiskAmount && riskAmount !== undefined) {
    moneyAtRisk = riskAmount;
    riskAmountCalculated = riskAmount;
  } else {
    moneyAtRisk = accountBalance * (riskPercent / 100);
    riskAmountCalculated = moneyAtRisk;
  }

  // Get pip value per standard lot (100,000 units)
  const pipValue = getPipValue(pair, accountCurrency);

  // Calculate lot size
  const lotSize = moneyAtRisk / (stopLossPips * pipValue);
  const units = lotSize * 100000;

  // Calculate potential profit and risk-reward ratio
  let potentialProfit: number | null = null;
  let riskRewardRatio: number | null = null;

  if (takeProfitPips && takeProfitPips > 0) {
    potentialProfit = lotSize * takeProfitPips * pipValue;
    riskRewardRatio = takeProfitPips / stopLossPips;
  }

  return {
    moneyAtRisk,
    riskAmount: riskAmountCalculated,
    units,
    lotSize,
    potentialProfit,
    riskRewardRatio,
  };
}
