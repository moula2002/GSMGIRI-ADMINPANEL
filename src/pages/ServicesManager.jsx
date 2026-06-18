import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Save, 
  X,
  Layers,
  Info,
  Upload
} from 'lucide-react';
import { createService, updateService, deleteService, getCategories } from '../utils/api';

export default function ServicesManager({ services, setServices }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('server');
  const [formType, setFormType] = useState('Direct Activation');
  const [formPrice, setFormPrice] = useState(100);
  const [formQuantity, setFormQuantity] = useState(1);
  const [formProcessing, setFormProcessing] = useState('INSTANT');
  const [formDesc, setFormDesc] = useState('');
  const [formThumbType, setFormThumbType] = useState('default');
  const [formStatus, setFormStatus] = useState(true);
  const [formBestSelling, setFormBestSelling] = useState(false);
  const [formRecentlyAdded, setFormRecentlyAdded] = useState(false);
  const [formImage, setFormImage] = useState('');
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Services' },
    { id: 'server', label: 'Server Service' },
    { id: 'remote', label: 'Remote Service / Tool-Rent' },
    { id: 'file', label: 'File Service' },
    { id: 'group', label: 'Service By Group' },
    { id: 'banners', label: 'Banners' },
    { id: 'bestselling', label: 'Best Selling' },
    { id: 'recent', label: 'Recent Added' }
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          const formatted = [
            { id: 'all', label: 'All Services' },
            ...data.map(c => ({ id: c.slug, label: c.name }))
          ];
          setCategories(formatted);
          // Auto-select first category in form if default is not in categories
          if (data.length > 0 && !data.some(c => c.slug === formCategory)) {
            setFormCategory(data[0].slug);
          }
        }
      } catch (err) {
        console.error("Error fetching categories for dropdown", err);
      }
    };
    fetchCategories();
  }, []);

  const thumbTypes = [
    { value: 'rent', label: 'Tool Rent' },
    { value: 'unlocktool', label: 'UnlockTool' },
    { value: 'amt', label: 'Android Multi Tool (AMT)' },
    { value: 'nexapro', label: 'NexaPro' },
    { value: 'gsrealme', label: 'GS Realme' },
    { value: 'galaxy', label: 'Galaxy' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'iremoval', label: 'iRemoval Pro' },
    { value: 'fck', label: 'FCK Tool' },
    { value: 'phoenix', label: 'Phoenix Tool' },
    { value: 'banners', label: 'Banners' },
    { value: 'bestselling', label: 'Best Selling' },
    { value: 'recent', label: 'Recent Added' },
    { value: 'default', label: 'Default Globe' }
  ];

  const handleEditClick = (svc) => {
    setEditId(svc.id);
    setFormTitle(svc.title);
    setFormCategory(svc.category);
    setFormType(svc.type);
    setFormPrice(svc.priceINR);
    setFormQuantity(svc.quantity || 1);
    setFormProcessing(svc.processing);
    setFormDesc(svc.desc || '');
    setFormThumbType(svc.thumbType || 'default');
    setFormStatus(svc.status !== 'Inactive');
    setFormBestSelling(svc.isBestSelling === true);
    setFormRecentlyAdded(svc.isRecentlyAdded === true);
    setFormImage(svc.image || '');
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditId(null);
    setFormTitle('');
    setFormCategory('server');
    setFormType('Direct Activation');
    setFormPrice(100);
    setFormQuantity(1);
    setFormProcessing('INSTANT');
    setFormDesc('');
    setFormThumbType('default');
    setFormStatus(true);
    setFormBestSelling(false);
    setFormRecentlyAdded(false);
    setFormImage('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formTitle,
      category: formCategory,
      type: formType,
      priceINR: Number(formPrice),
      quantity: Number(formQuantity),
      processing: formProcessing,
      desc: formDesc,
      thumbType: formThumbType,
      status: formStatus ? 'Active' : 'Inactive',
      isBestSelling: formBestSelling,
      isRecentlyAdded: formRecentlyAdded,
      image: formImage
    };

    try {
      if (editId) {
        // Edit mode
        await updateService(editId, payload);
        const updated = services.map(svc => {
          if (svc.id === editId) {
            return { ...svc, ...payload };
          }
          return svc;
        });
        setServices(updated);
      } else {
        // Add mode
        const created = await createService(payload);
        setServices([created, ...services]);
      }
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      alert("Error saving service: " + err.message);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this service product from database?")) {
      try {
        await deleteService(id);
        setServices(services.filter(svc => svc.id !== id));
      } catch (err) {
        alert("Error deleting service: " + err.message);
      }
    }
  };

  // Filters
  const filteredServices = services.filter(svc => {
    const matchesSearch = searchQuery === '' ||
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (svc.desc && svc.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      svc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || svc.category === activeTab;
    return matchesSearch && matchesCategory;
  });

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
        <div className={`${defaultClasses} bg-amber-950/20 border-[#2563EB]/35 text-[#2563EB] font-black animate-pulse-gold`}>
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

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Services Database
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Create, edit, and delete tools, software licenses, or activation credits
          </p>
        </div>
        <button 
          onClick={handleAddNewClick}
          className="btn-primary px-4 py-2.5 flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Services List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filters & Search */}
          <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between border border-[#E2E8F0] shadow-lg">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search service title or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-semibold rounded-lg pl-11 pr-4 py-3 text-[#111827] focus:outline-none transition-all duration-200 shadow-inner"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                    activeTab === cat.id
                      ? 'bg-[#2563EB] text-[#111827] border-transparent shadow-blue-sm'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:border-[#E2E8F0]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((svc) => (
              <div 
                key={svc.id}
                className="glass-card rounded-2xl p-4 flex gap-4 border border-[#E2E8F0] hover:border-[#2563EB]/45 transition-all group shadow-md"
              >
                {/* Thumbnail Preview */}
                {getServiceThumbnailPreview(svc.thumbType, svc.image)}

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors truncate" title={svc.title}>
                      {svc.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none">
                        {svc.processing}
                      </span>
                      <span className="bg-[#F8FAFC]/80 border border-[#E2E8F0]/60 text-[#64748B] text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded leading-none">
                        {svc.type}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none border ${
                        svc.status === 'Inactive'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {svc.status || 'Active'}
                      </span>
                      <span className="bg-blue-550/10 border border-blue-500/25 text-blue-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none">
                        Qty: {svc.quantity || 1}
                      </span>
                      {svc.isBestSelling && (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-[#2563EB] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none">
                          Best Seller
                        </span>
                      )}
                      {svc.isRecentlyAdded && (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none">
                          Recent
                        </span>
                      )}
                    </div>
                    {svc.desc && (
                      <p className="text-[10px] text-[#64748B] mt-2 line-clamp-2 leading-relaxed" title={svc.desc}>
                        {svc.desc}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-black text-[#2563EB]">
                      ₹{svc.priceINR.toLocaleString('en-IN')}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditClick(svc)}
                        title="Edit Details"
                        className="p-1.5 bg-[#F8FAFC] hover:bg-[#2563EB] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0] hover:border-transparent rounded transition-all cursor-pointer inline-flex items-center shadow-sm"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(svc.id)}
                        title="Delete Product"
                        className="p-1.5 bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-[#111827] border border-red-500/20 hover:border-transparent rounded transition-all cursor-pointer inline-flex items-center shadow-sm"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredServices.length === 0 && (
              <div className="col-span-2 text-center py-12 glass-card rounded-2xl text-[#64748B] font-bold uppercase tracking-wider shadow-sm">
                No services match search parameters
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form (1 col) */}
        <div>
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
            <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#2563EB]" />
              {editId ? 'Modify Product' : 'Create Product'}
            </h2>

            {showForm ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                
                {/* Product Title */}
                <div>
                  <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                    Service Product Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Android Multi Tool - 2 Hours Rent"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="input-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Category select */}
                  <div>
                    <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2.5 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Thumbnail Badge selection */}
                  <div>
                    <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                      Badge Design
                    </label>
                    <select
                      value={formThumbType}
                      onChange={(e) => setFormThumbType(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2.5 outline-none focus:border-[#2563EB]/70 transition-all cursor-pointer text-[#111827]"
                    >
                      {thumbTypes.map(tb => (
                        <option key={tb.value} value={tb.value}>{tb.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Image Upload */}
                <div>
                  <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                    Custom Service Image (Overrides Badge Design)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      placeholder={formImage ? "Local Selected Image file (Loaded)" : "Select an image file to upload..."}
                      value={formImage ? (formImage.startsWith('data:') ? 'Local Selected Image file (Loaded)' : formImage) : ''}
                      className="input-dark flex-1 cursor-default bg-[#F8FAFC] text-[#64748B]"
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormImage(event.target.result);
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
                      className="px-3 py-2.5 bg-[#F8FAFC] hover:bg-[#2563EB] border border-[#E2E8F0] hover:border-transparent text-[#64748B] hover:text-[#111827] rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Upload size={14} />
                    </button>
                    {formImage && (
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        title="Remove Image"
                        className="px-3 py-2.5 bg-red-950/40 hover:bg-red-500 border border-red-900/35 hover:border-transparent text-red-400 hover:text-[#111827] rounded-lg flex items-center justify-center cursor-pointer transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {formImage && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-[#F8FAFC]/30 rounded-lg border border-[#E2E8F0] w-max">
                      <span className="text-[9px] text-[#64748B] uppercase font-bold">Image Preview:</span>
                      <img src={formImage} alt="Service Preview" className="w-10 h-10 object-cover rounded border border-[#E2E8F0]" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Subtitle / Type */}
                  <div>
                    <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                      Subtype Label
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. License Activation"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="input-dark"
                    />
                  </div>

                  {/* Processing Time */}
                  <div>
                    <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                      Processing Tag
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1-60 MINUTES"
                      value={formProcessing}
                      onChange={(e) => setFormProcessing(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                </div>

                {/* Pricing & Quantity Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                      Net Price (INR / ₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1850"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="1"
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                    Detailed Product Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Enter features, limitations, and requirements..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-semibold rounded-lg p-3 text-slate-250 focus:outline-none transition-all duration-200"
                  ></textarea>
                </div>

                {/* Status Toggle switch */}
                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block">Service Status</span>
                    <span className="text-[9px] text-[#64748B]">Enable or disable this B2B service</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormStatus(!formStatus)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formStatus ? 'bg-[#2563EB]' : 'bg-[#F8FAFC]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#F8FAFC] shadow ring-0 transition duration-200 ease-in-out ${
                        formStatus ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Best Selling Toggle switch */}
                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block">Best Selling</span>
                    <span className="text-[9px] text-[#64748B]">Feature this service in Best Selling list</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormBestSelling(!formBestSelling)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formBestSelling ? 'bg-[#2563EB]' : 'bg-[#F8FAFC]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#F8FAFC] shadow ring-0 transition duration-200 ease-in-out ${
                        formBestSelling ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Recently Added Toggle switch */}
                <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block">Recently Added</span>
                    <span className="text-[9px] text-[#64748B]">Feature this service in Recently Added list</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormRecentlyAdded(!formRecentlyAdded)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formRecentlyAdded ? 'bg-emerald-500' : 'bg-[#F8FAFC]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#F8FAFC] shadow ring-0 transition duration-200 ease-in-out ${
                        formRecentlyAdded ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full py-3 bg-[#F8FAFC] hover:bg-[#F8FAFC] text-[#111827] font-bold rounded-xl text-center cursor-pointer transition-all border border-[#E2E8F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-[#111827] font-black rounded-xl text-center cursor-pointer transition-all border border-transparent flex items-center justify-center gap-1 shadow-blue-sm"
                  >
                    <Save size={14} />
                    <span>Save Service</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="py-12 text-center text-[#64748B] flex flex-col items-center gap-2">
                <Info size={32} className="text-[#64748B]" />
                <span className="font-black uppercase text-[10px] tracking-wider text-[#64748B]">Form Desk Standby</span>
                <span className="text-[10px] leading-relaxed max-w-[200px] text-[#64748B] font-medium">
                  Click the "Add New Service" button at the top header or click the edit icon on any card to update its database details here.
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
