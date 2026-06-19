import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ServicesManager from './pages/ServicesManager';
import OrdersManager from './pages/OrdersManager';

import BannersManager from './pages/BannersManager';
import CategoriesManager from './pages/CategoriesManager';
import UsersManager from './pages/UsersManager';
import Profile from './pages/Profile';
import Login from './pages/Login';
import BestSellingManager from './pages/BestSellingManager';
import RecentlyAddedManager from './pages/RecentlyAddedManager';
import PromoColumnsManager from './pages/PromoColumnsManager';
import ClientsManager from './pages/ClientsManager';
import ImeiServiceManager from './pages/ImeiServiceManager';
import RemoteRentManager from './pages/RemoteRentManager';
import PopAdManager from './pages/PopAdManager';
import { verifyToken, logout as apiLogout, getOrders, getServices, resetDatabase, getProfile } from './utils/api';
import { Sun, Moon, LogOut } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);


  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState({ name: 'Root Admin', role: 'Super Administrator' });
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#64748B] font-sans text-xs uppercase tracking-widest font-black">
        <span className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mr-3"></span>
        Loading Administrator Console...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#111827] font-sans">

      {/* Navigation Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        profile={profile}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-20 border-b border-[#475569] bg-[#1E293B] flex items-center justify-end md:justify-between px-4 pl-16 md:px-8 shrink-0 text-white">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider hidden md:block">
              SYSTEM TIME: {new Date().toISOString().slice(0, 10)} (LIVE)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Profile Badge */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 bg-[#334155] hover:bg-[#F8FAFC] hover:text-[#111827] border border-[#475569] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-black text-[10px]">
                {profileInitials}
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#111827] hidden md:block">{profile?.name || 'Admin'}</span>
            </button>
            
            {/* Quick Logout Button */}
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-2 bg-[#334155] hover:bg-[#EF4444] border border-[#475569] hover:border-[#EF4444] text-[#64748B] hover:text-white rounded-xl cursor-pointer transition-all flex items-center justify-center"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <Dashboard
                orders={orders}
                setEditingOrder={setEditingOrder}
              />
            } />

            <Route path="/imei" element={<ImeiServiceManager />} />
            <Route path="/remote" element={<RemoteRentManager />} />

            <Route path="/services" element={
              <ServicesManager
                services={services}
                setServices={setServices}
              />
            } />

            <Route path="/bestselling" element={
              <BestSellingManager
                services={services}
                setServices={setServices}
              />
            } />

            <Route path="/recentlyadded" element={
              <RecentlyAddedManager
                services={services}
                setServices={setServices}
              />
            } />

            <Route path="/promocolumns" element={
              <PromoColumnsManager
                services={services}
                setServices={setServices}
              />
            } />

            <Route path="/orders" element={
              <OrdersManager
                orders={orders}
                setOrders={setOrders}
                editingOrder={editingOrder}
                setEditingOrder={setEditingOrder}
              />
            } />

            <Route path="/banners" element={<BannersManager />} />
            <Route path="/categories" element={<CategoriesManager />} />
            <Route path="/users" element={<UsersManager />} />
            <Route path="/popad" element={<PopAdManager />} />
            <Route path="/clients" element={<ClientsManager />} />

            <Route path="/profile" element={
              <Profile
                profile={profile}
                setProfile={setProfile}
              />
            } />
          </Routes>
        </main>

      </div>

    </div>
  );
}
