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

import { useNavigate } from 'react-router-dom';

export default function Dashboard({ orders, setEditingOrder }) {
  const navigate = useNavigate();
  // Calculations
  const totalOrders = orders.length;

  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Confirmed');
  const totalSales = completedOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || (Number(o.priceINR) * (o.quantity || 1)) || 0), 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const pendingCount = pendingOrders.length;


  // Format currency helper
  const formatINR = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Dashboard Overview
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Real-time B2B operations summary
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total B2B Revenue */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white shadow-sm">
              <TrendingUp size={17} />
            </div>
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
              Total Revenue
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-[#111827]">
            {formatINR(totalSales)}
          </span>
          <span className="text-[10px] text-[#64748B] font-semibold mt-1.5 block">
            From {completedOrders.length} completed orders
          </span>
        </div>

        {/* Pending Queue */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-white shadow-sm">
              <Clock size={17} className="animate-pulse" />
            </div>
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
              Pending Orders
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-[#111827]">
            {pendingCount}
          </span>
          <span className={`text-[10px] font-bold mt-1.5 block ${pendingCount > 0 ? 'text-amber-500' : 'text-emerald-600'}`}>
            {pendingCount > 0 ? 'Requires immediate action' : 'Queue is clear'}
          </span>
        </div>

        {/* Total Orders Logged */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white shadow-sm">
              <ShoppingBag size={17} />
            </div>
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
              Total Orders
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-[#111827]">
            {totalOrders}
          </span>
          <span className="text-[10px] text-[#64748B] font-semibold mt-1.5 block">
            All time order records
          </span>
        </div>
      </div>

      {/* Main Stats Sections: Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Order Stats Summary (2 columns wide) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-md p-6">
          <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-5 pb-3 border-b border-[#E2E8F0]/80 flex items-center gap-2">
            <TrendingUp size={15} className="text-[#2563EB]" />
            Order Status Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'text-[#10B981]', bg: 'bg-emerald-500/5 border-emerald-500/20' },
              { label: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, color: 'text-[#2563EB]', bg: 'bg-blue-500/5 border-blue-500/20' },
              { label: 'Pending', count: orders.filter(o => o.status === 'Pending').length, color: 'text-[#F59E0B]', bg: 'bg-amber-500/5 border-amber-500/20' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className={`rounded-xl border p-4 transition-all hover:bg-[#F8FAFC]/30 ${bg}`}>
                <span className={`text-2xl font-black block ${color}`}>{count}</span>
                <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-1 block">{label}</span>
              </div>
            ))}
          </div>

          {/* Third-Party API Server Connections Status */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
            <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              External API Server Integrations (24x7 Sync)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {[
                { name: 'UnlockTool API', status: 'Online', delay: 'Instant', color: 'text-emerald-400' },
                { name: 'NexaPro Gateway', status: 'Online', delay: '1-3 min', color: 'text-emerald-400' },
                { name: 'iRemoval Server', status: 'Online', delay: 'Instant', color: 'text-emerald-400' },
                { name: 'Phoenix Server', status: 'Online', delay: '1-5 min', color: 'text-emerald-400' }
              ].map(api => (
                <div key={api.name} className="p-3 bg-[#F8FAFC]/40 border border-[#E2E8F0] rounded-xl">
                  <span className="block text-[9px] font-bold text-[#64748B] truncate">{api.name}</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-[9px] font-black ${api.color}`}>{api.status}</span>
                    <span className="text-[8px] font-semibold text-[#64748B]">{api.delay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Operations */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-md p-6">
          <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-5 pb-3 border-b border-[#E2E8F0]/80 flex items-center gap-2">
            <Zap size={15} className="text-[#2563EB]" />
            Quick Actions
          </h3>
          <div className="space-y-2">




            <button
              onClick={() => navigate('/services')}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB]/30 rounded-xl text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap size={15} className="text-emerald-400" />
                <span className="text-xs font-bold text-[#111827] transition-colors">Add New Service</span>
              </div>
              <ArrowRight size={13} className="text-[#64748B] group-hover:text-[#2563EB] transition-all group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-md p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E2E8F0]/80">
          <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
            Recent Orders
          </h3>
          <button
            onClick={() => navigate('/orders')}
            className="text-[10px] text-[#2563EB] hover:text-white hover:bg-[#2563EB] border border-[#E2E8F0] hover:border-transparent px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] text-[#0F172A] text-[10px] uppercase tracking-wider font-extrabold border-b border-[#E2E8F0]">
                <th className="py-3 px-2 rounded-tl-lg">Order ID</th>
                <th className="py-3 px-2">Client / Agent</th>
                <th className="py-3 px-2">Service purchased</th>
                <th className="py-3 px-2">Price (INR)</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-[#EFF6FF] transition-colors">
                  <td className="py-4 px-2 font-mono font-bold text-[#111827]">{ord.id}</td>
                  <td className="py-4 px-2 font-semibold">
                    <span className="block text-[#111827] font-extrabold">{ord.client}</span>
                    <span className="block text-[10px] text-[#64748B] font-semibold lowercase mt-0.5">{ord.clientContact}</span>
                  </td>
                  <td className="py-4 px-2 max-w-xs truncate font-bold text-[#111827]" title={ord.title}>
                    {ord.title}
                  </td>
                  <td className="py-4 px-2 font-black text-[#2563EB]">
                    {formatINR(ord.totalAmount || (ord.priceINR * (ord.quantity || 1)))}
                    {ord.quantity > 1 && (
                      <span className="block text-[8px] text-[#64748B] font-bold mt-0.5">
                        {formatINR(ord.priceINR)} x {ord.quantity}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${ord.status === 'Completed' || ord.status === 'Confirmed'
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      : ord.status === 'Pending'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                        : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                      }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button
                      onClick={() => {
                        setEditingOrder(ord);
                        navigate('/orders');
                      }}
                      className="text-[10px] bg-white hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#E2E8F0] hover:border-transparent px-3 py-1.5 rounded font-extrabold transition-all uppercase cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#64748B] font-bold uppercase tracking-wider">
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
