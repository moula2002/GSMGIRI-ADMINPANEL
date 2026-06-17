import React from 'react';
import {
  ShoppingBag,
  Clock,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Zap,
  Settings
} from 'lucide-react';

export default function Dashboard({ orders, balance, setActiveTab, setEditingOrder }) {
  // Calculations
  const totalOrders = orders.length;

  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Confirmed');
  const totalSales = completedOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || (Number(o.priceINR) * (o.quantity || 1)) || 0), 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const pendingCount = pendingOrders.length;

  const walletDeposits = orders.filter(o => o.type === 'Wallet Deposit');
  const totalDeposits = walletDeposits.reduce((sum, o) => sum + (Number(o.priceINR) || 0), 0);

  // Format currency helper
  const formatINR = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 text-slate-800 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gradient-gold">
            Dashboard Overview
          </h1>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1.5">
            Real-time B2B operations summary
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total B2B Revenue */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp size={17} className="text-emerald-400" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-slate-200">
            {formatINR(totalSales)}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1.5 block">
            From {completedOrders.length} completed orders
          </span>
        </div>

        {/* Pending Queue */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-amber-500 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Clock size={17} className="text-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Pending Orders
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-slate-200">
            {pendingCount}
          </span>
          <span className={`text-[10px] font-bold mt-1.5 block ${pendingCount > 0 ? 'text-amber-500' : 'text-emerald-600'}`}>
            {pendingCount > 0 ? 'Requires immediate action' : 'Queue is clear'}
          </span>
        </div>

        {/* Total Orders Logged */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#d4af37] shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
              <ShoppingBag size={17} className="text-[#d4af37]" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-slate-200">
            {totalOrders}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1.5 block">
            All time order records
          </span>
        </div>

        {/* Current Agent Balance */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#d4af37] shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-[#d4af37]/20">
              <DollarSign size={17} className="text-[#d4af37]" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Wallet Balance
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-slate-200">
            {formatINR(balance)}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1.5 block">
            Available agent credit pool
          </span>
        </div>
      </div>      {/* Main Stats Sections: Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Order Stats Summary (2 columns wide) */}
        <div className="lg:col-span-2 glass-card rounded-xl border border-slate-800 shadow-lg p-6">
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
            <TrendingUp size={15} className="text-[#d4af37]" />
            Order Status Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
              { label: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/5 border-[#d4af37]/20' },
              { label: 'Pending', count: orders.filter(o => o.status === 'Pending').length, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className={`rounded-xl border p-4 transition-all hover:bg-slate-900/30 ${bg}`}>
                <span className={`text-2xl font-black block ${color}`}>{count}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">{label}</span>
              </div>
            ))}
          </div>

          {/* Third-Party API Server Connections Status */}
          <div className="mt-6 pt-5 border-t border-slate-900">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              External API Server Integrations (24x7 Sync)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {[
                { name: 'UnlockTool API', status: 'Online', delay: 'Instant', color: 'text-emerald-400' },
                { name: 'NexaPro Gateway', status: 'Online', delay: '1-3 min', color: 'text-emerald-400' },
                { name: 'iRemoval Server', status: 'Online', delay: 'Instant', color: 'text-emerald-400' },
                { name: 'Phoenix Server', status: 'Online', delay: '1-5 min', color: 'text-emerald-400' }
              ].map(api => (
                <div key={api.name} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] font-bold text-slate-400 truncate">{api.name}</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-[9px] font-black ${api.color}`}>{api.status}</span>
                    <span className="text-[8px] font-semibold text-slate-500">{api.delay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Operations */}
        <div className="glass-card rounded-xl border border-slate-800 shadow-lg p-6">
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
            <Zap size={15} className="text-[#d4af37]" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('wallet')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 hover:bg-[#d4af37]/5 border border-slate-800 hover:border-[#d4af37]/30 rounded-xl text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <DollarSign size={15} className="text-[#d4af37]" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-slate-50 transition-colors">Manage Deposits</span>
              </div>
              <ArrowRight size={13} className="text-slate-500 group-hover:text-[#d4af37] transition-all group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 hover:bg-[#d4af37]/5 border border-slate-800 hover:border-[#d4af37]/30 rounded-xl text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-slate-50 transition-colors">Support Tickets</span>
              </div>
              <ArrowRight size={13} className="text-slate-500 group-hover:text-[#d4af37] transition-all group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 hover:bg-[#d4af37]/5 border border-slate-800 hover:border-[#d4af37]/30 rounded-xl text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap size={15} className="text-emerald-400" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Add New Service</span>
              </div>
              <ArrowRight size={13} className="text-slate-500 group-hover:text-[#d4af37] transition-all group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card rounded-xl border border-slate-800 shadow-lg p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
            Recent Orders
          </h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-[10px] text-slate-400 hover:text-slate-50 hover:bg-[#d4af37] border border-slate-800 hover:border-transparent px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Client / Agent</th>
                <th className="pb-3">Service purchased</th>
                <th className="pb-3">Price (INR)</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 font-mono font-bold text-slate-300">{ord.id}</td>
                  <td className="py-4 font-semibold">
                    <span className="block text-slate-200 font-extrabold">{ord.client}</span>
                    <span className="block text-[10px] text-slate-500 font-semibold lowercase mt-0.5">{ord.clientContact}</span>
                  </td>
                  <td className="py-4 max-w-xs truncate font-bold text-slate-300" title={ord.title}>
                    {ord.title}
                  </td>
                  <td className="py-4 font-black text-[#d4af37]">
                    {formatINR(ord.totalAmount || (ord.priceINR * (ord.quantity || 1)))}
                    {ord.quantity > 1 && (
                      <span className="block text-[8px] text-slate-500 font-bold mt-0.5">
                        {formatINR(ord.priceINR)} x {ord.quantity}
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${ord.status === 'Completed' || ord.status === 'Confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ord.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingOrder(ord);
                        setActiveTab('orders');
                      }}
                      className="text-[10px] bg-slate-900 hover:bg-[#d4af37] text-slate-300 hover:text-slate-50 border border-slate-800 hover:border-transparent px-3 py-1.5 rounded font-extrabold transition-all uppercase cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500 font-bold uppercase tracking-wider">
                    No orders in database queue
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
