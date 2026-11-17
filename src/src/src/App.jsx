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
  // --- STATE WITH LOCALSTORAGE PERSISTENCE ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hc_current_user');
    return saved ? JSON.parse(saved) : { name: 'Sarah Jenkins', email: 'sarah@hotcater.com', role: 'customer' };
  });

  const [patents, setPatents] = useState(() => {
    const saved = localStorage.getItem('hc_patents');
    return saved ? JSON.parse(saved) : INITIAL_PATENTS;
  });

  const [unlockedPatentIds, setUnlockedPatentIds] = useState(() => {
    const saved = localStorage.getItem('hc_unlocked');
    return saved ? JSON.parse(saved) : ['pat-1'];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hc_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('hc_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  // --- UI NAVIGATION & MODALS ---
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'inventor', 'contracts', 'forum'
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealType, setDealType] = useState('License'); // 'License', 'Purchase', 'Lease-to-Buy'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showDnsModal, setShowDnsModal] = useState(false);
  const [toast, setToast] = useState('');

  // --- INVENTOR LISTING FORM STATE ---
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('In Production');
  const [newDescription, setNewDescription] = useState('');
  const [newTier, setNewTier] = useState('Utility');
  const [newUnlockFee, setNewUnlockFee] = useState(50);
  const [newAskingPrice, setNewAskingPrice] = useState(150000);
  const [newRoyalty, setNewRoyalty] = useState('5% gross');
  const [newLeaseMonthly, setNewLeaseMonthly] = useState(2500);
  const [newIllustrationType, setNewIllustrationType] = useState('drone');

  // --- PATENT OFFICE AUTO-PULL STATE ---
  const [autoPatentNumber, setAutoPatentNumber] = useState('');
  const [autoConsent, setAutoConsent] = useState(false);

  // --- CHAT STATE ---
  const [chatMessageText, setChatMessageText] = useState('');

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('hc_current_user', JSON.stringify(currentUser));
    localStorage.setItem('hc_patents', JSON.stringify(patents));
    localStorage.setItem('hc_unlocked', JSON.stringify(unlockedPatentIds));
    localStorage.setItem('hc_messages', JSON.stringify(messages));
    localStorage.setItem('hc_deals', JSON.stringify(deals));
  }, [currentUser, patents, unlockedPatentIds, messages, deals]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setPatents(INITIAL_PATENTS);
    setUnlockedPatentIds(['pat-1']);
    setMessages(INITIAL_MESSAGES);
    setDeals(INITIAL_DEALS);
    setCurrentUser({ name: 'Sarah Jenkins', email: 'sarah@hotcater.com', role: 'customer' });
    showToast('Demo data restored to default state.');
  };

  // --- ILLUSTRATION RENDERER ---
  const renderIllustration = (type) => {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-lg flex items-center justify-center p-4 border border-slate-700 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        {type === 'drone' && (
          <svg className="w-24 h-24 text-indigo-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24" fill="none
