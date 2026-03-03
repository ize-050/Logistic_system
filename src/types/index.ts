import { AppType } from "@/types";

export type TransactionType = 'Income' | 'Expense';
export type RiderName = 'Ice' | 'Mind'; // เพิ่มประเภทคนขับ

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  app: AppType;
  rider_name: RiderName; // เพิ่มฟิลด์ชื่อคนขับ
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
  appBreakdown: Record<AppType, number>;
  riderBreakdown: Record<string, { income: number; expense: number; profit: number }>;
}
