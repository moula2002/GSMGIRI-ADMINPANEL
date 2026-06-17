import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  CheckCircle,
  XCircle,
  Wallet,
  Mail,
  Building2,
  UserCheck,
  Shield
} from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/api';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail]       = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formCompany, setFormCompany]   = useState('');
  const [formBalance, setFormBalance]   = useState(0);
  const [formStatus, setFormStatus]     = useState('Active');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditUser(null);
    setFormUsername(''); setFormEmail(''); setFormPassword('');
    setFormCompany(''); setFormBalance(0); setFormStatus('Active');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormUsername(user.username || '');
    setFormEmail(user.email || '');
    setFormPassword('');
    setFormCompany(user.company || '');
    setFormBalance(user.balance || 0);
    setFormStatus(user.status || 'Active');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formUsername,
      email: formEmail,
      company: formCompany,
      balance: Number(formBalance),
      status: formStatus,
      ...(formPassword ? { password: formPassword } : {})
    };
    try {
      if (editUser) {
        await updateUser(editUser._id, payload);
        setUsers(users.map(u => u._id === editUser._id ? { ...u, ...payload } : u));
      } else {
        const created = await createUser(payload);
        setUsers([created, ...users]);
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving user: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateUser(user._id, { status: newStatus });
      setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || (u.status || 'Active') === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0);
  const activeCount = users.filter(u => (u.status || 'Active') === 'Active').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gradient-gold">
            Users
          </h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1.5">
            Manage registered B2B agents fetched from MongoDB
          </p>
        </div>
        <button onClick={openAddModal} className="btn-gold px-4 py-2.5 flex items-center gap-1.5">
          <Plus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-[#d4af37] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
              <Users size={15} className="text-[#d4af37]" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Total Users</span>
          </div>
          <span className="text-2xl font-black text-black">{users.length}</span>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-emerald-500 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <UserCheck size={15} className="text-emerald-600" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Active Users</span>
          </div>
          <span className="text-2xl font-black text-black">{activeCount}</span>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-amber-500 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Wallet size={15} className="text-amber-600" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Total Balances</span>
          </div>
          <span className="text-2xl font-black text-black">₹{totalBalance.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-card rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-center shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search username, email or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg pl-11 pr-4 py-3 text-black focus:outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'Active', 'Suspended'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                filterStatus === s
                  ? 'bg-[#d4af37] text-white border-transparent shadow-gold-sm'
                  : 'bg-white border-slate-200 text-black hover:border-slate-300'
              }`}
            >
              {s === 'all' ? 'All Users' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-xl border border-slate-200 shadow-lg p-6">
        <h3 className="text-xs font-black text-black uppercase tracking-wider mb-5 pb-3 border-b border-slate-200 flex items-center gap-2">
          <Shield size={14} className="text-[#d4af37]" />
          Registered B2B Agents ({filtered.length})
        </h3>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold uppercase tracking-wider">
            Loading users from database...
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                  <th className="pb-3 pl-1">Agent / Username</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Wallet Balance</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-1">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {(user.username || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="block font-extrabold text-black">{user.username}</span>
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[100px]">{String(user._id).slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-black">
                        <Building2 size={11} className="text-slate-400 shrink-0" />
                        {user.company || <span className="text-slate-400 font-normal italic">—</span>}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                        <Mail size={10} className="text-slate-400 shrink-0" />
                        {user.email}
                      </span>
                    </td>
                    <td className="py-4 font-black text-[#d4af37]">
                      ₹{(user.balance || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 text-[10px] text-slate-500 font-semibold">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                          (user.status || 'Active') === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                        }`}
                        title="Click to toggle status"
                      >
                        {(user.status || 'Active') === 'Active' ? (
                          <span className="flex items-center gap-1"><CheckCircle size={9} /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1"><XCircle size={9} /> Suspended</span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 bg-slate-100 hover:bg-[#d4af37] text-slate-600 hover:text-white border border-slate-200 hover:border-transparent rounded transition-all cursor-pointer"
                          title="Edit User"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.username)}
                          className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-transparent rounded transition-all cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500 font-bold uppercase tracking-wider">
                      No users found in database
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2">
                <Users size={14} className="text-[#d4af37]" />
                {editUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Username *</label>
                  <input
                    type="text" required
                    placeholder="e.g. moula"
                    value={formUsername} onChange={e => setFormUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-black focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. WINER WEAR"
                    value={formCompany} onChange={e => setFormCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-black focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Email Address *</label>
                <input
                  type="email" required
                  placeholder="e.g. agent@domain.com"
                  value={formEmail} onChange={e => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-black focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  {editUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  placeholder={editUser ? '••••••••' : 'Min 8 characters'}
                  required={!editUser}
                  value={formPassword} onChange={e => setFormPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-black focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Wallet Balance (₹)</label>
                  <input
                    type="number" min="0"
                    value={formBalance} onChange={e => setFormBalance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37]/70 text-xs font-semibold rounded-lg px-3.5 py-2.5 text-black focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Account Status</label>
                  <select
                    value={formStatus} onChange={e => setFormStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3.5 py-2.5 text-black focus:outline-none focus:border-[#d4af37]/70 transition-all cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-gold py-2.5 rounded-xl">
                  {editUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
