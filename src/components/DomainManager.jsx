import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Edit3, Check, X, ShieldCheck } from 'lucide-react';

const DomainManager = ({ currentDomains, onSave }) => {
    const [domains, setDomains] = useState([]);
    const [newDomain, setNewDomain] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Sync local state with Database props
    useEffect(() => {
        if (Array.isArray(currentDomains)) {
            setDomains(currentDomains);
        }
    }, [currentDomains]);

    const sanitize = (url) => {
        try {
            const hasProtocol = /^https?:\/\//i.test(url);
            const urlToParse = hasProtocol ? url : `http://${url}`;
            const { origin } = new URL(urlToParse);
            return origin;
        } catch (e) { 
            return url.trim().toLowerCase(); 
        }
    };

    const handleAdd = () => {
        const clean = sanitize(newDomain);
        if (clean && !domains.includes(clean)) {
            const updated = [...domains, clean];
            setDomains(updated);
            onSave(updated);
            setNewDomain('');
        }
    };

    const handleRemove = (index) => {
        const updated = domains.filter((_, i) => i !== index);
        setDomains(updated);
        onSave(updated);
    };

    const saveEdit = (index) => {
        const updated = [...domains];
        updated[index] = sanitize(editValue);
        setDomains(updated);
        onSave(updated);
        setEditingIndex(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ADD DOMAIN CARD */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] shadow-2xl shadow-black/50">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
                        <ShieldCheck size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter text-white">Security Protocol</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Authorized Origins Only</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <input 
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        placeholder="HTTPS://YOURDOMAIN.COM"
                        className="flex-1 bg-black border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white placeholder:text-gray-800 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest"
                    />
                    <button 
                        onClick={handleAdd}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/40 flex items-center justify-center"
                    >
                        <Plus size={22} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* DOMAINS LIST */}
            <div className="space-y-3">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4 italic">
                    Active Authorizations — {domains.length}
                </p>
                
                {domains.map((domain, index) => (
                    <div 
                        key={index} 
                        className="group flex items-center justify-between bg-[#0c0c0c] border border-white/5 p-2 pl-6 rounded-3xl hover:border-indigo-500/30 transition-all duration-300"
                    >
                        {editingIndex === index ? (
                            <div className="flex-1 flex gap-2 py-1 mr-4">
                                <input 
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(index)}
                                    className="flex-1 bg-black border border-indigo-500/50 rounded-xl px-4 py-2 text-[11px] font-bold text-white outline-none uppercase tracking-widest"
                                />
                                <button onClick={() => saveEdit(index)} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg">
                                    <Check size={18}/>
                                </button>
                                <button onClick={() => setEditingIndex(null)} className="p-2 text-gray-500 hover:bg-white/5 rounded-lg">
                                    <X size={18}/>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 py-4 ml-2">
                                    <Globe size={16} className="text-indigo-500/50 group-hover:text-indigo-400 transition-colors" />
                                    <span className="text-[12px] font-black uppercase tracking-tighter text-gray-300 italic">
                                        {domain.replace(/^https?:\/\//, '')}
                                    </span>
                                </div>

                                <div className="flex gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => { setEditingIndex(index); setEditValue(domain); }}
                                        className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                        title="Edit Domain"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleRemove(index)}
                                        className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                        title="Delete Domain"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {domains.length === 0 && (
                    <div className="py-20 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center grayscale opacity-20">
                        <Globe size={40} className="mb-4 text-gray-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Firewall Inactive</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DomainManager;