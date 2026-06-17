import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  Save, 
  Info, 
  HelpCircle,
  Database,
  Globe
} from 'lucide-react';
import { getSettings, updateSettings } from '../utils/api';

export default function Settings({ onResetDatabase }) {
  const [tickerMessage, setTickerMessage] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSettings();
        setTickerMessage(settings.ticker || "📢 All B2B Rent Tools / License Activations / Credits Pack Available. Instant Wallet Funding via Cards & Crypto is active. Contact B2B WhatsApp +91 824-700-5409!");
        setExchangeRate(settings.rate || "83");
        setSupportWhatsapp(settings.whatsapp || "+91 824-700-5409");
      } catch (err) {
        console.error("Error loading configurations from API", err);
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({
        ticker: tickerMessage,
        rate: exchangeRate,
        whatsapp: supportWhatsapp
      });
      alert("System configurations updated successfully! Settings are persisted in database.");
    } catch (err) {
      alert("Error saving settings: " + err.message);
    }
  };


  const handleResetClick = async () => {
    if (window.confirm("WARNING: This will reset all services, orders, and wallet balance to initial seeds. All custom data will be cleared. Proceed?")) {
      try {
        await onResetDatabase();
        setTickerMessage("📢 All B2B Rent Tools / License Activations / Credits Pack Available. Instant Wallet Funding via Cards & Crypto is active. Contact B2B WhatsApp +91 824-700-5409!");
        setExchangeRate("83");
        setSupportWhatsapp("+91 824-700-5409");
      } catch (err) {
        alert("Error resetting database: " + err.message);
      }
    }
  };

  return (
    <div className="space-y-8 text-slate-100 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gradient-gold">
            System Settings
          </h1>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1.5">
            Configure global website rates, notices, and database states
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Config Panel (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-lg border border-slate-800 space-y-6">
          <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
            <Sliders size={16} className="text-[#d4af37]" />
            Global Site Settings
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            
            {/* Ticker Notice Marquee */}
            <div>
              <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">
                Header Marquee Notice Ticker Message
              </label>
              <textarea
                rows="3"
                value={tickerMessage}
                onChange={(e) => setTickerMessage(e.target.value)}
                placeholder="Enter alert notice or promo messages to crawl on top header notice..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg p-3.5 text-slate-200 focus:outline-none transition-all duration-200"
              ></textarea>
              <p className="text-[9px] text-slate-500 mt-1.5 italic">
                Crawls on top header marquee of the website index landing page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Currency Multiplier */}
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">
                  Exchange Rate Conversion Multiplier (1 USD = ? INR)
                </label>
                <input
                  type="number"
                  required
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="e.g. 83"
                  className="input-dark"
                />
                <p className="text-[9px] text-slate-500 mt-1.5 italic">
                  Used in conversion formulas for agents browsing in USD ($).
                </p>
              </div>

              {/* Whatsapp Info */}
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">
                  Technical Support Helpdesk WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={supportWhatsapp}
                  onChange={(e) => setSupportWhatsapp(e.target.value)}
                  placeholder="e.g. +91 824-700-5409"
                  className="input-dark"
                />
                <p className="text-[9px] text-slate-500 mt-1.5 italic">
                  Default phone redirect link on website support badges.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-900 flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 bg-[#d4af37] hover:bg-[#c5a059] text-slate-950 font-black rounded-xl text-center cursor-pointer transition-all border border-transparent flex items-center justify-center gap-1.5 shadow-gold-sm"
              >
                <Save size={14} />
                <span>Save Configs</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Database state manager (1 col) */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
            <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
              <Database size={16} className="text-[#d4af37]" />
              Database Operations
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Clear current session parameters or restore database logs to their clean starting values.
            </p>

            <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl flex items-start gap-2.5 text-[10px] text-slate-400 font-semibold leading-relaxed">
              <Info size={16} className="text-[#d4af37] shrink-0" />
              <div>
                <span className="text-slate-200 font-black block mb-0.5">LOCAL PERSISTENCE LAYER</span>
                All system changes reflect locally in your database database file instantly.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900">
              <button
                onClick={handleResetClick}
                className="w-full py-3 bg-red-950/20 hover:bg-red-500 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white font-black rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw size={14} />
                <span>Reset Database to Seeds</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
