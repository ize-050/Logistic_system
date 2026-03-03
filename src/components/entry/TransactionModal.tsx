"use client";

import React, { useState } from 'react';
import { X, Calendar, DollarSign, Bike, Car, Truck, Fuel, Settings, Pizza, MoreHorizontal } from 'lucide-react';
import { AppType, TransactionType } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function TransactionModal({ isOpen, onClose, onSubmit }: Props) {
  const [type, setType] = useState<TransactionType>('Income');
  const [app, setApp] = useState<AppType>('Grab');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Ride Fare');
  const [trips, setTrips] = useState('0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const incomeCategories = ['Ride Fare', 'Bonus', 'Tips', 'Other'];
  const expenseCategories = ['Fuel', 'Maintenance', 'Food', 'Mobile Data', 'Insurance', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Add Transaction</h2>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => { setType('Income'); setCategory('Ride Fare'); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${type === 'Income' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                Income
              </button>
              <button 
                onClick={() => { setType('Expense'); setCategory('Fuel'); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${type === 'Expense' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                Expense
              </button>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { 
          e.preventDefault(); 
          onSubmit({ type, app, category, amount: Number(amount), trips: Number(trips), date }); 
        }} className="p-8 pt-4 space-y-6">
          
          {type === 'Income' && (
            <div className="grid grid-cols-3 gap-3">
              <AppOption active={app === 'Grab'} onClick={() => setApp('Grab')} label="Grab" icon={<Bike size={20} />} color="bg-green-500" />
              <AppOption active={app === 'Bolt'} onClick={() => setApp('Bolt')} label="Bolt" icon={<Car size={20} />} color="bg-blue-500" />
              <AppOption active={app === 'Lalamove'} onClick={() => setApp('Lalamove')} label="Lala" icon={<Truck size={20} />} color="bg-orange-500" />
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
              >
                {(type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Amount (฿)</label>
              <div className="relative">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 ${type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                   <DollarSign size={24} />
                </div>
                <input 
                  type="number" required placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-5 pl-14 pr-6 text-2xl font-black text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Trips / Units</label>
                <input 
                  type="number" value={trips} onChange={e => setTrips(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-4 px-6 text-xl font-black text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Date</label>
                <input 
                  type="date" required value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          <button type="submit" className={`w-full py-5 rounded-3xl font-black text-lg shadow-xl active:scale-[0.98] transition-all mt-4 uppercase tracking-widest text-white ${type === 'Income' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/20'}`}>
            Save {type}
          </button>
        </form>
      </div>
    </div>
  );
}

function AppOption({ active, onClick, label, icon, color }: any) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${active ? `${color} border-transparent text-white shadow-lg` : 'bg-slate-800/30 border-slate-700/50 text-slate-500'}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
