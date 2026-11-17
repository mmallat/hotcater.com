import React, { useState, useEffect } from 'react';

// --- DEFAULT SEED DATA ---
const INITIAL_PATENTS = [
  {
    id: 'pat-1',
    patentNumberMasked: 'US-11,842,910-B2',
    patentNumberReal: 'US-11,842,910-B2',
    title: 'Autonomous Thermal Drone Routing for Commercial Roof Inspections',
    category: 'In Production',
    ownerName: 'Marcus Vance (Vance Aerospace Tech)',
    ownerEmail: 'marcus@hotcater.com',
    ownerId: 'owner-1',
    description: 'System and method utilizing multi-spectral thermal cameras and real-time edge AI to map micro-fractures in commercial membrane roofing without manual calibration.',
    tier: 'Utility',
    unlockFee: 49,
    askingPrice: 185000,
    licenseRoyalty: '5% gross sales',
    leaseMonthly: 3200,
    illustrationType: 'drone',
    createdDate: '2026-01-14'
  },
  {
    id: 'pat-2',
    patentNumberMasked: 'US-10,431,288-A1',
    patentNumberReal: 'US-10,431,288-A1',
    title: 'Solid-State Zinc-Air Battery Cell with Self-Healing Electrolyte Membrane',
    category: 'Dormant',
    ownerName: 'Dr. Elena Rostova',
    ownerEmail: 'elena@hotcater.com',
    ownerId: 'owner-2',
    description: 'High-density energy storage architecture incorporating a self-healing polymer matrix preventing dendritic short-circuits across 5,000 deep cycles.',
    tier: 'Composition',
    unlockFee: 85,
    askingPrice: 420000,
    licenseRoyalty: '7.5% net revenue',
    leaseMonthly: 7500,
    illustrationType: 'battery',
    createdDate: '2026-02-03'
  },
  {
    id: 'pat-3',
    patentNumberMasked: 'US-12,014,772-B2',
    patentNumberReal: 'US-12,014,772-B2',
    title: 'Biometric Multi-Factor Authentication via Sub-Dermal Vein Acoustic Resonance',
    category: 'In Production',
    ownerName: 'Apex IP Holdings LLC',
    ownerEmail: 'legal@hotcater.com',
    ownerId: 'owner-3',
    description: 'Non-optical biometric scanner emitting low-frequency acoustic pulses to verify vascular hemoglobin density, thwarting synthetic replicas.',
    tier: 'System & Method',
    unlockFee: 120,
    askingPrice: 650000,
    licenseRoyalty: '6% net revenue',
    leaseMonthly: 11000,
    illustrationType: 'biometric',
    createdDate: '2026-03-10'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    patentId: 'pat-1',
    sender: 'Sarah Jenkins (Customer)',
    recipient: 'Marcus Vance',
    text: 'Hello Marcus, we unlocked your drone routing patent and are very interested in evaluating the telemetry data room.',
    timestamp: '2026-03-20 14:22'
  }
];

const INITIAL_DEALS = [
  {
    id: 'deal-1',
    patentId: 'pat-1',
    patentTitle: 'Autonomous Thermal Drone Routing for Commercial Roof Inspections',
    ownerName: 'Marcus Vance',
    ownerEmail: 'marcus@hotcater.com',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah@hotcater.com',
    type: 'Lease-to-Buy',
    status: 'Pending Owner Approval',
    terms: '$3,200/month lease with $185,000 buyout option credited at 70%.',
    escrowAmount: 3200,
    escrowStatus: 'Funded in Escrow (Holding)',
    date: '2026-03-21',
    counterOffer: null
  }
];

export default function PatentVault() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hc_current_user');
      return saved ? JSON.parse(saved) : { name: 'Sarah Jenkins', email: 'sarah@hotcater.com', role: 'customer' };
    } catch {
      return { name: 'Sarah Jenkins', email: 'sarah@hotcater.com', role: 'customer' };
    }
  });

  const [patents, setPatents] = useState(() => {
    try {
      const saved = localStorage.getItem('hc_patents');
      return saved ? JSON.parse(saved) : INITIAL_PATENTS;
    } catch {
      return INITIAL_PATENTS;
    }
  });

  const [unlockedPatentIds, setUnlockedPatentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hc_unlocked');
      return saved ? JSON.parse(saved) : ['pat-1'];
    } catch {
      return ['pat-1'];
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('hc_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('hc_deals');
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  const [activeTab, setActiveTab] = useState('browse');
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealType, setDealType] = useState('License');
  const [showDnsModal, setShowDnsModal] = useState(false);
  const [toast, setToast] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('In Production');
  const [newDescription, setNewDescription] = useState('');
  const [newTier, setNewTier] = useState('Utility');
  const [newUnlockFee, setNewUnlockFee] = useState(50);
  const [newAskingPrice, setNewAskingPrice] = useState(150000);
  const [newRoyalty, setNewRoyalty] = useState('5% gross');
  const [newLeaseMonthly, setNewLeaseMonthly] = useState(2500);
  const [newIllustrationType, setNewIllustrationType] = useState('drone');

  const [autoPatentNumber, setAutoPatentNumber] = useState('');
  const [autoConsent, setAutoConsent] = useState(false);
  const [chatMessageText, setChatMessageText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('hc_current_user', JSON.stringify(currentUser));
      localStorage.setItem('hc_patents', JSON.stringify(patents));
      localStorage.setItem('hc_unlocked', JSON.stringify(unlockedPatentIds));
      localStorage.setItem('hc_messages', JSON.stringify(messages));
      localStorage.setItem('hc_deals', JSON.stringify(deals));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [currentUser, patents, unlockedPatentIds, messages, deals]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const resetDemoData = () => {
    try {
      localStorage.clear();
      setPatents(INITIAL_PATENTS);
      setUnlockedPatentIds(['pat-1']);
      setMessages(INITIAL_MESSAGES);
      setDeals(INITIAL_DEALS);
      setCurrentUser({ name: 'Sarah Jenkins', email: 'sarah@hotcater.com', role: 'customer' });
      showToast('Demo data restored to default state.');
    } catch (e) {
      console.error('Reset error:', e);
    }
  };

  const renderIllustration = (type) => {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-lg flex items-center justify-center p-4 border border-slate-700 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        {type === 'drone' && (
          <svg className="w-24 h-24 text-indigo-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M2 12h20M4 4l16 16M4 20l16-16" strokeOpacity="0.3"/>
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="12" cy="3" r="2" /><circle cx="21" cy="12" r="2" /><circle cx="12" cy="21" r="2" /><circle cx="3" cy="12" r="2" />
          </svg>
        )}
        {type === 'battery' && (
          <svg className="w-24 h-24 text-emerald-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="6" y="4" width="12" height="16" rx="2" />
            <path d="M10 2h4M10 10h4M10 14h4" />
          </svg>
        )}
        {type === 'biometric' && (
          <svg className="w-24 h-24 text-cyan-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a10 10 0 0110 10c0 5-4 8-6 10M12 6a6 6 0 016 6c0 3-2 5-3 6M12 10a2 2 0 012 2c0 1-.5 2-1 2" />
          </svg>
        )}
        {type !== 'drone' && type !== 'battery' && type !== 'biometric' && (
          <svg className="w-24 h-24 text-amber-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        )}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/85 backdrop-blur text-xs text-slate-300 rounded border border-slate-700">
          Schematic Blueprint #SYS-4892
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-20">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400 animate-bounce">
          <span className="font-medium">{toast}</span>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
              PV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">HotCater PatentVault</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">hotcater.com</span>
              </div>
              <p className="text-xs text-slate-400">Secure IP Exchange, Escrow & Licensing Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDnsModal(true)}
              className="hidden md:flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              DNS & Deployment
            </button>
            <button 
              onClick={resetDemoData}
              className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-rose-950/40 text-rose-300 px-3 py-1.5 rounded-lg border border-rose-900/50 transition"
            >
              Reset Demo
            </button>
            <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
              <button 
                onClick={() => {
                  setCurrentUser({ name: 'Sarah Jenkins', email: 'sarah@hotcater.com', role: 'customer' });
                  showToast('Switched to Customer View: Sarah Jenkins');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${currentUser.role === 'customer' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Customer Mode
              </button>
              <button 
                onClick={() => {
                  setCurrentUser({ name: 'Marcus Vance', email: 'marcus@hotcater.com', role: 'owner' });
                  showToast('Switched to Patent Owner Mode: Marcus Vance');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${currentUser.role === 'owner' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Owner Portal
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-slate-900/60 border-b border-slate-800 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
          <button onClick={() => setActiveTab('browse')} className={`py-3.5 border-b-2 text-sm font-medium transition ${activeTab === 'browse' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            Browse IP Marketplace ({patents.length})
          </button>
          <button onClick={() => setActiveTab('inventor')} className={`py-3.5 border-b-2 text-sm font-medium transition ${activeTab === 'inventor' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            Inventor Portal & Auto-Import
          </button>
          <button onClick={() => setActiveTab('contracts')} className={`py-3.5 border-b-2 text-sm font-medium transition ${activeTab === 'contracts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            Escrow & Contracts ({deals.length})
          </button>
          <button onClick={() => setActiveTab('forum')} className={`py-3.5 border-b-2 text-sm font-medium transition ${activeTab === 'forum' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
            Inventor Q&A Forum
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'browse' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 p-8 rounded-2xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-mono rounded-full border border-indigo-500/30">CONFIDENTIAL IP ESCROW</span>
                <h1 className="text-3xl font-bold mt-2 tracking-tight">Discover & Acquire Verified Patents</h1>
                <p className="text-slate-400 mt-1 max-w-2xl">Browse patents in production or dormant state securely on hotcater.com.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patents.map((pat) => {
                const isUnlocked = unlockedPatentIds.includes(pat.id);
                return (
                  <div key={pat.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-lg">
                    <div>
                      {renderIllustration(pat.illustrationType)}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pat.category === 'In Production' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {pat.category}
                          </span>
                          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {isUnlocked ? pat.patentNumberReal : 'US-██,███,███-B2'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold leading-snug">{pat.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-3">{pat.description}</p>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      {isUnlocked ? (
                        <button onClick={() => { setSelectedPatent(pat); setShowDealModal(true); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition text-sm">
                          Open Deal / Data Room
                        </button>
                      ) : (
                        <button onClick={() => { setSelectedPatent(pat); setShowUnlockModal(true); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 rounded-xl transition border border-slate-700 text-sm">
                          Unlock Patent (${pat.unlockFee})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'inventor' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-bold">Manual Patent Listing</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Patent Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200" />
                <textarea rows="2" placeholder="Description..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"></textarea>
                <button onClick={() => {
                  if (!newTitle) return;
                  setPatents([{ id: `pat-${Date.now()}`, patentNumberMasked: 'US-999,999-B2', patentNumberReal: 'US-999,999-B2', title: newTitle, category: 'In Production', ownerName: currentUser.name, ownerEmail: currentUser.email, description: newDescription, unlockFee: 50, askingPrice: 150000, illustrationType: 'drone' }, ...patents]);
                  setNewTitle(''); setNewDescription(''); showToast('Published!');
                }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm">Publish</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Active Deals</h1>
            {deals.map(d => (
              <div key={d.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-lg">{d.patentTitle}</h3>
                <p className="text-xs text-slate-400">Status: {d.status}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold">Community Q&A Forum</h2>
            <p className="text-sm text-slate-400 mt-2">Discussions on valuation standards and licensing benchmarks.</p>
          </div>
        )}
      </main>

      {showUnlockModal && selectedPatent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-2xl space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold">Unlock Patent Details</h2>
            <button onClick={() => { setUnlockedPatentIds([...unlockedPatentIds, selectedPatent.id]); setShowUnlockModal(false); showToast('Unlocked!'); }} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm">Pay & Unlock</button>
          </div>
        </div>
      )}
    </div>
  );
}
