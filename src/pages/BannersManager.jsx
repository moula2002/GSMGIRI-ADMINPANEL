import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Globe, 
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Upload,
  X
} from 'lucide-react';
import { getBanners, createBanner, deleteBanner } from '../utils/api';

export default function BannersManager() {
  const [banners, setBanners] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBannerType, setNewBannerType] = useState('Carousel Slide');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  
  const fileInputRef = useRef(null);

  // Carousel Preview Index state
  const [previewIndex, setPreviewIndex] = useState(0);

  // Fetch banners on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        console.error("Error loading banners from API", err);
      }
    };
    loadData();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) return;
    try {
      const payload = {
        type: newBannerType,
        title: newBannerTitle,
        image: newBannerImage,
        link: newBannerLink
      };
      const created = await createBanner(payload);
      setBanners([created, ...banners]);
      setNewBannerTitle('');
      setNewBannerImage('');
      setNewBannerLink('');
      setShowAddModal(false);
    } catch (err) {
      alert("Error adding banner: " + err.message);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner asset from database?")) {
      try {
        await deleteBanner(id);
        setBanners(banners.filter(b => b.id !== id));
        setPreviewIndex(0);
      } catch (err) {
        alert("Error deleting banner: " + err.message);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBannerImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const carouselBanners = banners.filter(b => b.type === 'Carousel Slide');
  const gridBanners = banners.filter(b => b.type === 'Highlight Grid Card');

  const handleNextSlide = () => {
    if (carouselBanners.length === 0) return;
    setPreviewIndex((prev) => (prev + 1) % carouselBanners.length);
  };

  const handlePrevSlide = () => {
    if (carouselBanners.length === 0) return;
    setPreviewIndex((prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Frontpage Banners
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Configure homepage carousel sliders and highlight grid banners on gsmsekhar.com
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary px-4.5 py-2.5 flex items-center gap-2 cursor-pointer shadow-blue-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Banner List Section */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#2563EB]" />
              Active Banners Queue
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map(b => (
                <div key={b.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex gap-4 items-center">
                  <div className="w-16 h-16 rounded bg-[#F8FAFC] flex items-center justify-center overflow-hidden shrink-0 border border-[#E2E8F0] shadow-inner">
                    {b.image ? (
                      <img 
                        src={b.image} 
                        alt={b.title} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div 
                      className="w-full h-full bg-[#F8FAFC] flex flex-col justify-center text-center p-0.5 leading-none select-none text-[6px] text-[#64748B] font-black truncate uppercase"
                      style={{ display: b.image ? 'none' : 'flex' }}
                    >
                      {b.image ? (b.image.startsWith('data:') ? 'Uploaded Image' : b.image.split('/').pop()) : 'No Img'}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] bg-amber-500/10 border border-[#2563EB]/20 text-[#2563EB] px-2 py-0.5 rounded uppercase font-black leading-none inline-block mb-1.5 shadow-sm">
                      {b.type}
                    </span>
                    <h4 className="text-[12px] font-black text-[#111827] truncate">{b.title}</h4>
                    <span className="block text-[9px] text-[#64748B] mt-1 truncate">
                      {b.image.startsWith('data:') ? 'Local System Data Base64' : b.image}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteBanner(b.id)}
                    title="Remove Banner"
                    className="p-2 bg-red-50 hover:bg-red-500 border border-red-200 hover:border-transparent text-red-500 hover:text-[#111827] rounded-lg cursor-pointer transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {banners.length === 0 && (
              <div className="text-center py-12 text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                No banners active on home page
              </div>
            )}
          </div>

          {/* Interactive Live Mock Preview Section */}
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <Globe size={16} className="text-[#2563EB]" />
              Homepage Banner Layout Preview (Live Simulation)
            </h3>

            <div className="border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] p-4 space-y-4 shadow-inner">
              <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-black block leading-none">
                SIMULATED WEB BANNER SLOT
              </span>

              {/* 1. Carousel Slider Simulation */}
              <div className="relative w-full h-48 rounded-xl bg-[#F8FAFC] overflow-hidden flex items-center justify-center border border-[#E2E8F0] text-[#111827]">
                {carouselBanners.length > 0 ? (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center flex flex-col justify-end p-6 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"
                      style={{ backgroundImage: `url(${carouselBanners[previewIndex]?.image})` }}
                    >
                      <span className="text-[8px] bg-[#2563EB] text-[#111827] font-black px-2 py-0.5 rounded uppercase w-max mb-1.5 shadow">
                        CAROUSEL BANNER
                      </span>
                      <h4 className="text-sm md:text-base font-extrabold tracking-tight drop-shadow-md">{carouselBanners[previewIndex]?.title}</h4>
                      <p className="text-[9px] text-[#111827] mt-1 font-mono truncate select-all">{carouselBanners[previewIndex]?.image}</p>
                    </div>

                    {/* Navigation Buttons */}
                    <button 
                      onClick={handlePrevSlide}
                      className="absolute left-3 p-1.5 bg-[#F8FAFC]/60 hover:bg-[#2563EB] text-[#111827] hover:text-[#111827] rounded-full border border-[#E2E8F0]/80 transition-all cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={handleNextSlide}
                      className="absolute right-3 p-1.5 bg-[#F8FAFC]/60 hover:bg-[#2563EB] text-[#111827] hover:text-[#111827] rounded-full border border-[#E2E8F0]/80 transition-all cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {carouselBanners.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === previewIndex ? 'bg-[#2563EB] w-3.5' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-[#64748B] font-bold uppercase flex flex-col items-center gap-1.5">
                    <ImageIcon size={28} className="text-slate-650" />
                    <span>No active top carousel slider banners</span>
                  </div>
                )}
              </div>

              {/* 2. Highlights Cards Grid Simulation */}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-black block leading-none mb-3">
                  Highlights Section Grid
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gridBanners.length > 0 ? (
                    gridBanners.map(gb => (
                      <div 
                        key={gb.id} 
                        className="relative h-24 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex flex-col justify-end p-3.5 text-[#111827] bg-cover bg-center"
                        style={{ backgroundImage: `url(${gb.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end">
                          <span className="text-[7px] bg-cyan-500 text-[#111827] font-black px-1.5 py-0.5 rounded uppercase w-max mb-1 shadow ml-3">
                            GRID CARD
                          </span>
                          <h5 className="text-[11px] font-bold tracking-tight drop-shadow ml-3">{gb.title}</h5>
                          {gb.link && (
                            <a href={gb.link} target="_blank" rel="noreferrer" className="text-[8px] text-[#111827] font-semibold flex items-center gap-0.5 hover:text-[#2563EB] ml-3 mt-1">
                              Visit Action <ExternalLink size={8} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-6 text-center border border-dashed border-[#E2E8F0] rounded-lg text-[10px] text-[#64748B] font-bold uppercase">
                      No active highlight card grid banners configured
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Popup Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-up space-y-5 text-[#111827]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} className="text-[#2563EB]" />
                Add Banner Asset
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-[#F8FAFC] rounded-lg text-[#64748B] hover:text-[#111827] transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Banner Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borneo Schematics Promo GIF"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Banner Image / Local System Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    readOnly
                    placeholder="Click image button to choose file..."
                    value={newBannerImage.startsWith('data:') ? 'Local Selected Image file (Loaded)' : newBannerImage}
                    className="input-dark flex-1 cursor-default bg-[#F8FAFC]"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={triggerFileSelect}
                    title="Choose local image"
                    className="px-3 py-2.5 bg-[#F8FAFC] hover:bg-[#F8FAFC] text-[#111827] border border-[#E2E8F0] rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Upload size={14} />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-3 bg-[#F8FAFC] hover:bg-[#F8FAFC] text-slate-750 font-bold rounded-xl text-center cursor-pointer transition-all border border-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#2563EB] hover:bg-blue-700 text-[#111827] font-black rounded-xl text-center cursor-pointer transition-all border border-transparent shadow-blue-sm"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
