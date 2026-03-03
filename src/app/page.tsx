"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Bike, Car, Truck, Calendar as CalendarIcon, 
  Plus, BarChart3, Wallet, ArrowDownCircle, ArrowUpCircle, Trash2, ChevronDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TransactionModal from '@/components/entry/TransactionModal';
import { transactionService } from '@/lib/supabase/service';
import { Transaction, FinancialSummary, RiderName } from '@/types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function LogisticsDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRider, setActiveRider] = useState<RiderName | 'All'>('Ice');
  
  // Time State
  const now = new Date();
  const [viewType, setViewType] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0, totalExpense: 0, netProfit: 0, totalTrips: 0, appBreakdown: {} as any, riderBreakdown: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const riderParam = activeRider === 'All' ? undefined : activeRider as RiderName;
      
      const data = await transactionService.getAll(riderParam, selectedYear);
      setTransactions(data);
      
      const s = await transactionService.getSummary(
        selectedYear, 
        viewType === 'Monthly' ? selectedMonth : undefined, 
        riderParam
      );
      setSummary(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeRider, selectedYear, selectedMonth, viewType]);

  const handleAddTransaction = async (data: any) => {
    try {
      const riderToSave = activeRider === 'All' ? 'Ice' : activeRider;
      await transactionService.create({ ...data, rider_name: riderToSave });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error saving data!');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันว่าต้องการลบรายการนี้ใช่ไหม?')) {
      try {
        await transactionService.delete(id);
        fetchData();
      } catch (err) {
        alert('ลบไม่สำเร็จ กรุณาลองใหม่');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Top Rider Switcher */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 px-6 py-3 flex justify-center gap-2 sticky top-0 z-40 backdrop-blur-md">
        <RiderTab active={activeRider === 'Ice'} onClick={() => setActiveRider('Ice')} name="ICE" color="bg-cyan-500" />
        <RiderTab active={activeRider === 'Mind'} onClick={() => setActiveRider('Mind')} name="MIND" color="bg-purple-500" />
        <RiderTab active={activeRider === 'All'} onClick={() => setActiveRider('All')} name="TOTAL" color="bg-slate-600" />
      </div>

      <header className="bg-slate-900/40 border-b border-slate-800 px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${activeRider === 'Mind' ? 'bg-purple-600 shadow-purple-500/20' : activeRider === 'Ice' ? 'bg-cyan-600 shadow-cyan-500/20' : 'bg-slate-600 shadow-slate-500/20'}`}>
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white leading-none uppercase italic">Rider Pro</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">
                {activeRider} Portfolio
              </p>
            </div>
          </div>
          {loading && <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
           <select 
             value={viewType} 
             onChange={(e: any) => setViewType(e.target.value)}
             className="bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 py-2 pl-3 pr-8 focus:ring-0"
           >
             <option value="Monthly">Monthly</option>
             <option value="Yearly">Yearly</option>
           </select>
           
           <select 
             value={selectedYear} 
             onChange={(e: any) => setSelectedYear(Number(e.target.value))}
             className="bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 py-2 pl-3 pr-8 focus:ring-0"
           >
             {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
           </select>

           {viewType === 'Monthly' && (
             <select 
               value={selectedMonth} 
               onChange={(e: any) => setSelectedMonth(Number(e.target.value))}
               className="bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 py-2 pl-3 pr-8 focus:ring-0"
             >
               {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
             </select>
           )}
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-8 pb-32">
        
        {/* Main Financial Card */}
        <section className={`rounded-[2.5rem] p-8 border shadow-2xl relative overflow-hidden transition-all duration-500 ${activeRider === 'Mind' ? 'bg-gradient-to-br from-purple-900/40 to-slate-900 border-purple-500/20' : activeRider === 'Ice' ? 'bg-gradient-to-br from-cyan-900/40 to-slate-900 border-cyan-500/20' : 'bg-slate-800 border-slate-700/50'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
            <Wallet size={150} />
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
            Net Profit {viewType === 'Monthly' ? `in ${MONTHS[selectedMonth-1]}` : `in ${selectedYear}`}
          </p>
          <h2 className={`text-6xl font-black mb-6 tracking-tighter ${summary.netProfit >= 0 ? 'text-white' : 'text-rose-500'}`}>
            ฿{summary.netProfit.toLocaleString()}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 rounded-3xl p-5 border border-emerald-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <ArrowUpCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Income</span>
              </div>
              <p className="text-2xl font-black text-white">฿{summary.totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-rose-500/10 rounded-3xl p-5 border border-rose-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-rose-500 mb-2">
                <ArrowDownCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">Expense</span>
              </div>
              <p className="text-2xl font-black text-white">฿{summary.totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* TEAM BREAKDOWN */}
        {activeRider === 'All' && (
          <section className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="bg-slate-900/80 p-5 rounded-[2rem] border border-cyan-500/20 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 font-black text-[10px]">I</div>
                   <span className="text-xs font-black text-white uppercase tracking-wider">ICE</span>
                </div>
                <p className="text-xl font-black text-cyan-400">฿{(summary.riderBreakdown['Ice']?.profit || 0).toLocaleString()}</p>
             </div>
             <div className="bg-slate-900/80 p-5 rounded-[2rem] border border-purple-500/20 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-black text-[10px]">M</div>
                   <span className="text-xs font-black text-white uppercase tracking-wider">MIND</span>
                </div>
                <p className="text-xl font-black text-purple-400">฿{(summary.riderBreakdown['Mind']?.profit || 0).toLocaleString()}</p>
             </div>
          </section>
        )}

        {/* Activity Ledger */}
        <section>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Activity History</h3>
            <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">{viewType} VIEW</span>
          </div>
          <div className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800/50 overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-16 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest italic">No records for this period.</div>
            ) : (
              <div className="divide-y divide-slate-800/30">
                {transactions.slice(0, 15).map(t => (
                  <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] uppercase shadow-inner shrink-0 ${t.rider_name === 'Mind' ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        {t.rider_name.substring(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <p className="text-sm font-bold text-white truncate">{t.category}</p>
                           <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{t.type}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate">{t.date} • {t.app}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <p className={`text-sm font-black tracking-tighter ${t.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'Income' ? '+' : '-'}฿{Number(t.amount).toLocaleString()}
                      </p>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Floating Action Bar */}
      {activeRider !== 'All' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-40">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-white ${activeRider === 'Mind' ? 'bg-purple-600 shadow-purple-500/30 hover:bg-purple-500' : 'bg-cyan-600 shadow-cyan-500/30 hover:bg-cyan-500'}`}
          >
            <Plus size={28} />
            Add Entry
          </button>
        </div>
      )}

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTransaction} />
    </div>
  );
}

function RiderTab({ active, onClick, name, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2 rounded-2xl text-[9px] font-black tracking-widest transition-all duration-300 ${active ? `${color} text-white shadow-lg shadow-${color.split('-')[1]}-500/20` : 'bg-slate-800/50 text-slate-500 hover:bg-slate-800'}`}
    >
      {name}
    </button>
  );
}
