import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Crown,
  Activity,
  Calendar,
  KeyRound
} from 'lucide-react';
import { getProfile, updateProfile, changePassword } from '../utils/api';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('info');

  // Profile info state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // { type: 'success'|'error', text }

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  // Load profile from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setRole(data.role || 'Super Administrator');
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateProfile({ name, email, phone });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(currentPw, newPw);
      setPwMsg({ type: 'success', text: 'Password changed successfully! Please log out and log back in to confirm.' });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message });
    } finally {
      setPwSaving(false);
    }
  };

  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mr-3"></span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#111827] animate-fade-in">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Admin Profile
          </h1>
          <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider mt-1.5">
            Manage administrator credentials and account details
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Active Session</span>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="relative glass-card rounded-2xl border border-[#E2E8F0] shadow-md overflow-hidden">
        {/* Gold header strip */}
        <div className="h-20 bg-gradient-to-r from-[primary]/20 via-[primary]/5 to-transparent"></div>

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-10 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[primary] to-amber-500 flex items-center justify-center text-[#111827] font-black text-2xl shadow-lg border-4 border-[#070b13] shrink-0">
              {initials}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-black text-[#111827] tracking-tight leading-none">{name || 'Root Admin'}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#2563EB] bg-amber-500/10 border border-[#2563EB]/35 px-2.5 py-1 rounded-full">
                  <Crown size={10} />
                  {role || 'Super Administrator'}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <Activity size={10} />
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: 'Email', value: email || '—' },
              { icon: Phone, label: 'Phone', value: phone || '—' },
              { icon: ShieldCheck, label: 'Access Level', value: 'Root • Full Access' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={12} className="text-[#2563EB]" />
                  <span className="text-[9px] uppercase font-black tracking-wider text-[#64748B]">{label}</span>
                </div>
                <span className="text-xs font-bold text-[#111827] truncate block">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 p-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl w-fit">
        {[
          { id: 'info', label: 'Profile Information', icon: User },
          { id: 'security', label: 'Security Credentials', icon: KeyRound },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === id
                ? 'bg-[#F8FAFC] text-[#2563EB] border-[#2563EB]/35 shadow-blue-sm font-extrabold'
                : 'text-[#64748B] border-transparent hover:text-[#111827]'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-6">
            <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <User size={16} className="text-[#2563EB]" />
              Profile Details
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              {/* Display Name */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Root Admin"
                    className="w-full pl-9 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg py-2.5 text-[#111827] focus:outline-none transition-all duration-205"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. admin@gsmgiri.com"
                    className="w-full pl-9 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg py-2.5 text-[#111827] focus:outline-none transition-all duration-205"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-2">
                  Contact Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +91 824-700-5409"
                    className="w-full pl-9 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg py-2.5 text-[#111827] focus:outline-none transition-all duration-205"
                  />
                </div>
              </div>

              {/* Feedback Message */}
              {profileMsg && (
                <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {profileMsg.type === 'success'
                    ? <CheckCircle size={14} />
                    : <AlertCircle size={14} />}
                  {profileMsg.text}
                </div>
              )}

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="py-3 px-6 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-[#111827] font-black rounded-xl text-center cursor-pointer transition-all border border-transparent flex items-center justify-center gap-1.5 shadow-blue-sm"
                >
                  <Save size={14} />
                  <span>{profileSaving ? 'Saving…' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-5">
            <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
              <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#2563EB]" />
                Access Control
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Access Role', value: role || 'Super Administrator' },
                  { label: 'Username', value: 'admin' },
                  { label: 'Auth Method', value: 'JWT Token (7d)' },
                  { label: 'Permissions', value: 'Full Root Access' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase font-black tracking-wider text-[#64748B]">{label}</span>
                    <span className="text-xs font-bold text-[#111827]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={13} className="text-[#2563EB]" />
                <span className="text-[10px] uppercase font-black tracking-wider text-[#2563EB]">Session Info</span>
              </div>
              <p className="text-[10px] text-[#64748B] font-semibold leading-relaxed">
                Your JWT session token is valid for <strong className="text-[#2563EB]">7 days</strong> from last login. All profile changes take effect immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Form */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-6">
            <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <Lock size={16} className="text-[#2563EB]" />
              Change Administrator Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-5 text-xs">
              {/* Current Password */}
              {[
                { label: 'Current Password', value: currentPw, setter: setCurrentPw, show: showCurrentPw, toggleShow: () => setShowCurrentPw(v => !v), placeholder: 'Enter current password' },
                { label: 'New Password', value: newPw, setter: setNewPw, show: showNewPw, toggleShow: () => setShowNewPw(v => !v), placeholder: 'Minimum 6 characters' },
                { label: 'Confirm New Password', value: confirmPw, setter: setConfirmPw, show: showConfirmPw, toggleShow: () => setShowConfirmPw(v => !v), placeholder: 'Re-enter new password' },
              ].map(({ label, value, setter, show, toggleShow, placeholder }) => (
                <div key={label}>
                  <label className="text-[10px] text-[#64748B] font-black uppercase tracking-wider block mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type={show ? 'text' : 'password'}
                      required
                      value={value}
                      onChange={e => setter(e.target.value)}
                      placeholder={placeholder}
                      className="w-full pl-9 pr-11 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB]/70 text-xs font-bold rounded-lg py-2.5 text-[#111827] focus:outline-none transition-all duration-205"
                    />
                    <button
                      type="button"
                      onClick={toggleShow}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Password strength hint */}
              {newPw && (
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1.5">
                  {[
                    { label: 'At least 6 characters', met: newPw.length >= 6 },
                    { label: 'Contains a number', met: /\d/.test(newPw) },
                    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPw) },
                  ].map(({ label, met }) => (
                    <div key={label} className={`flex items-center gap-2 text-[10px] font-bold ${met ? 'text-emerald-400' : 'text-[#64748B]'}`}>
                      <CheckCircle size={11} className={met ? 'text-emerald-400' : 'text-[#111827]'} />
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback message */}
              {pwMsg && (
                <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold ${
                  pwMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {pwMsg.type === 'success'
                    ? <CheckCircle size={14} />
                    : <AlertCircle size={14} />}
                  {pwMsg.text}
                </div>
              )}

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  disabled={pwSaving}
                  className="py-3 px-6 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-[#111827] font-black rounded-xl text-center cursor-pointer transition-all border border-transparent flex items-center justify-center gap-1.5 shadow-blue-sm"
                >
                  <ShieldCheck size={14} />
                  <span>{pwSaving ? 'Updating…' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security tips sidebar */}
          <div className="space-y-5">
            <div className="glass-card p-6 rounded-2xl shadow-lg border border-[#E2E8F0] space-y-4">
              <h2 className="text-xs font-black text-[#111827] uppercase tracking-wider border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#2563EB]" />
                Security Tips
              </h2>
              <ul className="space-y-3">
                {[
                  'Use at least 8 characters with mixed case.',
                  'Include numbers and special characters.',
                  'Never share your admin password.',
                  'Change your password periodically.',
                  'Log out after each session on shared devices.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[10px] text-[#64748B] font-semibold leading-relaxed">
                    <span className="w-4 h-4 shrink-0 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[8px] font-black text-[#2563EB]">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={13} className="text-red-400 animate-pulse" />
                <span className="text-[10px] uppercase font-black tracking-wider text-red-400">Important</span>
              </div>
              <p className="text-[10px] text-red-400/80 font-semibold leading-relaxed">
                After changing your password, log out and log back in using your new credentials to confirm the change was applied correctly.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
