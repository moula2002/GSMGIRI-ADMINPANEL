import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Minus, 
  Image as ImageIcon, 
  Edit3, 
  Upload, 
  X,
  HelpCircle,
  Save
} from 'lucide-react';
import { getPromoColumns, updatePromoColumn, updateService } from '../utils/api';

export default function PromoColumnsManager({ services, setServices }) {
  const [promoColumns, setPromoColumns] = useState([]);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  
  // Header editing modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBanner, setEditBanner] = useState('');
  const fileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  // Load promo columns config on mount
  useEffect(() => {
    const loadPromoColumns = async () => {
      try {
        const data = await getPromoColumns();
        setPromoColumns(data);
      } catch (err) {
        console.error("Error loading promo columns config", err);
      }
    };
    loadPromoColumns();
  }, []);

  const handleEditHeaderClick = (col) => {
    setEditTitle(col.title);
    setEditBanner(col.banner || '');
    setShowEditModal(true);
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    const activeCol = promoColumns.find(c => c.columnIndex === activeColumnIndex);
    if (!activeCol) return;

    try {
      const payload = {
        title: editTitle,
        banner: editBanner
      };
      const updated = await updatePromoColumn(activeColumnIndex, payload);
      setPromoColumns(promoColumns.map(c => c.columnIndex === activeColumnIndex ? { ...c, ...payload } : c));
      setShowEditModal(false);
    } catch (err) {
      alert("Error saving column header: " + err.message);
    }
  };

  const handleTogglePromo = async (svc, isAdding) => {
    const updatedSvc = {
      ...svc,
      section: isAdding ? 'promo' : 'services',
      promoColumnIndex: isAdding ? activeColumnIndex : null
    };

    try {
      await updateService(svc.id, updatedSvc);
      setServices(services.map(s => s.id === svc.id ? updatedSvc : s));
    } catch (err) {
      alert(`Error updating service promo status: ${err.message}`);
    }
  };

  const getServiceThumbnailPreview = (thumb, image) => {
    if (image) {
      return (
        <img 
          src={image} 
          alt="Thumbnail" 
          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-800 shadow-sm transition-transform group-hover:scale-105" 
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
        <div className={`${defaultClasses} bg-slate-900 border-slate-800 text-[#d4af37] font-bold`}>
          <span>NEXA</span><span className="text-[8px] font-black text-slate-300 mt-0.5">PRO</span>
        </div>
      );
    }
    if (thumb === 'gsrealme') {
      return (
        <div className={`${defaultClasses} bg-yellow-950/20 border-yellow-500/35 text-yellow-400 font-bold`}>
          <span>GS</span><span className="text-[7px] text-slate-300 mt-0.5">REALME</span>
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
    return (
      <div className={`${defaultClasses} bg-slate-900 border-slate-800 text-slate-500`}>
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

  // Filter lists
  const activePromoServices = services.filter(
    s => s.section === 'promo' && s.promoColumnIndex === activeColumnIndex
  );

  const otherServices = services.filter(
    s => !(s.section === 'promo' && s.promoColumnIndex === activeColumnIndex)
  );

  const filteredPromoted = activePromoServices.filter(svc => {
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

  const activeColData = promoColumns.find(c => c.columnIndex === activeColumnIndex) || {
    title: "Loading...",
    banner: ""
  };

  return (
    <div className="space-y-8 text-slate-100 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gradient-gold flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#d4af37]" />
            Promoted Columns
          </h1>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1.5">
            Configure dynamic titles, header banners, and services for the 3 homepage columns below the main banner
          </p>
        </div>
      </div>

      {/* 3-Column Select Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[0, 1, 2].map((idx) => {
          const col = promoColumns.find(c => c.columnIndex === idx) || {
            title: `Column ${idx + 1}`,
            banner: ''
          };
          const count = services.filter(s => s.section === 'promo' && s.promoColumnIndex === idx).length;
          const isActive = activeColumnIndex === idx;

          return (
            <div 
              key={idx}
              onClick={() => setActiveColumnIndex(idx)}
              className={`glass-card rounded-2xl overflow-hidden cursor-pointer transition-all border shadow-md flex flex-col justify-between ${
                isActive 
                  ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37]/5 to-transparent scale-[1.02]' 
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/30'
              }`}
            >
              {/* Header Image Preview */}
              <div className="h-20 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-850">
                {col.banner ? (
                  <img src={col.banner} alt={col.title} className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="text-slate-600 flex flex-col items-center justify-center text-[10px] font-bold uppercase gap-1">
                    <ImageIcon size={20} />
                    <span>No Banner Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/20"></div>
                <span className="absolute top-2 left-2 text-[8px] bg-slate-900/80 border border-slate-700 text-slate-300 font-extrabold tracking-wider px-2 py-0.5 rounded uppercase leading-none">
                  Column {idx + 1}
                </span>
                <span className="absolute top-2 right-2 text-[8px] bg-[#d4af37] text-slate-950 font-black px-2 py-0.5 rounded leading-none">
                  {count} {count === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Title & Actions */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                <p className="text-[10px] font-black text-slate-200 line-clamp-2 uppercase tracking-wide leading-tight min-h-[28px]" title={col.title}>
                  {col.title}
                </p>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColumnIndex(idx);
                    handleEditHeaderClick(col);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-[#d4af37] text-slate-400 hover:text-slate-950 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all border border-slate-800 hover:border-transparent flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit3 size={10} />
                  <span>Configure Header</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split pane for Service Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Promoted in active Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between border border-slate-850 shadow-md">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} className="text-[#d4af37]" />
              Promoted in Column {activeColumnIndex + 1} ({filteredPromoted.length})
            </h3>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search promoted..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/70 text-[11px] font-semibold rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPromoted.map((svc) => (
              <div 
                key={svc.id}
                className="glass-card rounded-2xl p-4 flex gap-4 border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all group shadow-md bg-gradient-to-br from-[#d4af37]/2 to-transparent"
              >
                {getServiceThumbnailPreview(svc.thumbType || 'default', svc.image)}
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-xs font-black text-slate-200 group-hover:text-[#d4af37] transition-colors truncate" title={svc.title}>
                      {svc.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="bg-slate-800 border border-slate-750 text-slate-400 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded leading-none">
                        {svc.category}
                      </span>
                      <span className="bg-slate-800/80 border border-slate-750 text-slate-400 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded leading-none">
                        {svc.type}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                    <span className="text-xs font-black text-[#d4af37]">
                      ₹{(svc.priceINR || 0).toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => handleTogglePromo(svc, false)}
                      className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-550 border border-red-900/35 hover:border-transparent text-red-400 hover:text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Remove from Column"
                    >
                      <Minus size={10} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPromoted.length === 0 && (
              <div className="col-span-2 text-center py-12 glass-card rounded-2xl text-slate-500 font-bold uppercase tracking-wider border border-slate-850">
                No promoted services in this column.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Available services to assign */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl shadow-lg border border-slate-850 space-y-4">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-900/80 pb-3 flex items-center gap-2">
              <Plus size={15} className="text-[#d4af37]" />
              Promote Services
            </h3>

            {/* Sub-Filters */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none pb-2 border-b border-slate-900/60">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilterTab(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                    activeFilterTab === cat.id
                      ? 'bg-[#d4af37] text-slate-950 border-transparent font-black shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
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
                  className="p-3 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-750 rounded-xl transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getServiceThumbnailPreview(svc.thumbType || 'default', svc.image)}
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold text-slate-200 truncate group-hover:text-[#d4af37] transition-colors" title={svc.title}>
                        {svc.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-semibold text-slate-500 uppercase">{svc.category}</span>
                        <span className="text-[8px] font-bold text-[#d4af37]">₹{(svc.priceINR || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePromo(svc, true)}
                    className="p-1.5 bg-slate-900 hover:bg-[#d4af37] text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-transparent rounded-lg transition-all cursor-pointer"
                    title={`Add to Column ${activeColumnIndex + 1}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}

              {filteredOthers.length === 0 && (
                <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  No other services available
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Edit Header Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-[#d4af37]/35 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-up space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Edit3 size={16} className="text-[#d4af37]" />
                Configure Column {activeColumnIndex + 1} Header
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                  Column Header Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UNLOCK TOOLS RENT"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/75 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                  Column Banner Image (Base64 file upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    placeholder={editBanner ? "Local Selected Image (Loaded)" : "Select an image file to upload..."}
                    value={editBanner ? (editBanner.startsWith('data:') ? 'Local Selected Image file (Loaded)' : editBanner) : ''}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-400 cursor-default focus:outline-none flex-1"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditBanner(event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Choose local image"
                    className="px-3.5 py-2.5 bg-slate-900 hover:bg-[#d4af37] border border-slate-800 hover:border-transparent text-slate-400 hover:text-slate-950 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Upload size={14} />
                  </button>
                  {editBanner && (
                    <button
                      type="button"
                      onClick={() => setEditBanner('')}
                      title="Clear Banner"
                      className="px-3.5 py-2.5 bg-red-955/20 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white rounded-lg flex items-center justify-center cursor-pointer transition-all"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {editBanner && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-950/40 rounded-lg border border-slate-900 w-max">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Preview:</span>
                    <img src={editBanner} alt="Column Preview" className="w-14 h-8 object-cover rounded border border-slate-900" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-3 bg-slate-900 hover:bg-slate-850 text-slate-350 font-bold rounded-xl text-center cursor-pointer transition-all border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#d4af37] hover:bg-[#c5a059] text-slate-950 font-black rounded-xl text-center cursor-pointer transition-all border border-transparent flex items-center justify-center gap-1 shadow-gold-sm"
                >
                  <Save size={14} />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
