import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Palette, MessageSquare, Maximize, ShieldCheck, RefreshCcw, Sparkles } from 'lucide-react';

const LabTab = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const iframeRef = useRef(null);

  // 1. Fetch initial configuration
  useEffect(() => {
    const fetchConfig = async () => {
      const widgetId = localStorage.getItem('widgetId');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/widget/config/${widgetId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) setConfig(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // 2. LIVE UPDATE: Send config to iframe whenever it changes
  useEffect(() => {
    if (iframeRef.current && config) {
      iframeRef.current.contentWindow.postMessage({
        type: 'WIDGET_LAB_UPDATE',
        config: config
      }, '*');
    }
  }, [config]);

  const handleAIWelcome = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/widget/generate-welcome`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        setConfig({ ...config, welcomeMessage: data.welcomeMessage });
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      console.error("AI Generation Error", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const stylesOnly = {
      primaryColor: config.primaryColor,
      userBubbleBg: config.userBubbleBg,
      userBubbleText: config.userBubbleText,
      botBubbleBg: config.botBubbleBg,
      botBubbleText: config.botBubbleText,
      headerTextColor: config.headerTextColor,
      chatBg: config.chatBg,
      botName: config.botName,
      welcomeMessage: config.welcomeMessage,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      bubbleRadius: config.bubbleRadius,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/widget/update-styles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ ...stylesOnly }),
      });
      if (res.ok) alert("WIDGET_DNA_SYNCED");
    } catch (err) {
      alert("SAVE_ERROR");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) return <div className="h-full bg-black flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;

  const widgetId = localStorage.getItem('widgetId');
  const widgetPreviewHtml = `
    <!DOCTYPE html>
    <html>
      <body>
        <script> window.isTestMode = true; </script>
        <script src="${import.meta.env.VITE_API_URL}/chat-widget.js" data-id="${widgetId}"></script>
      </body>
    </html>
  `;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[400px] border-r border-white/5 bg-[#0a0a0a] p-8 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Lab</h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* IDENTITY SECTION */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> Identity & Content
            </label>
            <div className="space-y-3">
              <div>
                <span className="text-[9px] text-gray-600 font-bold ml-1">BOT_NAME</span>
                <input 
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs focus:border-indigo-500 transition-all outline-none"
                  value={config.botName}
                  onChange={(e) => setConfig({...config, botName: e.target.value})}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-gray-600 font-bold ml-1">WELCOME_MESSAGE</span>
                  <button onClick={handleAIWelcome} disabled={generating} className="text-[9px] font-black text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-all">
                    {generating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    GENERATE WITH AI
                  </button>
                </div>
                <textarea 
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs h-24 resize-none focus:border-indigo-500 transition-all outline-none"
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig({...config, welcomeMessage: e.target.value})}
                />
              </div>
            </div>
          </section>

   {/* VISUALS SECTION - PRO DESIGNER UI */}
<section className="space-y-4 pt-4 border-t border-white/5">
  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
    <Palette size={14} /> UI Chromatics
  </label>
  <div className="grid grid-cols-1 gap-3">
    {[
      { label: 'Primary Theme', key: 'primaryColor' },
      { label: 'User Bubble', key: 'userBubbleBg' },
      { label: 'Bot Bubble', key: 'botBubbleBg' },
      { label: 'Chat Background', key: 'chatBg' }
    ].map((item) => (
      <div key={item.key} className="flex items-center gap-3 bg-white/5 p-2 pr-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
        
        {/* THE "CUSTOM" LOOKING SWATCH */}
        <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10">
          <input 
            type="color" 
            value={config[item.key]} 
            onChange={(e) => setConfig({...config, [item.key]: e.target.value})}
            className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer border-none opacity-0 z-10"
          />
          {/* This div shows the actual color but looks like a sleek UI element */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ backgroundColor: config[item.key] }}
          />
        </div>

        {/* HEX INPUT ENGINE */}
        <div className="flex-1 flex flex-col">
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight leading-none mb-1">
            {item.label}
          </span>
          <div className="flex items-center">
            <span className="text-gray-500 text-xs font-mono mr-1">#</span>
            <input 
              type="text"
              value={config[item.key].replace('#', '')}
              onChange={(e) => {
                const hex = e.target.value;
                if (/^[0-9A-Fa-f]{0,6}$/.test(hex)) {
                  setConfig({...config, [item.key]: `#${hex}`});
                }
              }}
              className="bg-transparent text-sm font-mono uppercase outline-none text-indigo-400 w-full tracking-widest"
              maxLength={6}
            />
          </div>
        </div>

        {/* SMALL VISUAL INDICATOR */}
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: config[item.key] }} />
      </div>
    ))}
  </div>
</section>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/10 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <><ShieldCheck size={18} /> Deploy Changes</>}
          </button>
        </div>
      </div>

      {/* PREVIEW WINDOW */}
      <div className="flex-1 bg-black flex items-center justify-center relative">
        <div className="absolute top-8 flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Sandbox_Preview_Active</span>
        </div>
        <iframe ref={iframeRef} srcDoc={widgetPreviewHtml} className="w-full h-full border-none" />
      </div>
    </div>
  );
};

export default LabTab;