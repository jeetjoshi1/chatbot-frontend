import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Activity, Users, Globe } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-10 max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="text-white font-black text-2xl flex items-center gap-3 italic uppercase tracking-tighter">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20">
            <Zap size={22} fill="white"/>
          </div>
          Gen.AI
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/auth')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Login</button>
          <button 
            onClick={() => navigate('/auth')} 
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block h-1 w-20 bg-indigo-600 mb-8 rounded-full"></div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
              Future <br /> 
              <span className="text-indigo-600">On-Site.</span>
            </h1>
            <p className="text-gray-500 text-lg font-bold italic uppercase tracking-tight max-w-md mb-10 leading-tight">
              Deploy high-performance AI agents in seconds. No fluff. Just raw integration.
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              className="group bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-widest text-sm transition-all flex items-center gap-3 hover:bg-indigo-500 hover:text-white"
            >
              Initialize Workspace
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* MOCKUP / STATS PREVIEW */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative z-10">
              <div className="flex gap-4 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
              </div>
              
              <div className="space-y-6">
                <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 text-indigo-500 mb-2">
                    <Activity size={16}/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Live Engine</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '70%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                        <Users size={20} className="text-emerald-400 mb-2"/>
                        <div className="text-2xl font-black italic uppercase tracking-tighter">1.2k</div>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                        <Globe size={20} className="text-yellow-400 mb-2"/>
                        <div className="text-2xl font-black italic uppercase tracking-tighter">0.1s</div>
                    </div>
                </div>
              </div>
            </div>
            {/* Background Glow for Mockup */}
            <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </main>

      {/* FOOTER STRIP */}
      <footer className="border-t border-white/5 py-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex gap-12">
              <Stat mini label="Active Bots" val="8.4k" />
              <Stat mini label="Uptime" val="99.9%" />
              <Stat mini label="Requests" val="12M" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">© 2025 GEN.AI SYSTEMS</p>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ label, val }) => (
  <div>
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-black italic uppercase tracking-tighter">{val}</p>
  </div>
);

export default Landing;