export type AppType = 'Grab' | 'Bolt' | 'Lalamove' | 'Other';
export type TransactionType = 'Income' | 'Expense';
export type RiderName = 'Ice' | 'Mind';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  app: AppType;
  rider_name: RiderName;
  category: string;
  amount: number;
  trips: number;
  notes?: string;
  created_at: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'created_at'>;

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  totalTrips: number;
  appBreakdown: Record<string, number>;
  riderBreakdown: Record<string, { income: number; expense: number; profit: number }>;
}
