import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Check, 
  History,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { adjustWallet, createOrder, updateOrder } from '../utils/api';

export default function WalletManager({ balance, setBalance, orders, setOrders }) {
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rechargeMethod, setRechargeMethod] = useState('manual');
  const [agentName, setAgentName] = useState('GSMGiriAgent');
  const [rechargeStatus, setRechargeStatus] = useState('Completed');
  const [ledgerFilter, setLedgerFilter] = useState('all');

  const handleManualRecharge = async (e) => {
    e.preventDefault();
    const amount = Number(rechargeAmount);
    if (isNaN(amount) || amount === 0) return;

    try {
      // 1. Update balance on backend
      const walletRes = await adjustWallet(amount);

      // 2. Add log in orders database
      const txId = 'TXN-' + Math.floor(Math.random() * 90000000 + 10000000);
      const dateObj = new Date();
      const formattedDate = dateObj.toISOString().split('T')[0];
      const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const fundLog = {
        id: txId,
        title: amount > 0 
          ? `Admin Balance Credit (${rechargeMethod.toUpperCase()})` 
          : `Admin Balance Debit (Adjustment)`,
        category: 'credits',
        type: 'Wallet Deposit',
        priceINR: Math.abs(amount),
        client: agentName,
        clientContact: 'Admin Workspace Pool',
        date: formattedDate,
        time: formattedTime,
        status: rechargeStatus
      };

      const loggedOrder = await createOrder(fundLog);

      setBalance(walletRes.balance);
      setOrders([loggedOrder, ...orders]);
      setRechargeAmount('');
      alert(`Successfully processed wallet adjustment of ₹${amount.toLocaleString('en-IN')}`);
    } catch (err) {
      alert("Error processing wallet recharge: " + err.message);
    }
  };

  // Quick Approval of simulated pending deposit requests (orders with type 'Wallet Deposit' and status 'Pending')
  const pendingDeposits = orders.filter(o => o.type === 'Wallet Deposit' && o.status === 'Pending');

  const handleApproveDeposit = async (dep) => {
    try {
      await updateOrder(dep.id, { status: 'Completed' });
      const walletRes = await adjustWallet(Number(dep.priceINR));

      const updated = orders.map(o => {
        if (o.id === dep.id) {
          return { ...o, status: 'Completed' };
        }
        return o;
      });

      setOrders(updated);
      setBalance(walletRes.balance);
      alert(`Approved Deposit of ₹${dep.priceINR.toLocaleString('en-IN')} for ${dep.client}!`);
    } catch (err) {
      alert("Error approving deposit: " + err.message);
    }
  };

  const handleRejectDeposit = async (dep) => {
    try {
      await updateOrder(dep.id, { status: 'Cancelled' });

      const updated = orders.map(o => {
        if (o.id === dep.id) {
          return { ...o, status: 'Cancelled' };
        }
        return o;
      });

      setOrders(updated);
      alert(`Rejected Deposit of ₹${dep.priceINR.toLocaleString('en-IN')} for ${dep.client}.`);
    } catch (err) {
      alert("Error rejecting deposit: " + err.message);
    }
  };

  // Filtered ledger transactions (deposits & payments)
  const ledgerItems = orders.filter(o => {
    if (ledgerFilter === 'all') return true;
    if (ledgerFilter === 'deposits') return o.type === 'Wallet Deposit';
    if (ledgerFilter === 'purchases') return o.type !== 'Wallet Deposit';
    return true;
  });

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Wallet & Deposit Control
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Review agent balances, audit account ledgers, and approve wire transfers
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Stats & recharge form */}
        <div className="space-y-6">
          
          {/* Card Showing Agent Balance */}
          <div className="glass-card rounded-xl p-5 border-l-4 border-l-[primary] shadow-md">
            <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest block">
              Active Agent Credit Pool
            </span>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center border border-[#2563EB]/20 text-[#2563EB]">
                <Wallet size={24} />
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black text-[#111827] tracking-tight">
                  ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[9px] text-[#64748B] font-bold uppercase tracking-wider mt-1.5">
                  Synced dynamically in server database
                </span>
              </div>
            </div>
          </div>

          {/* Recharge form */}
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
            <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <Plus size={16} className="text-[#2563EB]" />
              Adjust Balance
            </h2>

            <form onSubmit={handleManualRecharge} className="space-y-4 text-xs">
              
              {/* Target Agent */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Select B2B Agent
                </label>
                <select
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2.5 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
                >
                  <option value="GSMGiriAgent">GSMGiriAgent (Main Portal)</option>
                  <option value="SubAgent_India">SubAgent_India</option>
                  <option value="GuestAgent">Guest Agent Pool</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Amount (Use negative sign for debit adjustments)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#64748B] font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000 or -2000"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg pl-10 pr-4 py-2.5 text-slate-250 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Method select */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Deposit Channel / Log Label
                </label>
                <select
                  value={rechargeMethod}
                  onChange={(e) => setRechargeMethod(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2.5 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
                >
                  <option value="manual">Manual Adjustment</option>
                  <option value="bank">Bank Wire Transfer</option>
                  <option value="crypto">USDT Blockchain Payment</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-[#111827] font-black rounded-xl text-center cursor-pointer transition-all border border-transparent shadow-blue-sm"
              >
                Apply Balance Adjustment
              </button>

            </form>
          </div>

        </div>

        {/* Center/Right pane: Pending Deposit approvals & statement ledger */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Wire/Crypto Approval Queue */}
          {pendingDeposits.length > 0 && (
            <div className="glass-card p-6 rounded-2xl shadow-lg border border-amber-500/30 bg-amber-500/5 space-y-4">
              <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={16} className="text-[#2563EB] animate-pulse" />
                Pending Deposit Requests (Needs Approval)
              </h2>

              <div className="divide-y divide-slate-850">
                {pendingDeposits.map((dep) => (
                  <div key={dep.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-4">
                    <div>
                      <span className="block font-mono text-[10px] text-amber-400 font-bold">{dep.id}</span>
                      <span className="block text-[#111827] font-extrabold mt-0.5">{dep.title}</span>
                      <span className="block text-[10px] text-[#64748B] font-bold mt-1">Agent: {dep.client} • {dep.date}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-black text-[#2563EB]">₹{dep.priceINR.toLocaleString('en-IN')}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectDeposit(dep)}
                          className="bg-red-950/20 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-[#111827] px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm"
                        >
                          Deny
                        </button>
                        <button
                          onClick={() => handleApproveDeposit(dep)}
                          className="bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-transparent text-emerald-400 hover:text-[#111827] px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer flex items-center gap-0.5 shadow-sm"
                        >
                          <Check size={11} /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statement ledger list */}
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                  <History size={16} className="text-[#2563EB]" />
                  Agent Transaction Statement Ledger
                </h2>
                <p className="text-[9px] text-[#64748B] uppercase font-semibold mt-1.5">
                  Full statement of credits, deposits, and service purchases
                </p>
              </div>

              {/* Statement Filters */}
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'All Logs' },
                  { id: 'deposits', label: 'Deposits' },
                  { id: 'purchases', label: 'Purchases' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLedgerFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer shadow-sm ${
                      ledgerFilter === item.id
                        ? 'bg-[#2563EB] text-[#111827] border-transparent shadow-blue-sm'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:border-[#E2E8F0]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statement ledger items */}
            <div className="space-y-3">
              {ledgerItems.map((item) => {
                const isDeposit = item.type === 'Wallet Deposit';
                const isCompleted = item.status === 'Completed' || item.status === 'Confirmed';
                
                return (
                  <div 
                    key={item.id}
                    className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs hover:border-[#2563EB]/30 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        isDeposit 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-[#2563EB]/10 border-[#2563EB]/20 text-[#2563EB]'
                      }`}>
                        {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <span className="font-extrabold text-[#111827] block">{item.title}</span>
                        <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider mt-1 block">
                          Ref ID: <span className="font-mono text-slate-350 font-bold select-all">{item.id}</span> • {item.date} {item.time}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`block font-black text-sm ${isCompleted && isDeposit ? 'text-emerald-400' : 'text-[#111827]'}`}>
                        {isDeposit ? '+' : '-'} ₹{item.priceINR.toLocaleString('en-IN')}
                      </span>
                      <span className={`inline-block text-[8px] font-black uppercase tracking-wider mt-1.5 ${
                        isCompleted
                          ? 'text-emerald-400'
                          : item.status === 'Pending'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {ledgerItems.length === 0 && (
                <div className="text-center py-12 text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                  No statement logs found
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
