import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Minus, 
  TrendingUp, 
  Tag, 
  AlertCircle,
  HelpCircle,
  IndianRupee,
  Layers
} from 'lucide-react';
import { updateService } from '../utils/api';

export default function BestSellingManager({ services, setServices }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  // Filter services into Best Sellers vs others
  const bestSellers = services.filter(svc => svc.isBestSelling === true || svc.category === 'bestselling');
  
  const otherServices = services.filter(svc => !(svc.isBestSelling === true || svc.category === 'bestselling'));

  // Search filter
  const filteredBestSellers = bestSellers.filter(svc => {
    const term = searchQuery.toLowerCase();
    return svc.title.toLowerCase().includes(term) || (svc.desc && svc.desc.toLowerCase().includes(term));
  });

  const filteredOthers = otherServices.filter(svc => {
    const matchesSearch = searchQuery === '' || 
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (svc.desc && svc.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeFilterTab === 'all' || svc.category === activeFilterTab;
    return matchesSearch && matchesTab;
  });

  // Toggle handlers
  const handleToggleBestSelling = async (svc, flag) => {
    const updatedSvc = { ...svc, isBestSelling: flag };
    try {
      await updateService(svc.id, updatedSvc);
      setServices(services.map(s => s.id === svc.id ? updatedSvc : s));
    } catch (err) {
      alert(`Error updating best seller status: ${err.message}`);
    }
  };

  // Stats calculations
  const totalBestSellers = bestSellers.length;
  const activeBestSellers = bestSellers.filter(s => s.status === 'Active').length;
  const avgPrice = totalBestSellers > 0 
    ? Math.round(bestSellers.reduce((sum, s) => sum + (s.priceINR || 0), 0) / totalBestSellers)
    : 0;

  const getServiceThumbnailPreview = (thumb, image) => {
    if (image) {
      return (
        <img 
          src={image} 
          alt="Thumbnail" 
          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#E2E8F0] shadow-sm transition-transform group-hover:scale-105" 
        />
      );
    }
    const defaultClasses = "w-10 h-10 rounded-lg flex flex-col items-center justify-center text-center text-[5px] shrink-0 border uppercase font-sans p-0.5 leading-none shadow-sm transition-transform group-hover:scale-105";
    if (thumb === 'rent') {
      return (
        <div className={`${defaultClasses} bg-cyan-950/20 border-cyan-500/35 text-cyan-400 font-extrabold`}>
          <span>TOOL</span><span className="text-[8px] font-black text-rose-400 mt-0.5 animate-pulse">RENT</span>
        </div>
      );
    }
    if (thumb === 'unlocktool') {
      return (
        <div className={`${defaultClasses} bg-amber-950/20 border-amber-500/35 text-amber-400`}>
          <span className="text-[6px] text-amber-300 font-bold">UT</span>
          <span className="text-[7px] font-black">LICENSE</span>
        </div>
      );
    }
    if (thumb === 'amt') {
      return (
        <div className={`${defaultClasses} bg-indigo-950/20 border-indigo-500/35 text-indigo-400`}>
          <span>AMT</span><span className="text-[7px] text-yellow-400 font-black mt-0.5">TOOL</span>
        </div>
      );
    }
    if (thumb === 'nexapro') {
      return (
        <div className={`${defaultClasses} bg-[#F8FAFC] border-[#E2E8F0] text-[#2563EB] font-bold`}>
          <span>NEXA</span><span className="text-[8px] font-black text-[#111827] mt-0.5">PRO</span>
        </div>
      );
    }
    if (thumb === 'gsrealme') {
      return (
        <div className={`${defaultClasses} bg-yellow-950/20 border-yellow-500/35 text-yellow-400 font-bold`}>
          <span>GS</span><span className="text-[7px] text-[#111827] mt-0.5">REALME</span>
        </div>
      );
    }
    if (thumb === 'galaxy') {
      return (
        <div className={`${defaultClasses} bg-blue-950/20 border-blue-500/35 text-blue-400 font-bold`}>
          <span>GALAXY</span><span className="text-[6px] text-slate-350 mt-0.5">TOOL</span>
        </div>
      );
    }
    if (thumb === 'samsung') {
      return (
        <div className={`${defaultClasses} bg-sky-950/20 border-sky-500/35 text-sky-400 font-bold`}>
          <span>SAMSUNG</span><span className="text-[7px] text-slate-350 mt-0.5">FRP</span>
        </div>
      );
    }
    if (thumb === 'iremoval') {
      return (
        <div className={`${defaultClasses} bg-rose-950/20 border-rose-500/35 text-rose-450 font-bold`}>
          <span>IREMOVAL</span><span className="text-[6px] text-slate-350 mt-0.5">BYPASS</span>
        </div>
      );
    }
    if (thumb === 'fck') {
      return (
        <div className={`${defaultClasses} bg-amber-950/20 border-amber-500/35 text-amber-400 font-bold`}>
          <span>FCK</span><span className="text-[7px] text-slate-350 mt-0.5">TOOL</span>
        </div>
      );
    }
    if (thumb === 'phoenix') {
      return (
        <div className={`${defaultClasses} bg-orange-950/20 border-orange-500/35 text-orange-400 font-bold`}>
          <span>PHOENIX</span><span className="text-[7px] text-slate-350 mt-0.5">TOOL</span>
        </div>
      );
    }
    if (thumb === 'banners') {
      return (
        <div className={`${defaultClasses} bg-purple-950/20 border-purple-500/35 text-purple-400 font-bold`}>
          <span>BANNER</span><span className="text-[7px] text-[#111827] mt-0.5 font-bold">ASSET</span>
        </div>
      );
    }
    if (thumb === 'bestselling') {
      return (
        <div className={`${defaultClasses} bg-amber-950/20 border-[#2563EB]/35 text-[#2563EB] font-black animate-pulse`}>
          <span>BEST</span><span className="text-[7px] text-amber-500 font-extrabold mt-0.5">SELLER</span>
        </div>
      );
    }
    if (thumb === 'recent') {
      return (
        <div className={`${defaultClasses} bg-emerald-950/20 border-emerald-500/35 text-emerald-400 font-extrabold`}>
          <span>NEW</span><span className="text-[7px] text-slate-350 mt-0.5">ADDED</span>
        </div>
      );
    }
    return (
      <div className={`${defaultClasses} bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]`}>
        <span>SVC</span>
      </div>
    );
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'server', label: 'Server Service' },
    { id: 'remote', label: 'Remote / Tool-Rent' },
    { id: 'file', label: 'File Service' },
    { id: 'group', label: 'Service By Group' },
  ];

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#2563EB] animate-pulse" />
            Best Selling Shelf
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Configure popular tools, high-demand licenses, and trending activation packages
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Best Sellers */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[primary] shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center border border-[#2563EB]/20">
              <Sparkles size={16} className="text-[#2563EB]" />
            </div>
            <span className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">
              Total Best Sellers
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-[#111827]">
            {totalBestSellers}
          </span>
          <span className="text-[9px] text-[#64748B] font-semibold mt-1 block">
            Featured products on client homepage
          </span>
        </div>

        {/* Active Best Sellers */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <span className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">
              Active Best Sellers
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-[#111827]">
            {activeBestSellers}
          </span>
          <span className="text-[9px] text-emerald-500 font-semibold mt-1 block">
            Currently active for ordering
          </span>
        </div>

        {/* Avg Best Seller Price */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-cyan-500 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <IndianRupee size={16} className="text-cyan-400" />
            </div>
            <span className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">
              Average Price
            </span>
          </div>
          <span className="text-2xl font-black block tracking-tight text-[#111827]">
            ₹{avgPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] text-[#64748B] font-semibold mt-1 block">
            Based on current featured list
          </span>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Pane: Current Best Sellers (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header & Search */}
          <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between border border-[#E2E8F0] shadow-md">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-[#2563EB]" />
              Currently Featured Best Sellers ({filteredBestSellers.length})
            </h3>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search best sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-[11px] font-semibold rounded-lg pl-9 pr-3 py-2 text-[#111827] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBestSellers.map((svc) => (
              <div 
                key={svc.id}
                className="glass-card rounded-2xl p-4 flex gap-4 border border-[#2563EB]/25 hover:border-[#2563EB]/60 transition-all group shadow-md bg-gradient-to-br from-[primary]/2 to-transparent"
              >
                {getServiceThumbnailPreview(svc.thumbType || 'default', svc.image)}
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-black text-[#111827] group-hover:text-[#2563EB] transition-colors truncate" title={svc.title}>
                        {svc.title}
                      </h4>
                      <span className="shrink-0 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5 animate-pulse">
                        <Sparkles size={8} /> BEST
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded leading-none">
                        {svc.category}
                      </span>
                      <span className="bg-[#F8FAFC]/80 border border-[#E2E8F0] text-[#64748B] text-[8px] font-bold uppercase px-1.5 py-0.5 rounded leading-none">
                        {svc.type}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded leading-none border ${
                        svc.status === 'Inactive'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {svc.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-between">
                    <span className="text-xs font-black text-[#2563EB]">
                      ₹{(svc.priceINR || 0).toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => handleToggleBestSelling(svc, false)}
                      className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-550 border border-red-900/35 hover:border-transparent text-red-400 hover:text-[#111827] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Remove from Best Sellers"
                    >
                      <Minus size={10} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredBestSellers.length === 0 && (
              <div className="col-span-2 text-center py-12 glass-card rounded-2xl text-[#64748B] font-bold uppercase tracking-wider border border-[#E2E8F0]">
                No featured best selling items found.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Add Services to Best Selling (1 col) */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0]/80 pb-3 flex items-center gap-2">
              <Plus size={15} className="text-[#2563EB]" />
              Add More Services
            </h3>

            {/* Sub-Filters */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none pb-2 border-b border-[#E2E8F0]/60">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilterTab(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                    activeFilterTab === cat.id
                      ? 'bg-[#2563EB] text-[#111827] border-transparent font-black shadow-sm'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:border-[#E2E8F0]'
                  }`}
                >
                  {cat.label.replace(' Service', '')}
                </button>
              ))}
            </div>

            {/* List of other available services */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredOthers.map((svc) => (
                <div 
                  key={svc.id}
                  className="p-3 bg-[#F8FAFC]/40 hover:bg-[#F8FAFC]/70 border border-[#E2E8F0] hover:border-[#E2E8F0] rounded-xl transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getServiceThumbnailPreview(svc.thumbType || 'default', svc.image)}
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold text-[#111827] truncate group-hover:text-[#2563EB] transition-colors" title={svc.title}>
                        {svc.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-semibold text-[#64748B] uppercase">{svc.category}</span>
                        <span className="text-[8px] font-bold text-[#2563EB]">₹{(svc.priceINR || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleBestSelling(svc, true)}
                    className="p-1.5 bg-[#F8FAFC] hover:bg-[#2563EB] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0] hover:border-transparent rounded-lg transition-all cursor-pointer"
                    title="Feature as Best Selling"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}

              {filteredOthers.length === 0 && (
                <div className="text-center py-8 text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  No other services available
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
