import React, { useState, useEffect } from 'react';
import { 
   MessageSquare, 
   Clock, 
   CheckCircle, 
   AlertCircle, 
   Search, 
   Send,
   User,
   AlertTriangle
} from 'lucide-react';
import { getInquiries, replyToInquiry, updateInquiryStatus } from '../utils/api';

export default function InquiriesManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [tickets, setTickets] = useState([]);

  // Fetch support tickets from backend API
  const fetchTickets = async () => {
    try {
      const data = await getInquiries();
      setTickets(data);
      if (selectedTicket) {
        const refreshed = data.find(t => t.id === selectedTicket.id);
        if (refreshed) {
          setSelectedTicket(refreshed);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const updated = await replyToInquiry(selectedTicket.id, replyText.trim());
      setSelectedTicket(updated);
      setReplyText('');
      fetchTickets();
    } catch (err) {
      alert('Failed to post reply: ' + err.message);
    }
  };

  const handleCloseTicket = async (id) => {
    try {
      const updated = await updateInquiryStatus(id, 'Closed');
      if (selectedTicket?.id === id) {
        setSelectedTicket(updated);
      }
      fetchTickets();
    } catch (err) {
      alert('Failed to close ticket: ' + err.message);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = searchQuery === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Support & Inquiry Tickets
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Resolve agent remote activation disputes, credential resets, and payment inquiries
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tickets Queue List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4 rounded-xl border border-[#E2E8F0] shadow-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold rounded-lg pl-9 pr-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#2563EB]/70 transition-all"
              />
            </div>
            
            <div className="flex gap-1.5 mt-3">
              {['all', 'Open', 'Replied', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#2563EB] text-[#111827] border-transparent shadow-blue-sm'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`glass-card p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  selectedTicket?.id === t.id
                    ? 'border-[#2563EB]/60 bg-[#2563EB]/5 shadow-blue-sm'
                    : 'border-[#E2E8F0] hover:border-[#E2E8F0]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] text-[#2563EB] font-black">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    t.status === 'Open'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : t.status === 'Replied'
                      ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20'
                      : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-[#111827] mt-2 truncate">{t.subject}</h4>
                <p className="text-[10px] text-[#64748B] mt-1.5 line-clamp-1">{t.desc}</p>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#E2E8F0] text-[9px] text-[#64748B] font-semibold uppercase">
                  <span>{t.client}</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                No support tickets found
              </div>
            )}
          </div>
        </div>

        {/* Selected Ticket Conversation Desk */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="glass-card rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden flex flex-col h-[600px]">
              
              {/* Desk Header */}
              <div className="p-4 bg-[#F8FAFC]/60 border-b border-[#E2E8F0] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shadow-sm">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-[#111827] uppercase">{selectedTicket.subject}</h3>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        selectedTicket.priority === 'High' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {selectedTicket.priority} Priority
                      </span>
                    </div>
                    <span className="text-[9px] text-[#64748B] block mt-1 font-bold">
                      Agent: {selectedTicket.client} ({selectedTicket.clientContact}) • Service: {selectedTicket.service}
                    </span>
                  </div>
                </div>
                {selectedTicket.status !== 'Closed' && (
                  <button
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-[#111827] rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm"
                  >
                    Close Ticket
                  </button>
                )}
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]/20">
                {selectedTicket.replies.map((rep, idx) => {
                  const isAdmin = rep.sender === 'admin';
                  return (
                    <div key={idx} className={`flex gap-3 max-w-[85%] ${isAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                        isAdmin ? 'bg-[#F8FAFC] border-[#2563EB]/35 text-[#2563EB]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#111827]'
                      }`}>
                        <User size={13} />
                      </div>
                      <div className={`p-3 rounded-2xl text-xs space-y-1 ${
                        isAdmin 
                          ? 'bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#111827] rounded-tr-none' 
                          : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] rounded-tl-none'
                      }`}>
                        <span className="block text-[9px] font-bold text-[#64748B] uppercase">
                          {isAdmin ? 'SYSTEM ADMIN' : selectedTicket.client}
                        </span>
                        <p className="leading-relaxed whitespace-pre-wrap">{rep.text}</p>
                        <span className="block text-[8px] text-[#64748B] text-right font-medium">{rep.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Desk */}
              {selectedTicket.status !== 'Closed' ? (
                <form onSubmit={handleReplySubmit} className="p-4 bg-[#F8FAFC]/60 border-t border-[#E2E8F0] flex gap-3.5 items-end">
                  <div className="flex-grow">
                    <textarea
                      rows="3"
                      placeholder="Type response credentials, instructions, or resolution notes..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-semibold rounded-lg p-3 text-[#111827] focus:outline-none transition-all"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="p-3 bg-[#2563EB] hover:bg-blue-700 text-[#111827] rounded-xl cursor-pointer transition-all flex items-center justify-center shadow-blue-sm shrink-0"
                  >
                    <Send size={15} />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <span>This ticket is marked resolved and closed</span>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-[#E2E8F0] shadow-md h-[600px] flex flex-col items-center justify-center text-center text-[#64748B] gap-2">
              <AlertTriangle size={32} className="text-[#64748B] animate-bounce" />
              <span className="font-black uppercase text-[10px] tracking-wider text-[#64748B]">Support Desk Inactive</span>
              <p className="text-[10px] leading-relaxed max-w-[240px] text-[#64748B] font-medium mt-1">
                Select a support ticket from the active list queue on the left side to see dialogue logs, credentials, and respond.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
