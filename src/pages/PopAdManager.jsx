import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Save, CheckCircle, UploadCloud, Link as LinkIcon, Edit3, Type } from 'lucide-react';
import { getPopAdConfig, updatePopAdConfig } from '../utils/api';

export default function PopAdManager() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getPopAdConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load pop ad config", err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updatePopAdConfig(config);
      setSuccessMsg('Pop-Up Ad Configuration Saved Successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert("Error saving config: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-[#64748B] text-xs font-bold uppercase tracking-widest">
        Loading Config...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in max-w-4xl">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Pop-Up Ad Manager
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Control the promotional advertisement shown on the client website homepage
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          
          {/* Active Status Toggle */}
          <div className="flex items-center justify-between bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider">Enable Pop-Up</h3>
              <p className="text-[10px] text-[#64748B] mt-1 font-semibold">If disabled, the pop-up will not show to clients.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={config.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
              
              <div>
                <label className="flex items-center gap-2 text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-2">
                  <Type size={14} className="text-[#2563EB]" />
                  Badge Text
                </label>
                <input
                  type="text"
                  name="badgeText"
                  value={config.badgeText}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="e.g. Special Offer"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-2">
                  <Edit3 size={14} className="text-[#2563EB]" />
                  Main Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={config.title}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="e.g. Welcome to GSMGIRI"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-2">
                  <LinkIcon size={14} className="text-[#2563EB]" />
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={config.buttonText}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="e.g. Explore Services"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-2">
                  <UploadCloud size={14} className="text-[#2563EB]" />
                  Image URL (Leave blank for default)
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={config.imageUrl}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Right Column: Description & Preview */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-2">
                  <Type size={14} className="text-[#2563EB]" />
                  Description Text
                </label>
                <textarea
                  name="description"
                  value={config.description}
                  onChange={handleChange}
                  rows="8"
                  className="input-dark w-full resize-y"
                  placeholder="Enter the main promotional description..."
                  required
                />
              </div>

              {/* Mini Preview Box */}
              <div className="bg-[#111827] rounded-xl border border-[#334155] p-6 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80 pointer-events-none"></div>
                <div className="relative z-10 space-y-3">
                  <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg">
                    {config.badgeText || 'Badge'}
                  </span>
                  <h3 className="text-white text-lg font-black">{config.title || 'Title'}</h3>
                  <div className="max-h-48 overflow-y-auto scrollbar-none">
                    <p className="text-slate-300 text-[10px] leading-relaxed whitespace-pre-wrap text-left">
                      {config.description || 'Description goes here...'}
                    </p>
                  </div>
                  <div className="inline-block px-4 py-2 mt-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-[10px] font-black uppercase tracking-wider rounded-lg opacity-80">
                    {config.buttonText || 'Button'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
            {successMsg ? (
              <span className="text-emerald-500 text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-pulse-primary">
                <CheckCircle size={14} /> {successMsg}
              </span>
            ) : (
              <span className="text-[#64748B] text-[10px] font-semibold">Changes will apply instantly to the client site logic.</span>
            )}

            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-blue-sm flex items-center gap-2 ${saving ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
