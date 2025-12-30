import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Shield, Key, Bell, 
  ArrowLeft, Save, Trash2, ArrowUpRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = ({ user }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize state with props or empty strings to prevent "blank" screens
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Update local state when the user prop arrives
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    // Add your update fetch here later
    setTimeout(() => setIsSaving(false), 1000);
  };

  // If no user is passed, show a loading state instead of a blank screen
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-indigo-500 font-black animate-pulse uppercase tracking-widest text-xs">
          Initializing Session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-16">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Hub</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[8px] font-black uppercase text-gray-500">Identity Status</div>
            <div className="text-[10px] font-black italic uppercase text-emerald-500">Verified</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black italic text-sm border border-white/10 shadow-lg shadow-indigo-600/20">
            {formData.firstName?.[0] || '?'}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none mb-4">
            User <span className="text-indigo-600">Settings</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            System ID: <span className="text-white">{user?._id || 'N/A'}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-2">
            <TabItem icon={User} label="Profile" active />
            <TabItem icon={Shield} label="Security" />
            <TabItem icon={Bell} label="Notifications" />
          </div>

          <div className="md:col-span-2 space-y-8">
            <section className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
              <div className="flex items-center gap-3 text-indigo-500 mb-2">
                <User size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Details</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <InputGroup 
                  label="First Name" 
                  value={formData.firstName} 
                  onChange={(v) => setFormData(prev => ({...prev, firstName: v}))}
                />
                <InputGroup 
                  label="Last Name" 
                  value={formData.lastName} 
                  onChange={(v) => setFormData(prev => ({...prev, lastName: v}))}
                />
              </div>

              <InputGroup 
                label="Email Address" 
                value={formData.email} 
                disabled
              />

              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-3"
                >
                  {isSaving ? "Syncing..." : "Save Changes"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helpers
const TabItem = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
    active ? 'bg-indigo-600/10 text-white border border-indigo-600/20' : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
  }`}>
    <Icon size={16} className={active ? 'text-indigo-500' : ''} />
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const InputGroup = ({ label, value, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input 
      type="text" 
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-30"
    />
  </div>
);

export default SettingsPage;