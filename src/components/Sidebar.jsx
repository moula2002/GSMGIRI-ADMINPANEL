import {
  LayoutDashboard,
  ShoppingBag,
  Cpu,
  Wallet,
  Settings,
  Menu,
  X,
  Globe,
  LogOut,
  User,
  Users,
  MessageSquare,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Handshake,
  Hash,
  Activity
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout, profile }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
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
    { id: 'wallet', label: 'Deposits & Wallet', icon: Wallet },
    { id: 'inquiries', label: 'Support Tickets', icon: MessageSquare },
    { id: 'settings', label: 'System Settings', icon: Settings },
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
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 bg-slate-900 border border-[#d4af37]/30 text-slate-100 rounded-lg hover:border-[#d4af37] transition-all focus:outline-none"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-45 bg-black/70 backdrop-blur-md transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-46 w-64 lg:static lg:flex flex-col bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0'
          } ${!sidebarOpen && 'hidden lg:flex'}`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border border-[#d4af37]/30 shadow-sm">
              <img src="/logo.png" alt="GSM GIRI Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-black block leading-none">
                GSM<span className="text-[#d4af37]">GIRI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-black/70 font-bold block mt-1.5 leading-none">
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
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${isActive
                  ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/35 font-extrabold shadow-gold-sm'
                  : 'bg-transparent text-black border-transparent hover:text-white hover:bg-black hover:border-black'
                  }`}
              >
                <IconComponent size={16} className={isActive ? 'text-[#d4af37]' : 'text-black/80'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Credentials Panel */}
        <div className="p-4 mx-4 mb-4">
          <div
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            className={`flex items-center justify-between gap-3 bg-slate-50 border rounded-xl p-3.5 cursor-pointer transition-all hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 ${activeTab === 'profile' ? 'border-[#d4af37]/40 bg-[#d4af37]/5' : 'border-slate-100'
              }`}
            title="Go to Admin Profile"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm shadow-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-black block leading-none truncate">{displayName}</span>
                <span className="text-[9px] text-[#22c55e] font-semibold flex items-center gap-1 mt-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onLogout(); }}
              title="Log Out Session"
              className="p-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-500/50 text-slate-500 hover:text-red-500 rounded-lg cursor-pointer transition-all shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 pb-5 border-t border-slate-100 pt-4 text-[10px] text-black/80 font-semibold uppercase tracking-wider text-center">
          <span>v2.2.0 • Pro Control</span>
        </div>
      </aside>
    </>
  );
}
