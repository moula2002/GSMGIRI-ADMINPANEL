import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Search, Save, X, Layers, Info, Upload } from 'lucide-react';
import { getImeiProducts, createImeiProduct, updateImeiProduct, deleteImeiProduct } from '../utils/api';

export default function ImeiServiceManager() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState(true);
  const [formImage, setFormImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getImeiProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading IMEI products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (prod) => {
    setEditId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category || '');
    setFormPrice(prod.price);
    setFormDesc(prod.description || '');
    setFormStatus(prod.status !== 'Inactive');
    setFormImage(prod.image || '');
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditId(null);
    setFormName('');
    setFormCategory('');
    setFormPrice(0);
    setFormDesc('');
    setFormStatus(true);
    setFormImage('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      description: formDesc,
      status: formStatus ? 'Active' : 'Inactive',
      image: formImage
    };

    try {
      if (editId) {
        await updateImeiProduct(editId, payload);
        setProducts(products.map(p => p.id === editId ? { ...p, ...payload } : p));
      } else {
        const created = await createImeiProduct(payload);
        setProducts([created, ...products]);
      }
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      alert("Error saving IMEI product: " + err.message);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this IMEI product?")) {
      try {
        await deleteImeiProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    return searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-8 text-slate-100 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gradient-gold">
            IMEI Service Management
          </h1>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1.5">
            Add, edit, or remove IMEI checking and network unlocking services
          </p>
        </div>
        <button 
          onClick={handleAddNewClick}
          className="btn-gold px-4 py-2.5 flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add IMEI Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Products List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters & Search */}
          <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-800 shadow-lg">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search IMEI product name or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg pl-11 pr-4 py-3 text-slate-200 focus:outline-none transition-all duration-200 shadow-inner"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center py-10 text-slate-500 font-bold uppercase tracking-wider">
                Loading products...
              </div>
            ) : filteredProducts.map((svc) => (
              <div 
                key={svc.id}
                className="glass-card rounded-2xl p-4 flex gap-4 border border-slate-850 hover:border-[#d4af37]/45 transition-all group shadow-md"
              >
                {svc.image ? (
                  <img src={svc.image} alt="Product" className="w-12 h-12 object-contain rounded border border-slate-800" />
                ) : (
                  <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-550 border border-slate-850">
                    IMEI
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-[#d4af37] transition-colors truncate" title={svc.name}>
                      {svc.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="bg-slate-800/80 border border-slate-700/60 text-slate-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded leading-none">
                        {svc.category || 'General'}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none border ${
                        svc.status === 'Inactive'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {svc.status || 'Active'}
                      </span>
                    </div>
                    {svc.description && (
                      <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {svc.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-xs font-black text-[#d4af37]">
                      ₹{svc.price.toLocaleString('en-IN')}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditClick(svc)}
                        title="Edit Details"
                        className="p-1.5 bg-slate-900 hover:bg-[#d4af37] text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-transparent rounded transition-all cursor-pointer inline-flex items-center shadow-sm"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(svc.id)}
                        title="Delete Product"
                        className="p-1.5 bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent rounded transition-all cursor-pointer inline-flex items-center shadow-sm"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <div className="col-span-2 text-center py-12 glass-card rounded-2xl text-slate-500 font-bold uppercase tracking-wider shadow-sm">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form Desk */}
        <div>
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
            <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#d4af37]" />
              {editId ? 'Modify IMEI Product' : 'Create IMEI Product'}
            </h2>

            {showForm ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text" required
                    placeholder="e.g. iPhone Worldwide Carrier Unlock"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="input-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apple, Samsung"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                      Price (INR)
                    </label>
                    <input
                      type="number" required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                    Product Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text" readOnly
                      placeholder={formImage ? "Image Loaded" : "Upload file..."}
                      value={formImage ? "Uploaded Image" : ''}
                      className="input-dark flex-1 cursor-default bg-slate-900 text-slate-400"
                    />
                    <input 
                      type="file" ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setFormImage(ev.target.result);
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="hidden" accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 bg-slate-900 hover:bg-[#d4af37] border border-slate-800 hover:border-transparent text-slate-400 hover:text-slate-950 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                    >
                      <Upload size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Enter service details, duration, support models..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg p-3 text-slate-250 focus:outline-none transition-all duration-200"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Status</span>
                    <span className="text-[9px] text-slate-500">Enable or disable this product</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormStatus(!formStatus)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formStatus ? 'bg-[#d4af37]' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        formStatus ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-center cursor-pointer transition-all border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#d4af37] hover:bg-[#c5a059] text-slate-950 font-black rounded-xl text-center cursor-pointer transition-all border border-transparent flex items-center justify-center gap-1 shadow-gold-sm"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-12 text-center text-slate-550 flex flex-col items-center gap-2">
                <Info size={32} className="text-slate-600" />
                <span className="font-black uppercase text-[10px] tracking-wider text-slate-450">Standby</span>
                <span className="text-[10px] leading-relaxed max-w-[200px] text-slate-500 font-medium">
                  Select a product to edit, or click add to create a new one.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
