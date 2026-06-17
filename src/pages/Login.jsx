import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, ShieldAlert, Globe } from 'lucide-react';
import { login } from '../utils/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      setError(err.message || 'Invalid administrator username or security key.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">

      {/* Decorative radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ── Login Container ── */}
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-800 shadow-2xl p-8 md:p-10 relative z-10 animate-scale-up">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-[#d4af37]/35 shadow-gold-sm bg-slate-900">
            <img src="/logo.png" alt="GSM GIRI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-black text-2xl tracking-tight">
            GSM<span className="text-[#d4af37]">GIRI</span>
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-slate-100 tracking-tight uppercase">Admin Sign In</h2>
          <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-wider">Enter security credentials to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <ShieldAlert size={15} className="shrink-0 mt-0.5 text-red-400 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
              Username
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                disabled={loading}
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/70 text-xs font-bold rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#d4af37]/70 text-xs font-bold rounded-lg pl-10 pr-10 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/20 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#d4af37] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#d4af37] hover:bg-[#c5a059] disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-gold-sm hover:scale-[1.01] active:scale-[0.99] mt-6"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                <span>Authenticating…</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Sign in to Console</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
