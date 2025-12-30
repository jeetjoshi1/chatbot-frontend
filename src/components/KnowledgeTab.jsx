import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Settings2, Globe, Building2, Save, Trash2, Loader2, 
  ChevronRight, Edit3, Database, FileCode, ShieldAlert, 
  CheckCircle2, X, ChevronDown, Terminal, AlertTriangle
} from 'lucide-react';

const PERSONA_PRESETS = [
  { id: 'corporate', name: 'Executive', icon: '💼', tag: 'Professional', sample: "How can I assist with your inquiry today?", instructions: "Professional, concise, and formal corporate assistant." },
  { id: 'legal', name: 'Scholar', icon: '⚖️', tag: 'Professional', sample: "Based on the documentation provided...", instructions: "Objective, detail-oriented, and highly structured tone." },
  { id: 'support', name: 'Support', icon: '🤝', tag: 'Professional', sample: "I'd be happy to help you with that!", instructions: "Warm, empathetic, and solution-focused customer service tone." },
  { id: 'clown', name: 'Clown', icon: '🤡', tag: 'Goofy', sample: "Honk! My rubber chicken has the answer!", instructions: "High-energy, humorous circus clown persona." },
  { id: 'pirate', name: 'Pirate', icon: '🏴‍☠️', tag: 'Goofy', sample: "Ahoy! That be in the database, matey!", instructions: "Salty sea captain persona using pirate slang." }
];

const KnowledgeTab = ({ widgetId }) => {
  const [activeView, setActiveView] = useState('simple'); 
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  // Data States
  const [docs, setDocs] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(PERSONA_PRESETS[0]);
  const [editingId, setEditingId] = useState(null);
  const [editBuffer, setEditBuffer] = useState({ title: '', content: '' });

  useEffect(() => { if (widgetId) fetchDocs(); }, [widgetId]);

  const fetchDocs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/knowledge/${widgetId}`);
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Fetch failed"); }
  };
  
  const handleSync = async () => {
    if (!websiteUrl && !companyName) {
        return showStatus('error', 'Enter a URL or Company Name');
    }

    setLoading(true);
    try {
        // Step A: If there's a URL, trigger the Crawl
        if (websiteUrl) {
            const crawlRes = await fetch(`${import.meta.env.VITE_API_URL}api/knowledge/crawl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ widgetId, url: websiteUrl })
            });
            if (!crawlRes.ok) throw new Error('Crawl failed');
        }

        // Step B: If there's a Company Name, save it as a basic info block
        if (companyName) {
            await fetch(`${import.meta.env.VITE_API_URL}api/knowledge/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    widgetId, 
                    title: "Company Identity", 
                    content: `The company name is ${companyName}.` 
                })
            });
        }

        showStatus('success', 'Knowledge Absorbed!');
        setWebsiteUrl(""); // Clear inputs
        setCompanyName("");
        fetchDocs(); // Refresh the list in the Advanced tab
    } catch (e) {
        showStatus('error', 'Sync Failed: check URL');
    } finally {
        setLoading(false);
    }
};






  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
  };

  const updatePersona = async (persona) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}api/widget/${widgetId}/persona`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaInstructions: persona.instructions })
      });
      setSelectedPersona(persona);
      setIsPersonaOpen(false);
      showStatus('success', `Tone: ${persona.name}`);
    } catch (e) { showStatus('error', 'Update Failed'); }
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/knowledge/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBuffer)
      });
      if (res.ok) {
        setEditingId(null);
        fetchDocs();
        showStatus('success', 'Entry updated');
      }
    } catch (e) { showStatus('error', 'Update failed'); }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm("Permanent delete this module?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}api/knowledge/delete/${id}`, { method: 'DELETE' });
    setDocs(docs.filter(d => d._id !== id));
    showStatus('success', 'Module removed');
  };

  return (
    <div className="p-12 max-w-5xl mx-auto text-white">
      
      {/* Toast Notification */}
      {status.msg && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] animate-in slide-in-from-right ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
        }`}>
          {status.msg}
        </div>
      )}

      {/* Advanced Warning Gate */}
      {showWarning && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-orange-500/20 max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl">
            <AlertTriangle size={32} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-black uppercase italic text-orange-500 mb-2">Advanced Access</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">Caution: Modifying raw data modules directly affects the AI's logic and response accuracy.</p>
            <div className="space-y-3">
                <button onClick={() => { setActiveView('advanced'); setShowWarning(false); }} className="w-full py-4 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-orange-600/20">Proceed to Data</button>
                <button onClick={() => setShowWarning(false)} className="w-full py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-20 bg-white/[0.03] w-fit p-1.5 rounded-2xl border border-white/5 mx-auto">
        <button onClick={() => setActiveView('simple')} className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'simple' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}>
          <Sparkles size={14} /> Basic Setup
        </button>
        <button onClick={() => setShowWarning(true)} className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'advanced' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-500 hover:text-white'}`}>
          <Settings2 size={14} /> Advanced
        </button>
      </div>

      {activeView === 'simple' ? (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 text-center">Bot <span className="text-indigo-500">Identity.</span></h1>
          <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[9px] mb-14 text-center text-pretty px-12">Configure core data and personality in one place.</p>
          
          <div className="space-y-8">
            <SimpleInput label="Company Name" icon={Building2} value={companyName} onChange={setCompanyName} placeholder="e.g. Acme Corp" />
            <SimpleInput label="Website Domain" icon={Globe} value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://example.com" />
            
            {/* Persona Dropdown */}
            <div className="space-y-4 relative">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] ml-6 italic">AI Persona</label>
              <button 
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{selectedPersona.icon}</span>
                  <div className="text-left font-black uppercase text-[10px] tracking-widest text-white">{selectedPersona.name}</div>
                </div>
                <ChevronDown size={18} className={`text-gray-700 transition-transform ${isPersonaOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPersonaOpen && (
                <div className="absolute top-[110%] left-0 w-full bg-[#080808] border border-white/10 rounded-[2rem] overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
                  {PERSONA_PRESETS.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => updatePersona(p)} 
                        className="w-full p-6 flex items-center justify-between hover:bg-white/[0.03] border-b border-white/[0.02] last:border-0 transition-colors group"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                            <div className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white transition-colors">{p.name}</div>
                            <div className="text-[8px] text-gray-600 font-bold italic truncate max-w-[200px]">"{p.sample}"</div>
                        </div>
                      </div>
                      <span className={`text-[7px] px-2 py-0.5 rounded-full border font-black uppercase ${p.tag === 'Professional' ? 'border-indigo-500/50 text-indigo-500' : 'border-orange-500/50 text-orange-500'}`}>{p.tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleSync} disabled={loading} className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl">
              {loading ? <Loader2 className="animate-spin" /> : 'Sync Knowledge'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* Advanced Data Management View */
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8 px-4">
            <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-orange-500">Data Management</h2>
                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Database size={12}/> {docs.length} Active Knowledge Blocks
                </div>
            </div>
          </div>

          <div className="grid gap-6">
            {docs.map(doc => (
              <div key={doc._id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-orange-500/20 transition-all">
                {editingId === doc._id ? (
                  <div className="p-10 space-y-6">
                    <div className="flex items-center gap-2 text-orange-500">
                        <Terminal size={14}/> <span className="text-[10px] font-black uppercase tracking-widest">Editing Entry</span>
                    </div>
                    <input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-orange-500 transition-all" value={editBuffer.title} onChange={e => setEditBuffer({...editBuffer, title: e.target.value})} />
                    <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-gray-400 text-xs font-mono min-h-[150px] outline-none focus:border-orange-500 leading-relaxed" value={editBuffer.content} onChange={e => setEditBuffer({...editBuffer, content: e.target.value})} />
                    <div className="flex gap-3">
                      <button onClick={() => saveEdit(doc._id)} className="px-10 py-4 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-500">Save Changes</button>
                      <button onClick={() => setEditingId(null)} className="px-10 py-4 bg-white/5 text-gray-500 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 flex justify-between items-start gap-10">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-orange-500 transition-colors">
                            <FileCode size={18} />
                        </div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-gray-300">{doc.title}</h4>
                      </div>
                      <p className="text-gray-600 text-[12px] font-mono italic bg-black/20 p-4 rounded-xl border border-white/5 leading-relaxed">"{doc.content}"</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setEditingId(doc._id); setEditBuffer({title: doc.title, content: doc.content}) }} className="p-5 bg-white/5 rounded-2xl hover:bg-orange-600 hover:text-white transition-all"><Edit3 size={20}/></button>
                      <button onClick={() => deleteDoc(doc._id)} className="p-5 bg-white/5 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SimpleInput = ({ label, icon: Icon, value, onChange, placeholder }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] ml-6 italic">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-indigo-500 transition-colors shadow-xl" size={20} />
      <input 
        className="w-full bg-white/[0.02] border border-white/5 p-7 pl-20 rounded-[2.5rem] outline-none focus:border-indigo-500/40 focus:bg-indigo-500/[0.01] transition-all font-bold text-white placeholder:text-gray-900 shadow-inner" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
      />
    </div>
  </div>
);

export default KnowledgeTab;