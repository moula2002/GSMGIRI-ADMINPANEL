import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Printer, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { updateOrder, deleteOrder } from '../utils/api';

export default function OrdersManager({ orders, setOrders, editingOrder, setEditingOrder }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Update order detail state
  const [updateStatus, setUpdateStatus] = useState('Pending');
  const [activationCode, setActivationCode] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (editingOrder) {
      setUpdateStatus(editingOrder.status);
      setActivationCode(editingOrder.activationCode || '');
    }
  }, [editingOrder]);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const payload = {
      status: updateStatus,
      activationCode: activationCode
    };

    try {
      await updateOrder(editingOrder.id, payload);
      const updated = orders.map(o => {
        if (o.id === editingOrder.id) {
          return {
            ...o,
            ...payload
          };
        }
        return o;
      });

      setOrders(updated);
      setEditingOrder(null);
      setActivationCode('');
    } catch (err) {
      alert("Error updating order: " + err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order from history?")) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
        if (editingOrder?.id === id) setEditingOrder(null);
      } catch (err) {
        alert("Error deleting order: " + err.message);
      }
    }
  };

  const getConvertedPrice = (priceINR) => {
    return `₹${priceINR.toLocaleString('en-IN')}`;
  };

  // Filters
  const filteredOrders = orders.filter(o => {
    const matchesSearch = searchQuery === '' || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || o.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Orders Control Panel
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Fulfill keys, manage status codes, and issue client invoices
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column: Orders List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between border border-[#E2E8F0] shadow-lg">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search ID, client, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-semibold rounded-lg pl-11 pr-4 py-3 text-[#111827] focus:outline-none transition-all duration-200 shadow-inner"
              />
            </div>

            {/* Category and Status Dropdowns */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full md:w-auto bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2.5 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
              >
                <option value="all">All Categories</option>
                <option value="leases">Rent Tools</option>
                <option value="packages">Activations</option>
                <option value="credits">Credits Pack</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2.5 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>

          {/* Orders Table Container */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0]">
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[10px] text-[#64748B] uppercase tracking-wider font-extrabold bg-[#F8FAFC]/50">
                    <th className="p-4">Order Details</th>
                    <th className="p-4">Agent / Contact</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F8FAFC]/30 transition-colors">
                      <td className="p-4">
                        <span className="block font-mono text-[10px] text-[#2563EB] font-extrabold">{ord.id}</span>
                        <span className="block text-[#111827] font-extrabold text-[12px] mt-1 max-w-xs truncate" title={ord.title}>
                          {ord.title}
                        </span>
                        <span className="inline-block mt-1 text-[8px] bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]/60 px-2 py-0.5 rounded uppercase font-black">
                          {ord.type}
                        </span>
                        <span className="inline-block mt-1 text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-black ml-1.5">
                          Qty: {ord.quantity || 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="block text-slate-250 font-extrabold">{ord.client}</span>
                        <span className="block text-[10px] text-[#64748B] font-semibold lowercase mt-0.5">{ord.clientContact}</span>
                      </td>
                      <td className="p-4 font-black text-[#2563EB]">
                        {getConvertedPrice(ord.totalAmount || (ord.priceINR * (ord.quantity || 1)))}
                        {ord.quantity > 1 && (
                          <span className="block text-[8px] text-[#64748B] font-bold mt-0.5">
                            {getConvertedPrice(ord.priceINR)} x {ord.quantity}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          ord.status === 'Completed' || ord.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ord.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInvoice(ord)}
                          title="View Invoice"
                          className="p-1.5 bg-[#F8FAFC] hover:bg-[#2563EB] border border-[#E2E8F0] hover:border-transparent rounded text-[#64748B] hover:text-[#111827] transition-all cursor-pointer inline-flex items-center shadow-sm"
                        >
                          <FileText size={13} />
                        </button>
                        <button
                          onClick={() => setEditingOrder(ord)}
                          className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-[#2563EB] text-[#111827] hover:text-[#111827] border border-[#E2E8F0] hover:border-transparent rounded text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm"
                        >
                          Fulfill
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          title="Delete Log"
                          className="p-1.5 bg-red-950/20 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-[#111827] transition-all cursor-pointer inline-flex items-center shadow-sm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-[#64748B] font-bold uppercase tracking-wider">
                        No orders match your filter criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Update/Fulfill Order Form (1 col) */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
            <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#2563EB]" />
              Fulfillment Desk
            </h2>

            {editingOrder ? (
              <form onSubmit={handleUpdateStatusSubmit} className="space-y-5 text-xs">
                
                {/* Active Info */}
                <div className="bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-[#64748B] font-bold">
                    <span>ORDER WORKSPACE</span>
                    <span className="font-mono text-[#2563EB]">{editingOrder.id}</span>
                  </div>
                  <span className="block text-[#111827] font-extrabold text-[12px]">{editingOrder.title}</span>
                  <span className="block text-[10px] text-[#64748B] font-bold mt-1">Client: {editingOrder.client}</span>
                  <div className="flex justify-between items-center text-[10px] text-[#64748B] font-bold mt-1.5 pt-1.5 border-t border-[#E2E8F0]/60">
                    <span>Quantity: {editingOrder.quantity || 1}</span>
                    <span className="text-[#2563EB]">Total: {getConvertedPrice(editingOrder.totalAmount || (editingOrder.priceINR * (editingOrder.quantity || 1)))}</span>
                  </div>
                </div>

                {/* Status selector */}
                <div>
                  <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-2">
                    Update Order Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3.5 py-3 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
                  >
                    <option value="Pending">⌛ Pending</option>
                    <option value="Confirmed">✓ Confirmed</option>
                    <option value="Completed">★ Completed</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </div>

                {/* Activation Response Message */}
                <div>
                  <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-2">
                    Activation Code / Key Response
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter rental credentials or license serial code activation voucher key details..."
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-semibold rounded-lg p-3 text-[#111827] focus:outline-none transition-all duration-200"
                  ></textarea>
                  <p className="text-[9px] text-[#64748B] mt-1.5 italic leading-relaxed">
                    This message will be visible to the B2B agent in their Order History invoice page instantly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="w-full py-3 bg-[#F8FAFC] hover:bg-[#F8FAFC] text-[#111827] font-bold rounded-xl text-center cursor-pointer transition-all border border-[#E2E8F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-[#111827] font-black rounded-xl text-center cursor-pointer transition-all border border-transparent shadow-blue-sm"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            ) : (
              <div className="py-12 text-center text-[#64748B] flex flex-col items-center gap-2">
                <AlertCircle size={32} className="text-[#64748B] animate-pulse" />
                <span className="font-black uppercase text-[10px] tracking-wider text-[#64748B]">No active order chosen</span>
                <span className="text-[10px] leading-relaxed max-w-[200px] text-[#64748B] font-medium">
                  Click the "Fulfill" button next to any order in the control queue to update its status or activation key details.
                </span>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#F8FAFC] border border-[#2563EB]/30 rounded-2xl w-full max-w-2xl text-[#111827] overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 border-b border-[#E2E8F0]/80 flex justify-between items-center text-[#111827]">
              <div className="flex items-center gap-2">
                <FileText className="text-[#2563EB]" size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">Invoice Details: {selectedInvoice.id}</span>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-[#64748B] hover:text-[#111827] text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Printable Area */}
            <div className="p-8 bg-[#F8FAFC] space-y-6 text-[#111827] font-sans border border-[#E2E8F0] rounded-b-xl" id="printable-invoice">
              <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#111827] tracking-tight leading-none">GSM GIRI</h3>
                  <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold block mt-1.5">B2B SaaS Agent Platform</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {selectedInvoice.status}
                  </span>
                  <span className="block text-[10px] text-[#64748B] mt-2 font-bold">{selectedInvoice.date} {selectedInvoice.time}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Invoice Billing to:</span>
                  <span className="font-black text-[#111827] block mt-1">{selectedInvoice.client}</span>
                  <span className="text-[#64748B] block mt-0.5">{selectedInvoice.clientContact}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Payment Channel:</span>
                  <span className="font-bold text-[#111827] block mt-1">{selectedInvoice.type}</span>
                  <span className="text-[#64748B] block mt-0.5">Wallet Deduct</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mt-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC]/40 border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase">
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E2E8F0]">
                      <td className="p-3">
                        <span className="font-bold text-[#111827] block">{selectedInvoice.title}</span>
                        <span className="text-[9px] text-[#64748B] block mt-1 uppercase font-semibold">Category: {selectedInvoice.category}</span>
                      </td>
                      <td className="p-3 text-right font-semibold text-[#111827]">{getConvertedPrice(selectedInvoice.priceINR)}</td>
                      <td className="p-3 text-center font-bold text-slate-350">{selectedInvoice.quantity || 1}</td>
                      <td className="p-3 text-right font-black text-[#111827]">{getConvertedPrice(selectedInvoice.totalAmount || (selectedInvoice.priceINR * (selectedInvoice.quantity || 1)))}</td>
                    </tr>
                    <tr className="bg-[#F8FAFC]/20">
                      <td colSpan="3" className="p-3 text-right font-extrabold text-[#64748B] uppercase text-[9px]">Total Amount Paid:</td>
                      <td className="p-3 text-right font-black text-[#2563EB] text-[13px]">{getConvertedPrice(selectedInvoice.totalAmount || (selectedInvoice.priceINR * (selectedInvoice.quantity || 1)))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Fulfilled Key info */}
              {selectedInvoice.activationCode && (
                <div className="bg-amber-500/5 border border-[#2563EB]/25 rounded-xl p-4 space-y-2 text-xs">
                  <span className="block text-[9px] text-[#2563EB] font-bold uppercase tracking-wider">Fulfilled Activation Details / Rental Credentials:</span>
                  <pre className="font-mono text-[#2563EB] bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3 select-all whitespace-pre-wrap leading-relaxed text-[11px] font-bold">
                    {selectedInvoice.activationCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Print/Close Action panel */}
            <div className="bg-white px-6 py-4 border-t border-[#E2E8F0]/80 flex justify-between items-center">
              <button 
                onClick={() => window.print()}
                className="btn-primary px-4 py-2.5 flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="bg-[#F8FAFC] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#E2E8F0] cursor-pointer transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
