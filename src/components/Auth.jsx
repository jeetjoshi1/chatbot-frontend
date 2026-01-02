import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Zap, ArrowRight, AlertCircle, Check, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [step, setStep] = useState('auth'); 
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const requirements = [
    { label: "MIN 6 CHARACTERS", test: (pw) => pw.length >= 6 },
    { label: "NUMERIC DIGIT", test: (pw) => /\d/.test(pw) },
    { label: "SPECIAL CHAR", test: (pw) => /[!@#$%^&*]/.test(pw) },
  ];

  useEffect(() => {
    if (isLogin || step === 'verify') { setStrength(0); return; }
    const score = requirements.filter(req => req.test(password)).length;
    setStrength(score);
  }, [password, isLogin, step]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && index < 5) { inputRefs.current[index + 1].focus(); }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) { inputRefs.current[index - 1].focus(); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLogin && strength < 3) { setError("SECURITY REQUIREMENTS NOT MET"); return; }
    if(!isLogin && !firstName || !lastName) { setError("INCOMPLETE CREDENTIALS"); return; }
    if(password !== confirmPassword && !isLogin) { setError("PASSWORDS DO NOT MATCH"); return; }

    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('widgetId', data.widgetId);
          navigate('/dashboard');
        } else { setStep('verify'); }
      } else { setError(data.error || "INITIALIZATION FAILED"); }
    } catch (err) { setError("CONNECTION TERMINATED"); } finally { setLoading(false); }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    const finalCode = otp.join("");
    if (finalCode.length < 6) return setError("INCOMPLETE CREDENTIALS");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: finalCode }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('widgetId', data.widgetId);
        navigate('/dashboard');
      } else { setError(data.error || "INVALID KEY"); }
    } catch (err) { setError("VERIFICATION FAILED"); } finally { setLoading(false); }
  };

  return (
   <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
  {/* Visual background sync with Landing/Dashboard */}
  <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
  
  <motion.div layout className="w-full max-w-[440px] bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem] z-10 shadow-2xl relative">
    <AnimatePresence mode="wait">
      {step === 'auth' ? (
        <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <div className="flex justify-start mb-10">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
              <Zap size={24} fill="white" />
            </div>
          </div>

          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">
            {isLogin ? 'SYSTEM LOGIN' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
            {isLogin ? 'PROVIDE ACCESS CREDENTIALS' : 'JOIN THE NEXT GEN OF AI'}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* NEW: NAME FIELDS (SIGNUP ONLY) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="relative group">
                  <User className="absolute left-4 top-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600/50 transition-all font-bold text-[11px]" 
                    placeholder="FIRST_NAME" 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    className="w-full bg-black border border-white/5 rounded-2xl py-4 px-4 outline-none focus:border-indigo-600/50 transition-all font-bold text-[11px]" 
                    placeholder="LAST_NAME" 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="email" 
                className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600/50 transition-all font-bold text-sm" 
                placeholder="EMAIL_ADDRESS" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="password" 
                value={password} 
                className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600/50 transition-all font-bold text-sm" 
                placeholder="PASSWORD" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {/* NEW: CONFIRM PASSWORD (SIGNUP ONLY) */}
            {!isLogin && (
              <div className="relative group animate-in slide-in-from-top-2 duration-400">
                <ShieldCheck className="absolute left-4 top-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600/50 transition-all font-bold text-sm" 
                  placeholder="CONFIRM_PASSWORD" 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
            )}

            {!isLogin && password.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex gap-1.5 h-1">
                  {[1, 2, 3].map((stepIdx) => (
                    <div 
                      key={stepIdx} 
                      className={`h-full flex-1 rounded-full transition-all duration-700 ${stepIdx <= strength ? 'bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-white/5'}`} 
                    />
                  ))}
                </div>
                <div className="space-y-1.5">
                  {requirements.map((req, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[9px] font-black italic tracking-widest ${req.test(password) ? 'text-indigo-400' : 'text-gray-700'}`}>
                      {req.test(password) ? <Check size={10} strokeWidth={4} /> : <div className="w-1 h-1 rounded-full bg-current" />} {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <AlertCircle size={14}/> {error}
              </div>
            )}

            <button 
              disabled={loading} 
              className="w-full bg-white text-black hover:bg-indigo-600 hover:text-white py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-white/5"
            >
              {loading ? 'INITIALIZING...' : isLogin ? 'SIGN_IN' : 'GET_STARTED'} 
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="mt-8 w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-indigo-400 transition-colors italic">
            {isLogin ? "NEW_OPERATOR? SIGN_UP" : "EXISTING_USER? LOG_IN"}
          </button>
        </motion.div>
      ) : (
        <motion.div key="verify" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
          {/* Verification section remains unchanged */}
          <div className="flex justify-center mb-10">
            <div className="bg-indigo-600/10 p-4 rounded-2xl border border-indigo-600/20">
              <ShieldCheck className="text-indigo-600" size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">VERIFY_IDENTITY</h2>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] text-center mb-10 px-4">
            CODE DISPATCHED TO: <span className="text-white">{email}</span>
          </p>

          <form onSubmit={handleVerifySubmit} className="space-y-10">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-16 bg-black border border-white/5 rounded-xl text-center text-2xl font-black italic focus:border-indigo-600 outline-none transition-all text-indigo-500"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>
            {error && <div className="text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}
            <button 
              disabled={loading} 
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'VERIFYING...' : 'AUTHORIZE_ACCESS'}
            </button>
          </form>
          <button onClick={() => setStep('auth')} className="mt-8 w-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-white transition-colors">RETURN_TO_SIGNUP</button>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
</div>
  );
};

export default Auth;