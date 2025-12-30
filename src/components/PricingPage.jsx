import React, { useState } from 'react';
import { Check, Zap, Sparkles, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';


const PricingPage = () => {
    const [loadingPlan, setLoadingPlan] = useState(null);

    const tiers = [
        { name: 'Free', price: '$0', priceId: null, icon: Zap, color: 'text-gray-400', features: ['Basic AI', 'Standard widget'] },
        { 
            name: 'Pro', 
            price: '$29', 
            priceId: 'price_1SiiIo4F6Vfno7AhSo9jc4a3', // Use your REAL Pro ID from Dashboard
            icon: Sparkles, 
            color: 'text-indigo-400', 
            popular: true, 
            features: ['10,000 Chats', 'Custom Branding'] 
        },
        { 
            name: 'Enterprise', 
            price: '$99', 
            priceId: 'price_1Siq2G4F6Vfno7Ah6vWpbdlf', 
            icon: ShieldCheck, 
            color: 'text-emerald-400', 
            features: ['100,000 Chats', 'API Access'] 
        }
    ];

    const handleUpgrade = async (plan) => {
        if (!plan.priceId) return alert("You are already on this plan.");
        
        setLoadingPlan(plan.name);
        const token = (localStorage.getItem('token') || '').replace(/['"]+/g, '').trim();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ priceId: plan.priceId })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe
            } else {
                alert("Error starting checkout");
            }
        } catch (err) {
            alert("Connection error");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-20">
                    <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-2 text-gray-500 hover:text-white">
                        <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase">Back</span>
                    </button>
                    <h1 className="text-4xl font-black italic uppercase italic">Billing Center</h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`bg-[#0a0a0a] border ${tier.popular ? 'border-indigo-500' : 'border-white/5'} rounded-[3rem] p-12 flex flex-col`}>
                            <h3 className="text-2xl font-black italic uppercase">{tier.name}</h3>
                            <div className="mb-10"><span className="text-6xl font-black">{tier.price}</span></div>
                            <ul className="space-y-4 mb-12 flex-1">
                                {tier.features.map(f => <li key={f} className="flex gap-2 text-xs font-bold text-gray-400"><Check size={14} className="text-indigo-500"/>{f}</li>)}
                            </ul>
                            <button 
                                onClick={() => handleUpgrade(tier)}
                                disabled={loadingPlan !== null}
                                className={`w-full py-5 rounded-2xl font-black uppercase italic transition-all ${tier.popular ? 'bg-indigo-600' : 'bg-white/5'}`}
                            >
                                {loadingPlan === tier.name ? <Loader2 className="animate-spin mx-auto"/> : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;