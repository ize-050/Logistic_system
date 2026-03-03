"use client";

import React, { useState } from 'react';
import { X, Calendar, DollarSign, Bike, Car, Truck } from 'lucide-react';
import { AppType } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function EarningModal({ isOpen, onClose, onSubmit }: Props) {
  const [app, setApp] = useState<AppType>('Grab');
  const [amount, setAmount] = useState('');
  const [trips, setTrips] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Modal Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Add Earning</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Record your daily shift</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ app, amount: Number(amount), trips: Number(trips), date }); }} className="p-8 pt-4 space-y-6">
          
          {/* App Selector */}
          <div className="grid grid-cols-3 gap-3">
            <AppOption 
              active={app === 'Grab'} 
              onClick={() => setApp('Grab')} 
              label="Grab" 
              icon={<Bike size={20} />} 
              color="bg-green-500" 
            />
            <AppOption 
              active={app === 'Bolt'} 
              onClick={() => setApp('Bolt')} 
              label="Bolt" 
              icon={<Car size={20} />} 
              color="bg-blue-500" 
            />
            <AppOption 
              active={app === 'Lalamove'} 
              onClick={() => setApp('Lalamove')} 
              label="Lala" 
              icon={<Truck size={20} />} 
              color="bg-orange-500" 
            />
          </div>

          <div className="space-y-4">
            {/* Amount Input */}
            <div className="relative">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Total Amount (฿)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={24} />
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-5 pl-14 pr-6 text-2xl font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Trips Input */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Trips</label>
                <input 
                  type="number" 
                  required
                  placeholder="0"
                  value={trips}
                  onChange={e => setTrips(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-4 px-6 text-xl font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>

              {/* Date Input */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-3xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-cyan-500/20 active:scale-[0.98] transition-all mt-4 uppercase tracking-widest">
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
}

function AppOption({ active, onClick, label, icon, color }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all
        ${active 
          ? `${color} border-transparent text-white shadow-lg shadow-${color.split('-')[1]}-500/20` 
          : 'bg-slate-800/30 border-slate-700/50 text-slate-500 hover:border-slate-600'}
      `}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
