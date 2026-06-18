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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">

      {/* Decorative radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ── Login Container ── */}
      <div className="w-full max-w-md glass-card rounded-2xl border border-[#E2E8F0] shadow-2xl p-8 md:p-10 relative z-10 animate-scale-up">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-[#2563EB]/35 shadow-blue-sm bg-[#F8FAFC]">
            <img src="/logo.png" alt="GSM GIRI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#111827] font-black text-2xl tracking-tight">
            GSM<span className="text-[#2563EB]">GIRI</span>
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-[#111827] tracking-tight uppercase">Admin Sign In</h2>
          <p className="text-[#64748B] text-xs mt-1.5 font-bold uppercase tracking-wider">Enter security credentials to continue</p>
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
            <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
              Username
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                required
                disabled={loading}
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg pl-10 pr-4 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB]/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg pl-10 pr-10 py-3 text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB]/20 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-blue-sm hover:scale-[1.01] active:scale-[0.99] mt-6"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
