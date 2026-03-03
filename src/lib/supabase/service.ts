import { supabase } from './client';
import { Transaction, TransactionInput, RiderName } from '@/types';

export const transactionService = {
  async getAll(riderName?: RiderName, year?: number, month?: number) {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (riderName && riderName !== ('All' as any)) {
      query = query.eq('rider_name', riderName);
    }

    if (year) {
      const start = `${year}-01-01`;
      const end = `${year}-12-31`;
      query = query.gte('date', start).lte('date', end);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Transaction[];
  },

  async create(input: TransactionInput) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([input])
      .select();
    
    if (error) throw error;
    return data[0] as Transaction;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getSummary(year: number, month?: number, riderName?: RiderName) {
    let query = supabase.from('transactions').select('*');

    if (month) {
      const monthStr = month < 10 ? `0${month}` : month;
      query = query.gte('date', `${year}-${monthStr}-01`).lte('date', `${year}-${monthStr}-31`);
    } else {
      query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`);
    }

    if (riderName && riderName !== ('All' as any)) {
      query = query.eq('rider_name', riderName);
    }

    const { data, error } = await query;
    if (error) throw error;

    const summary = (data as Transaction[]).reduce((acc, curr) => {
      const amount = Number(curr.amount);
      const rider = curr.rider_name;

      if (!acc.riderBreakdown[rider]) {
        acc.riderBreakdown[rider] = { income: 0, expense: 0, profit: 0 };
      }

      if (curr.type === 'Income') {
        acc.totalIncome += amount;
        acc.totalTrips += curr.trips;
        acc.appBreakdown[curr.app] = (acc.appBreakdown[curr.app] || 0) + amount;
        acc.riderBreakdown[rider].income += amount;
      } else {
        acc.totalExpense += amount;
        acc.riderBreakdown[rider].expense += amount;
      }
      
      acc.riderBreakdown[rider].profit = acc.riderBreakdown[rider].income - acc.riderBreakdown[rider].expense;
      
      return acc;
    }, {
      totalIncome: 0,
      totalExpense: 0,
      netProfit: 0,
      totalTrips: 0,
      appBreakdown: {} as any,
      riderBreakdown: {} as any
    });

    summary.netProfit = summary.totalIncome - summary.totalExpense;
    return summary;
  }
};
