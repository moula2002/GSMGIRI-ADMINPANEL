import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Handshake, X, Upload, CheckCircle, AlertCircle, ImageIcon } from 'lucide-react';
import { getClients, createClient, deleteClient } from '../utils/api';

const STYLE_PRESETS = [
  {
    label: 'Apple style (Gradient Pink/Red/Orange)',
    bg: 'bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 border border-red-600/15',
    text: 'text-[#111827]'
  },
  {
    label: 'Hydra style (Dark Obsidian & Gold)',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-[#E2E8F0]',
    text: 'text-[#2563EB]'
  },
  {
    label: 'Huawei style (Plain White & Slate Border)',
    bg: 'bg-white border border-[#E2E8F0]',
    text: 'text-red-600'
  },
  {
    label: 'Falcons style (Indigo Glow & Cyan)',
    bg: 'bg-gradient-to-br from-blue-900 to-indigo-950 border border-[#E2E8F0]',
    text: 'text-cyan-400'
  },
  {
    label: 'iRemoval style (Teal Gradient & White/Gold)',
    bg: 'bg-gradient-to-br from-teal-800 to-emerald-950 border border-[#E2E8F0]',
    text: 'text-[#111827]'
  },
  {
    label: 'Nexus style (Solid Obsidian & Gold)',
    bg: 'bg-black border border-[#E2E8F0]',
    text: 'text-yellow-500'
  },
  {
    label: 'Custom Styling (Manual Input)',
    bg: 'custom',
    text: ''
  }
];

// Compress image to base64 under a max width, returns a promise
function compressImage(file, maxWidth = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/webp', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientSubtitle, setClientSubtitle] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [clientBgColor, setClientBgColor] = useState('bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 border border-red-600/15');
  const [clientTextColor, setClientTextColor] = useState('text-[#111827]');
  const [clientImage, setClientImage] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchClients();
  }, []);

  // Auto-dismiss toast after 3.5s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (type, msg) => setToast({ type, msg });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading B2B clients', err);
      showToast('error', 'Failed to load client cards.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetChange = (index) => {
    const idx = Number(index);
    setSelectedPresetIndex(idx);
    const preset = STYLE_PRESETS[idx];
    if (preset.bg !== 'custom') {
      setClientBgColor(preset.bg);
      setClientTextColor(preset.text);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be under 5MB.' }));
      return;
    }
    setErrors(prev => ({ ...prev, image: '' }));
    try {
      const compressed = await compressImage(file, 400);
      setClientImage(compressed);
      setImageFileName(file.name);
    } catch {
      setErrors(prev => ({ ...prev, image: 'Failed to process image. Try another file.' }));
    }
    // Reset input value so same file can be re-selected if cleared
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setClientName('');
    setClientSubtitle('');
    setSelectedPresetIndex(0);
    setClientBgColor('bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 border border-red-600/15');
    setClientTextColor('text-[#111827]');
    setClientImage('');
    setImageFileName('');
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validate = () => {
    const newErrors = {};
    if (!clientName.trim()) {
      newErrors.name = 'Brand name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Direct click handler — does not rely on form submit association
  const handleCreateCard = async () => {
    if (!validate()) return;
    if (submitting) return;

    setSubmitting(true);
    try {
      const payload = {
        name: clientName.trim(),
        subtitle: clientSubtitle.trim(),
        bgColor: clientBgColor,
        textColor: clientTextColor,
        image: clientImage || ''
      };

      const created = await createClient(payload);
      // Prepend to list immediately
      setClients(prev => [created, ...prev]);
      showToast('success', `"${created.name}" card created successfully!`);
      closeModal();
    } catch (err) {
      console.error('Create client error:', err);
      showToast('error', 'Failed to create card: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete the official seller card for "${name}"?`)) return;
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id && c._id !== id));
      showToast('success', `"${name}" card deleted.`);
    } catch (err) {
      showToast('error', 'Error deleting card: ' + err.message);
    }
  };

  const currentBg = STYLE_PRESETS[selectedPresetIndex]?.bg;

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-fade-in transition-all
            ${toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-700/60 text-emerald-300'
              : 'bg-red-950 border-red-700/60 text-red-300'
            }`}
        >
          {toast.type === 'success'
            ? <CheckCircle size={16} className="shrink-0" />
            : <AlertCircle size={16} className="shrink-0" />
          }
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-current opacity-60 hover:opacity-100 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center gap-2">
            <Handshake className="w-7 h-7 text-[#2563EB]" />
            Clients &amp; Resellers
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Configure dynamic "WE ARE OFFICIAL SELLER" cards and brand logos shown on the B2B portal footer
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-4 py-2.5 flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add Official Seller Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#64748B] font-bold uppercase tracking-wider">
          <span className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin inline-block mr-3" />
          Loading dynamic client cards...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {clients.map((client) => {
            const cardKey = client._id || client.id;
            const cardBg = client.bgColor || 'bg-[#F8FAFC]/40 border border-[#E2E8F0]/50';
            const textClass = client.textColor || 'text-[#111827]';

            return (
              <div
                key={cardKey}
                className={`${cardBg} rounded-2xl p-5 hover:border-[#2563EB]/45 transition-all group shadow-md flex flex-col justify-between items-center text-center relative h-36 min-w-0 select-none`}
              >
                <button
                  onClick={() => handleDelete(client.id || client._id, client.name)}
                  className="absolute top-3 right-3 p-1.5 bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-[#111827] border border-red-500/20 hover:border-transparent rounded-lg transition-all cursor-pointer inline-flex items-center shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                  title={`Remove ${client.name}`}
                >
                  <Trash2 size={12} />
                </button>

                <div className="w-full flex-1 flex flex-col items-center justify-center min-w-0">
                  {client.image ? (
                    <div className="w-full h-14 flex items-center justify-center p-1.5 mb-1">
                      <img
                        src={client.image}
                        alt={client.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-w-0">
                      <span className={`text-base font-black tracking-tight leading-none ${textClass} uppercase truncate max-w-full`}>
                        {client.name}
                      </span>
                      {client.subtitle && (
                        <span className="text-[8px] uppercase tracking-wider opacity-80 font-bold mt-1 text-center line-clamp-1">
                          {client.subtitle}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full border-t border-[#E2E8F0]/40 pt-2 flex justify-between items-center text-[8px] text-[#64748B] uppercase font-black tracking-wider shrink-0 mt-2">
                  <span>Type: {client.image ? 'Logo Image' : 'Styled Card'}</span>
                </div>
              </div>
            );
          })}

          {clients.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#64748B] font-bold uppercase tracking-wider border border-dashed border-[#E2E8F0] rounded-2xl">
              No official seller cards configured. Click 'Add Official Seller Card' to begin.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl max-w-md w-full shadow-2xl flex flex-col"
            style={{ maxHeight: '92vh' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0">
              <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <Handshake className="w-4 h-4 text-[#2563EB]" />
                Add Official Seller Card
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">

              {/* Brand Name */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Client / Reseller Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apple"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`input-dark ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Subtitle <span className="text-[#64748B]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. iTunes Gift Card"
                  value={clientSubtitle}
                  onChange={(e) => setClientSubtitle(e.target.value)}
                  className="input-dark"
                />
              </div>

              {/* Preset Style */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Preset Visual Style
                </label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-semibold rounded-lg px-3 py-2.5 text-[#111827] focus:outline-none transition-all duration-200"
                >
                  {STYLE_PRESETS.map((p, idx) => (
                    <option key={idx} value={idx}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Custom Style Inputs */}
              {currentBg === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-[#64748B] font-black uppercase tracking-wider block mb-1">
                      Background Classes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. bg-blue-600"
                      value={clientBgColor}
                      onChange={(e) => setClientBgColor(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#64748B] font-black uppercase tracking-wider block mb-1">
                      Text Classes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. text-[#111827]"
                      value={clientTextColor}
                      onChange={(e) => setClientTextColor(e.target.value)}
                      className="input-dark"
                    />
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
                  Brand Logo Image <span className="text-[#64748B]">(Optional — overrides text layout)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  id="client-logo-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="client-logo-upload"
                  className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-[#2563EB]/10 border border-[#E2E8F0] hover:border-[#2563EB]/50 text-[#64748B] hover:text-[#111827] font-bold uppercase tracking-wider text-[10px] rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload size={14} />
                  <span>{imageFileName ? imageFileName : 'Choose Brand Logo'}</span>
                </label>
                {errors.image && (
                  <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.image}
                  </p>
                )}
                {clientImage && (
                  <button
                    type="button"
                    onClick={() => { setClientImage(''); setImageFileName(''); }}
                    className="mt-1.5 text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 cursor-pointer"
                  >
                    <X size={10} /> Clear Image
                  </button>
                )}
              </div>

              {/* Live Preview */}
              {(clientImage || clientName) && (
                <div className="flex flex-col gap-2 p-3 bg-[#F8FAFC]/60 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] uppercase font-black tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={10} /> Visual Live Preview
                  </span>
                  <div className="w-full h-24 bg-[#F8FAFC] rounded-lg flex items-center justify-center p-3 border border-[#E2E8F0] overflow-hidden">
                    {clientImage ? (
                      <img
                        src={clientImage}
                        alt="Brand preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className={`${currentBg !== 'custom' ? clientBgColor : 'bg-[#F8FAFC]'} rounded-xl p-3 flex flex-col justify-center items-center h-16 w-36 text-center select-none shadow-sm`}>
                        <span className={`text-xs font-black tracking-tight leading-none ${currentBg !== 'custom' ? clientTextColor : 'text-[#111827]'} uppercase`}>
                          {clientName || 'Brand'}
                        </span>
                        {clientSubtitle && (
                          <span className="text-[7px] uppercase tracking-wider opacity-85 font-black mt-1 block">
                            {clientSubtitle}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer — always visible */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-2xl shrink-0">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCard}
                disabled={submitting}
                className="btn-primary px-5 py-2.5 shadow-blue-md disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 min-w-[110px] justify-center"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#E2E8F0] border-t-transparent rounded-full animate-spin inline-block" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={13} />
                    Create Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
