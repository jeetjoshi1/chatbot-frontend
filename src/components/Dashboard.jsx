import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import WorkspaceTab from "./WorkspaceTab";
import LabTab from './LabTab';
import DomainManager from './DomainManager';
import KnowledgeTab from './KnowledgeTab'; // 1. Import the new component
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = (localStorage.getItem('token') || '').replace(/['"]+/g, '').trim();
  const widgetId = localStorage.getItem('widgetId') || 'demo-123';

  const [config, setConfig] = useState({
    botName: "",
    primaryColor: "#6366f1",
    headerTextColor: "#ffffff",
    chatBg: "#ffffff",
    botBubbleBg: "#f1f5f9",
    botBubbleText: "#1e293b",
    userBubbleBg: "#6366f1",
    userBubbleText: "#ffffff",
    borderRadius: "20px"
  });

  const [whitelistedDomains, setWhitelistedDomains] = useState([]);
  const [user, setUser] = useState(null);

useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("Profile fetch failed", err);
        }
    };

    fetchProfile();
}, []);


console.log(user)




  useEffect(() => {
    const fetchCurrentSettings = async () => {
      if (!widgetId || widgetId === 'demo-123') {
        setFetching(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/widget/config/${widgetId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.whitelistedDomains) setWhitelistedDomains(data.whitelistedDomains);
          const { whitelistedDomains, isPaid, ...styleConfig } = data;
          if (Object.keys(styleConfig).length > 0) {
            setConfig(prev => ({ ...prev, ...styleConfig }));
          }
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setFetching(false); 
      }
    };
    fetchCurrentSettings();
  }, [widgetId]);


  useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('payment') === 'success') {
            // 1. Fire the beautiful toast!
            toast.success('Account Upgraded Successfully!', {
                duration: 5000,
                style: {
                    border: '1px solid #4f46e5',
                    padding: '16px',
                    color: '#ffffff',
                    background: '#0a0a0a',
                },
                iconTheme: {
                    primary: '#4f46e5',
                    secondary: '#FFFAEE',
                },
            });

            // 2. Clean the URL so the toast doesn't reappear on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);






  const handleSaveDomains = async (newDomainList) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/widget/${widgetId}/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: newDomainList })
      });
      if (res.ok) setWhitelistedDomains(newDomainList);
    } catch (err) { console.error("Domain update failed"); }
  };

  // Inside Dashboard.jsx


  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      <Sidebar tab={tab} setTab={setTab} />
      
      <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,_#111_0%,_#050505_50%)]">
        {/* Workspace Tab */}
        {tab === 'dashboard' && <WorkspaceTab widgetId={widgetId} user={user}/>}

        {/* Knowledge Tab - Integrated Here */}
        {tab === 'knowledge' && <KnowledgeTab widgetId={widgetId} />}

        {/* Lab Tab */}
        {tab === 'lab' && (
          <LabTab 
            settings={config}
            updateSettings={setConfig}
            widgetId={widgetId}
            fetching={fetching}
          />
        )}

        {/* Domains Tab */}
        {tab === 'domains' && (
          <div className="p-12 max-w-4xl mx-auto">
            <header className="mb-12">
              <h1 className="text-5xl font-black italic tracking-tighter uppercase underline decoration-indigo-500 underline-offset-8">
                Authorized Origins
              </h1>
              <p className="text-gray-500 mt-6 font-bold uppercase tracking-[0.2em] text-[10px]">
                Firewall Settings & Domain Whitelisting
              </p>
            </header>
            
            <DomainManager 
              currentDomains={whitelistedDomains} 
              onSave={handleSaveDomains}
              widgetId={widgetId}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;