import React, { useState, useEffect } from 'react';
import { 
  Terminal, Copy, Check, Shield, Cpu, 
  BarChart3, Zap, ArrowUpRight, Globe, Activity, TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from './Skeleton';


const WorkspaceTab = ({ widgetId, user, stats, setActiveTab, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const navigate = useNavigate();


  // Dynamic Data Logic from your Stats prop
  const firstName = user?.firstName || "Operator";
  const currentUsage = user?.messagesSent || 0;
  const usageLimit = user?.messageLimit || 27;
  const usagePercent = Math.min(Math.round((currentUsage / usageLimit) * 100), 100);
  const domainCount = user?.connectedDomains || 0;

  const snippetCode = `<script src="${import.meta.env.VITE_API_URL}/chat-widget.js" data-id="${widgetId}"></script>`;

  useEffect(() => {
    setTimeout(() => setAnimateProgress(true), 500);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
<div className="p-8 max-w-7xl mx-auto text-white animate-in fade-in duration-700">
  
  {/* 1. TOP NAV / BREADCRUMBS */}
  <div className="flex justify-between items-center mb-12 px-2">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Node Active</span>
      </div>
      <span className="text-gray-700 font-black">/</span>
      {isLoading ? (
        <Skeleton className="h-3 w-16" />
      ) : (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">ID: {widgetId?.slice(-6)}</span>
      )}
    </div>

    {/* UPDATED USER TRIGGER */}
    <button 
      onClick={() => navigate('/settings')} 
      className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 hover:bg-white/10 hover:border-indigo-500/50 transition-all group"
    >
      <div className="text-right">
        <div className="text-[8px] font-black uppercase text-gray-500 group-hover:text-gray-400 transition-colors">Tier</div>
        {isLoading ? <Skeleton className="h-3 w-12 mt-1" /> : (
          <div className="text-[10px] font-black italic uppercase text-indigo-400">{user?.plan || 'Starter'}</div>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="w-8 h-8 rounded-lg" />
      ) : (
        <div className="w-8 h-8 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 flex items-center justify-center font-black italic text-xs uppercase transition-colors shadow-lg shadow-indigo-600/20">
          {firstName?.[0] || 'U'}
        </div>
      )}
    </button>
  </div>

  <div className="grid grid-cols-12 gap-8">
    
    {/* 2. MAIN CONTENT */}
    <div className="col-span-12 lg:col-span-8 space-y-8">
      <section className="px-2">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-4 w-40 mt-4" />
          </div>
        ) : (
          <>
            <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">
              Hello, <span className="text-indigo-600">{firstName}</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">
                Deployment Ready • <span className="text-white">v2.0.4-Stable</span>
            </p>
          </>
        )}
      </section>

      {/* CODE SNIPPET BOX */}
      <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-indigo-500">
            <Terminal size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Embed Code</span>
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-2xl p-8 relative group transition-all hover:border-indigo-500/30">
          {isLoading ? (
             <div className="space-y-3 mb-8">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[90%]" />
                <Skeleton className="h-3 w-[40%]" />
             </div>
          ) : (
            <code className="font-mono text-xs text-indigo-200/70 block break-all leading-relaxed mb-8">
              {snippetCode}
            </code>
          )}
          
          <button 
            disabled={isLoading}
            onClick={handleCopy} 
            className={`w-full py-5 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {isLoading ? <Skeleton className="h-4 w-32 bg-black/20" /> : (
              copied ? <><Check size={16}/> Copied to Clipboard</> : <><Copy size={16}/> Copy Snippet</>
            )}
          </button>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-[2.5rem]" />
            <Skeleton className="h-32 rounded-[2.5rem]" />
          </>
        ) : (
          <>
            <FeatureCard 
                icon={Shield} 
                title="Security" 
                value={`${domainCount} Connected`} 
                desc="Authorized Domains" 
            />
            <FeatureCard 
                icon={Cpu} 
                title="AI Brain" 
                value="Gemini 2.0" 
                desc="Ultra-Flash Latency" 
            />
          </>
        )}
      </div>
    </div>

    {/* 3. SIDEBAR (USAGE & UPGRADE) */}
    <div className="col-span-12 lg:col-span-4 space-y-8">
      
      {/* USAGE MONITOR */}
      <div className="bg-linear-to-br from-indigo-900/10 to-[#080808] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
        <div className="flex items-center gap-3 text-gray-500 mb-10">
          <BarChart3 size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Usage Monitor</span>
        </div>
        
        <div className="space-y-8">
          <div>
            {isLoading ? (
              <Skeleton className="h-12 w-24 mb-2" />
            ) : (
              <div className="text-5xl font-black italic tracking-tighter mb-1">
                  {currentUsage.toLocaleString()}
              </div>
            )}
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Messages Sent</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Utilization</span>
                {isLoading ? <Skeleton className="h-3 w-8" /> : (
                  <span className={usagePercent > 85 ? 'text-rose-500' : 'text-indigo-400'}>{usagePercent}%</span>
                )}
            </div>
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5">
                {isLoading ? <div className="h-full bg-white/5 animate-pulse w-full" /> : (
                  <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out bg-indigo-600`}
                      style={{ width: animateProgress ? `${usagePercent}%` : '0%' }}
                  />
                )}
            </div>
            <div className="flex justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest pt-2">
                {isLoading ? <Skeleton className="h-2 w-full" /> : (
                  <>
                    <span>Limit: {usageLimit.toLocaleString()}</span>
                    <span>{usageLimit - currentUsage} Left</span>
                  </>
                )}
            </div>
          </div>

          {/* --- UPGRADE SECTION --- */}
          {(!isLoading && user?.plan !== 'Enterprise') && (
            <div className="pt-6 border-t border-white/5 mt-4 animate-in fade-in duration-500">
              <button 
                onClick={() => navigate('/billing')}
                className="w-full group/btn bg-indigo-600/10 border border-indigo-600/20 hover:bg-indigo-600 transition-all p-5 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-2 rounded-lg group-hover/btn:bg-white group-hover/btn:text-indigo-600 transition-colors">
                    <TrendingUp size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest">Upgrade Plan</div>
                    <div className="text-[8px] text-gray-500 group-hover/btn:text-indigo-100 uppercase font-bold">Remove Limits</div>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-indigo-600 group-hover/btn:text-white transition-all" />
              </button>
            </div>
          )}
          {isLoading && <Skeleton className="h-20 w-full rounded-2xl" />}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-6 px-2">Quick Navigation</h3>
        <div className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </>
            ) : (
              <>
                <QuickLink label="Widget Customizer" icon={Zap} onClick={() => setActiveTab('styling')} />
                <QuickLink label="Knowledge Base" icon={Activity} onClick={() => setActiveTab('knowledge')} />
                <QuickLink label="Advanced Security" icon={Globe} onClick={() => setActiveTab('settings')} />
              </>
            )}
        </div>
      </div>

    </div>
  </div>
</div>
  );
};

const FeatureCard = ({ icon: Icon, title, value, desc }) => (
  <div className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/20 transition-all group">
    <div className="p-3 bg-white/5 w-fit rounded-xl text-gray-500 group-hover:text-indigo-400 transition-colors mb-6">
        <Icon size={22} />
    </div>
    <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">{title}</div>
    <div className="text-3xl font-black italic tracking-tighter uppercase mb-1">{value}</div>
    <div className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">{desc}</div>
  </div>
);

const QuickLink = ({ label, icon: Icon, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group text-left">
        <div className="flex items-center gap-3">
            <Icon size={14} className="text-gray-500 group-hover:text-indigo-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{label}</span>
        </div>
        <ArrowUpRight size={14} className="text-gray-700 group-hover:text-white transition-all" />
    </button>
);

export default WorkspaceTab;