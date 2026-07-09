// hooks/useCalculator.ts
import { useState } from "react";

interface CalculationResult {
  lotSize: number;
  unitsToTrade: number;
  riskAmount: number;
  pipValue: number;
  price: number;
}

interface CalculatorInputs {
  accountBalance: string;
  riskPercent: string;
  stopLossPips: string;
  unitsToTrade: string;
  currencyPair: string;
}

export function useCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (inputs: CalculatorInputs): boolean => {
    const e: Record<string, string> = {};
    const { accountBalance, riskPercent, stopLossPips, unitsToTrade } = inputs;

    if (!accountBalance || isNaN(+accountBalance) || +accountBalance <= 0)
      e.accountBalance = "Enter a valid account balance";
    if (!riskPercent || isNaN(+riskPercent) || +riskPercent <= 0 || +riskPercent > 100)
      e.riskPercent = "Risk must be between 0 and 100";
    if (!stopLossPips || isNaN(+stopLossPips) || +stopLossPips <= 0)
      e.stopLossPips = "Enter a valid stop loss";
    if (unitsToTrade && !isNaN(+unitsToTrade) && +unitsToTrade < 0)
      e.unitsToTrade = "Enter a valid number of units";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculatePipValue = (pair: string, price: number): number => {
    const pipSize = pair.includes("JPY") ? 0.01 : 0.0001;
    return (pipSize * 100000) / price;
  };

  const calculate = (
    inputs: CalculatorInputs,
    currentPrice: number
  ): CalculationResult | null => {
    if (!validate(inputs)) return null;

    const { accountBalance, riskPercent, stopLossPips, unitsToTrade, currencyPair } = inputs;
    const pipValue = calculatePipValue(currencyPair, currentPrice);
    const parsedUnits = parseFloat(unitsToTrade);

    if (parsedUnits > 0) {
      const lotSize = parsedUnits / 100000;
      const riskPerLot = parseFloat(stopLossPips) * pipValue;
      const riskAmount = lotSize * riskPerLot;

      return {
        lotSize: Math.round(lotSize * 100) / 100,
        unitsToTrade: Math.round(parsedUnits),
        riskAmount: Math.round(riskAmount * 100) / 100,
        pipValue: Math.round(pipValue * 100) / 100,
        price: currentPrice,
      };
    }

    const riskAmount = (parseFloat(accountBalance) * parseFloat(riskPercent)) / 100;
    const lots = riskAmount / (parseFloat(stopLossPips) * pipValue);

    return {
      lotSize: Math.round(lots * 100) / 100,
      unitsToTrade: Math.round(lots * 100_000),
      riskAmount: Math.round(riskAmount * 100) / 100,
      pipValue: Math.round(pipValue * 100) / 100,
      price: currentPrice,
    };
  };

  const reset = () => {
    setResult(null);
    setErrors({});
  };

  return {
    result,
    errors,
    validate,
    calculate,
    reset,
    setErrors,
  };
}