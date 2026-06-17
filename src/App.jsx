import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ServicesManager from './pages/ServicesManager';
import OrdersManager from './pages/OrdersManager';
import WalletManager from './pages/WalletManager';
import InquiriesManager from './pages/InquiriesManager';
import BannersManager from './pages/BannersManager';
import CategoriesManager from './pages/CategoriesManager';
import UsersManager from './pages/UsersManager';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import BestSellingManager from './pages/BestSellingManager';
import RecentlyAddedManager from './pages/RecentlyAddedManager';
import PromoColumnsManager from './pages/PromoColumnsManager';
import ClientsManager from './pages/ClientsManager';
import ImeiServiceManager from './pages/ImeiServiceManager';
import RemoteRentManager from './pages/RemoteRentManager';
import { verifyToken, logout as apiLogout, getWallet, getOrders, getServices, resetDatabase, getProfile } from './utils/api';
import { Sun, Moon } from 'lucide-react';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState({ name: 'Root Admin', role: 'Super Administrator' });

  // Auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      const valid = await verifyToken();
      setIsLoggedIn(valid);
      setLoadingAuth(false);
    };
    checkAuth();
  }, []);

  // Fetch all B2B records and profile from API when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const loadData = async () => {
        try {
          const walletData = await getWallet();
          setBalance(walletData.balance);

          const ordersData = await getOrders();
          setOrders(ordersData);

          const servicesData = await getServices();
          setServices(servicesData);

          const profileData = await getProfile();
          setProfile(profileData);
        } catch (err) {
          console.error("Error loading console database from API", err);
        }
      };
      loadData();
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    apiLogout();
    setIsLoggedIn(false);
  };

  // Database Reset Handler
  const handleResetDatabase = async () => {
    try {
      await resetDatabase();
      const walletData = await getWallet();
      setBalance(walletData.balance);

      const ordersData = await getOrders();
      setOrders(ordersData);

      const servicesData = await getServices();
      setServices(servicesData);

      const profileData = await getProfile();
      setProfile(profileData);

      alert("Database reseeded successfully!");
    } catch (err) {
      alert("Error resetting database: " + err.message);
    }
  };

  // Derive display initials from profile name
  const profileInitials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-sans text-xs uppercase tracking-widest font-black">
        <span className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mr-3"></span>
        Loading Administrator Console...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-sans">

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        profile={profile}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 bg-white/85 backdrop-blur-md flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden md:block">
              SYSTEM TIME: {new Date().toISOString().slice(0, 10)} (LIVE)
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Profile Badge */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-[#d4af37]/5 hover:border-[#d4af37]/35 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-500 flex items-center justify-center text-slate-950 font-black text-[9px]">
                {profileInitials}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden md:block">{profile?.name || 'Admin'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              orders={orders}
              balance={balance}
              setActiveTab={setActiveTab}
              setEditingOrder={setEditingOrder}
            />
          )}

          {activeTab === 'imei' && (
            <ImeiServiceManager />
          )}

          {activeTab === 'remote' && (
            <RemoteRentManager />
          )}

          {activeTab === 'services' && (
            <ServicesManager
              services={services}
              setServices={setServices}
            />
          )}

          {activeTab === 'bestselling' && (
            <BestSellingManager
              services={services}
              setServices={setServices}
            />
          )}

          {activeTab === 'recentlyadded' && (
            <RecentlyAddedManager
              services={services}
              setServices={setServices}
            />
          )}

          {activeTab === 'promocolumns' && (
            <PromoColumnsManager
              services={services}
              setServices={setServices}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersManager
              orders={orders}
              setOrders={setOrders}
              editingOrder={editingOrder}
              setEditingOrder={setEditingOrder}
            />
          )}

          {activeTab === 'wallet' && (
            <WalletManager
              balance={balance}
              setBalance={setBalance}
              orders={orders}
              setOrders={setOrders}
            />
          )}

          {activeTab === 'banners' && (
            <BannersManager />
          )}

          {activeTab === 'categories' && (
            <CategoriesManager />
          )}

          {activeTab === 'users' && (
            <UsersManager />
          )}

          {activeTab === 'clients' && (
            <ClientsManager />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesManager />
          )}

          {activeTab === 'settings' && (
            <Settings 
              onResetDatabase={handleResetDatabase} 
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              profile={profile}
              setProfile={setProfile}
            />
          )}
        </main>

      </div>

    </div>
  );
}
