import React, { useEffect } from 'react';

const LabTab = ({ settings, updateSettings, widgetId, fetching }) => {

  // If we are fetching and have no data, show a spinner. 
  // Otherwise, if we have settings (even defaults), show the Lab.
  if (fetching && !settings.botName) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Waking up the server...</p>
      </div>
    );
  }

  // Send settings to the widget every time they change
  useEffect(() => {
    window.postMessage({
      type: 'WIDGET_CONFIG_UPDATE',
      config: settings
    }, '*');
  }, [settings]);

  const handleChange = (key, value) => {
    updateSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-full w-full bg-[#0a0a0a]">
      {/* LEFT: SETTINGS SIDEBAR */}
      <div className="w-80 h-full border-r border-white/10 bg-[#050505] p-8 overflow-y-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">The Lab</h2>
          <div className="h-1 w-12 bg-indigo-500"></div>
        </div>

        {/* Input: Bot Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Assistant Identity</label>
          <input 
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
            value={settings.botName}
            onChange={(e) => handleChange('botName', e.target.value)}
          />
        </div>

        {/* Input: Primary Color */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Brand Color</label>
          <div className="flex gap-4">
            <input 
              type="color"
              className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
            />
            <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-xs flex items-center">
              {settings.primaryColor}
            </div>
          </div>
        </div>

        {/* Bubble Colors */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-bold uppercase">User Bubble</span>
            <input type="color" value={settings.userBubbleBg} onChange={(e) => handleChange('userBubbleBg', e.target.value)} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-bold uppercase">Bot Bubble</span>
            <input type="color" value={settings.botBubbleBg} onChange={(e) => handleChange('botBubbleBg', e.target.value)} />
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black italic uppercase p-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          Save Changes
        </button>
      </div>

      {/* RIGHT: PREVIEW AREA */}
      <div className="flex-1 h-full flex items-center justify-center relative bg-[#050505]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="z-10 flex flex-col items-center">
          <div className="mb-10 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Live Simulation</span>
          </div>

          {/* THE CUSTOM ELEMENT */}
          <div className="scale-110">
            <ai-chat-widget widget-id={widgetId}></ai-chat-widget>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTab;