import * as SQLite from "expo-sqlite";

export interface TradeHistory {
  id?: number;
  pair: string;
  accountCurrency: string;
  accountBalance: number;
  riskPercent: number;
  riskAmount: number;
  stopLossPips: number;
  takeProfitPips: number | null;
  lotSize: number;
  units: number;
  moneyAtRisk: number;
  potentialProfit: number | null;
  riskRewardRatio: number | null;
  status: "TP" | "SL" | "BE";
  entryPrice: number | null;
  stopLossPrice: number | null;
  takeProfitPrice: number | null;
  timestamp: number;
}

class Database {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync("trading_history.db");
    this.initDatabase();
  }

  private initDatabase() {
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pair TEXT NOT NULL,
        accountCurrency TEXT NOT NULL,
        accountBalance REAL NOT NULL,
        riskPercent REAL NOT NULL,
        riskAmount REAL NOT NULL,
        stopLossPips REAL NOT NULL,
        takeProfitPips REAL,
        lotSize REAL NOT NULL,
        units REAL NOT NULL,
        moneyAtRisk REAL NOT NULL,
        potentialProfit REAL,
        riskRewardRatio REAL,
        status TEXT NOT NULL CHECK(status IN ('TP', 'SL', 'BE')),
        entryPrice REAL,
        stopLossPrice REAL,
        takeProfitPrice REAL,
        timestamp INTEGER NOT NULL
      );
    `);
  }

  async insertTrade(trade: Omit<TradeHistory, "id">): Promise<number> {
    const result = await this.db.runAsync(
      `INSERT INTO trades (
        pair, accountCurrency, accountBalance, riskPercent, riskAmount,
        stopLossPips, takeProfitPips, lotSize, units, moneyAtRisk,
        potentialProfit, riskRewardRatio, status, entryPrice,
        stopLossPrice, takeProfitPrice, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trade.pair,
        trade.accountCurrency,
        trade.accountBalance,
        trade.riskPercent,
        trade.riskAmount,
        trade.stopLossPips,
        trade.takeProfitPips,
        trade.lotSize,
        trade.units,
        trade.moneyAtRisk,
        trade.potentialProfit,
        trade.riskRewardRatio,
        trade.status,
        trade.entryPrice,
        trade.stopLossPrice,
        trade.takeProfitPrice,
        trade.timestamp,
      ],
    );
    return result.lastInsertRowId;
  }

  async getTrades(): Promise<TradeHistory[]> {
    const results = await this.db.getAllAsync<TradeHistory>(
      "SELECT * FROM trades ORDER BY timestamp DESC",
    );
    return results;
  }

  async deleteTrade(id: number): Promise<void> {
    await this.db.runAsync("DELETE FROM trades WHERE id = ?", [id]);
  }

  async clearAllTrades(): Promise<void> {
    await this.db.runAsync("DELETE FROM trades");
  }

  async updateTradeStatus(
    id: number,
    status: "TP" | "SL" | "BE",
  ): Promise<void> {
    await this.db.runAsync("UPDATE trades SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }
}

export const database = new Database();
