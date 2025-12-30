import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sliders, Zap, LogOut, ShieldCheck, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ tab, setTab }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ plan: 'Free', currentUsage: 0, usageLimit: 27 });
  const token = (localStorage.getItem('token') || '').replace(/['"]+/g, '').trim();

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/plan-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setUserData(data); 
      } catch (err) {
        console.error("Plan fetch failed", err);
      }
    };
    fetchUserPlan();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-[#080808] border-r border-white/5 flex flex-col p-6 z-10 h-screen sticky top-0">
      
      {/* 1. BRANDING - Sharp & Italic */}
      <div className="text-white font-black text-2xl mb-12 flex items-center gap-3 italic uppercase tracking-tighter px-2 mt-4">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
          <Zap size={20} fill="white"/>
        </div>
        Gen.AI
      </div>
      
      {/* 2. NAVIGATION - Spaced for scannability */}
      <nav className="flex-1 space-y-1">
        <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4 px-4">Menu</div>
        <NavBtn active={tab === 'dashboard'} label="Workspace" icon={LayoutDashboard} onClick={() => setTab('dashboard')} />
        <NavBtn active={tab === 'lab'} label="The Lab" icon={Sliders} onClick={() => setTab('lab')} />
        <NavBtn active={tab === 'knowledge'} label="Knowledge" icon={BookOpen} onClick={() => setTab('knowledge')} />
        <NavBtn active={tab === 'domains'} label="Security" icon={ShieldCheck} onClick={() => setTab('domains')} />
      </nav>

      {/* 3. FOOTER SECTION - Plan & Logout */}
      <div className="pt-6 border-t border-white/5 space-y-6 mb-4">
        
        {/* Compact Plan Module */}
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl group transition-all hover:bg-white/[0.04]">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Plan: {userData.plan}</span>
                <Zap size={10} className="text-indigo-500 fill-indigo-500" />
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                    className="bg-indigo-600 h-full transition-all duration-1000" 
                    style={{ width: `${(userData.currentUsage / userData.usageLimit) * 100}%` }}
                />
            </div>
        </div>

        {/* Logout Button - Minimal */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-2 text-gray-500 hover:text-rose-500 transition-colors group"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
};

const NavBtn = ({ active, label, icon: Icon, onClick }) => (
    <button 
      onClick={onClick} 
      className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all group ${
        active 
        ? 'bg-indigo-600/10 text-white border border-indigo-600/20' 
        : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={active ? 'text-indigo-500' : 'text-gray-600 group-hover:text-gray-300 transition-colors'}/> 
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="text-indigo-500" />}
    </button>
);

export default Sidebar;