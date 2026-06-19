import {
  LayoutDashboard,
  ShoppingBag,
  Cpu,
  Menu,
  X,
  Globe,
  LogOut,
  User,
  Users,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Handshake,
  Hash,
  Activity,
  MonitorPlay
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ sidebarOpen, setSidebarOpen, onLogout, profile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.substring(1) || 'dashboard';
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'popad', label: 'Pop-Up Ad', icon: MonitorPlay },
    { id: 'services', label: 'Services', icon: Cpu },
    { id: 'imei', label: 'IMEI Service', icon: Hash },
    { id: 'remote', label: 'Remote / Tool Rent', icon: Activity },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'bestselling', label: 'Best Selling', icon: Sparkles },
    { id: 'recentlyadded', label: 'Recently Added', icon: Clock },
    { id: 'promocolumns', label: 'Promoted Columns', icon: Layers },
    { id: 'clients', label: 'Clients', icon: Handshake },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders Control', icon: ShoppingBag },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  const displayName = profile?.name || 'Root Admin';
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-lg border border-[#2563EB]/30 text-white hover:border-[#2563EB] transition-all focus:outline-none shadow-lg shadow-black/20"
          style={{ backgroundColor: '#0F172A' }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-[50] bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 lg:static lg:flex flex-col border-r border-[#1E293B] text-white transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#0F172A' }}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border border-[#2563EB]/30 shadow-sm">
              <img src="/logo.png" alt="GSM GIRI Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                GSM<span className="text-[#06B6D4]">GIRI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold block mt-1.5 leading-none">
                B2B Admin Console
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-200 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${isActive
                  ? 'bg-[#2563EB] text-white border-[#2563EB]/35 font-extrabold shadow-[0_4px_20px_-2px_rgba(37,99,235,0.30)]'
                  : 'bg-transparent text-[#94A3B8] border-transparent hover:text-white hover:bg-[#1E293B] hover:border-[#334155]'
                  }`}
              >
                <IconComponent size={16} className={isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Credentials Panel */}
        <div className="p-4 mx-4 mb-4">
          <div
            onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
            className={`flex items-center justify-between gap-3 bg-[#1E293B] border rounded-xl p-3.5 cursor-pointer transition-all hover:border-[#2563EB]/40 hover:bg-slate-700 ${activeTab === 'profile' ? 'border-[#2563EB]/40 bg-slate-700' : 'border-[#1E293B]'
              }`}
            title="Go to Admin Profile"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block leading-none truncate">{displayName}</span>
                <span className="text-[9px] text-[#10B981] font-semibold flex items-center gap-1 mt-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onLogout(); }}
              title="Log Out Session"
              className="p-2 bg-slate-800 hover:bg-[#EF4444]/20 border border-slate-700 hover:border-[#EF4444]/50 text-[#64748B] hover:text-[#EF4444] rounded-lg cursor-pointer transition-all shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 pb-5 border-t border-[#1E293B] pt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider text-center">
          <span>v2.2.0 • Pro Control</span>
        </div>
      </aside>
    </>
  );
}
