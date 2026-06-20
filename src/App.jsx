import { useState, useEffect, useCallback } from 'react';
import './index.css';
import Dashboard  from './components/Dashboard';
import Tracker    from './components/Tracker';
import EcoCoach   from './components/EcoCoach';
import Challenges from './components/Challenges';
import Offsets    from './components/Offsets';
import Community  from './components/Community';
import Onboarding from './components/Onboarding';
import Villains   from './components/Villains';
import HeroCard   from './components/HeroCard';
import Trivia     from './components/Trivia';
import ComicCursor from './components/ComicCursor';
import {
  getUser, saveUser, defaultUser,
  isOnboarded, setOnboarded, seedMockData,
  getLogs, getOffsets as _getOffsets, getCompletedChallenges,
} from './utils/storage';
import { getLevelFromXP, getNextLevel } from './utils/constants';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',  icon: '📊', label: 'Dashboard',      key: 'd' },
  { id: 'tracker',    icon: '📝', label: 'Track Activity', key: 't' },
  { id: 'ecocoach',   icon: '🤖', label: 'EcoCoach AI',    key: 'e' },
  { id: 'challenges', icon: '🏆', label: 'Challenges',     key: 'c' },
  { id: 'offsets',    icon: '🌳', label: 'Offset Forest',  key: 'o' },
  { id: 'villains',   icon: '💥', label: 'Boss Fights',    key: 'b' },
  { id: 'herocard',   icon: '💳', label: 'Hero License',   key: 'h' },
  { id: 'trivia',     icon: '🧠', label: 'Eco Trivia',     key: 'q' },
  { id: 'community',  icon: '🤝', label: 'Community',      key: 'f' },
];

const TICKER_DATA = [
  { label: '🌍 Global CO₂ today',   val: '112M tons' },
  { label: '🌲 Trees planted/yr',   val: '15.2B' },
  { label: '⚡ Renewables share',   val: '30.3%' },
  { label: '🏭 Transport emissions', val: '29% total' },
  { label: '🌡️ Temp rise (pre-ind)', val: '+1.2°C' },
  { label: '🔋 Global solar cap',    val: '1.2 TW' },
  { label: '🌊 Sea level rise/yr',   val: '+3.6mm' },
  { label: '♻️ Recycling rate (UK)', val: '44.6%' },
];

// ─────────────────────────────────────────────
// TOAST SYSTEM
// ─────────────────────────────────────────────
function Toasts({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-notification ${t.type || 'info'}`} onClick={() => remove(t.id)}>
          <div className="toast-icon-box">{t.icon}</div>
          <div>
            <div className="toast-title">{t.title}</div>
            {t.message && <div className="toast-msg">{t.message}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────
function LiveTicker() {
  const items = [...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA];
  return (
    <div className="live-ticker">
      <div className="ticker-label"><span style={{animation: 'pulse 2s infinite', color: 'var(--nb-pink)'}}>●</span> BREAKING NEWS</div>
      <div className="ticker-scroll-wrap">
        <div className="ticker-inner">
          {items.map((d, i) => (
            <div key={i} className="ticker-entry">
              <span>{d.label}</span>
              <span className="ticker-val">→ {d.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAB
// ─────────────────────────────────────────────
function FAB({ onNavigate }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 900 }}>
      {showTip && (
        <div style={{ position: 'absolute', bottom: 70, right: 0, background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '8px 16px', borderRadius: 8, fontFamily: 'Space Grotesk', fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '4px 4px 0 var(--nb-yellow)' }}>
          Quick Log Activity
        </div>
      )}
      <button
        style={{
          width: 60, height: 60, borderRadius: '50%', background: 'var(--nb-pink)', border: '4px solid var(--nb-black)',
          fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '4px 4px 0 var(--nb-black)', transition: 'var(--t-fast)'
        }}
        onMouseEnter={(e) => { setShowTip(true); e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--nb-black)'; }}
        onMouseLeave={(e) => { setShowTip(false); e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--nb-black)'; }}
        onClick={() => onNavigate('tracker')}
      >
        ➕
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMMAND PALETTE (CTRL+K)
// ─────────────────────────────────────────────
function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [selIndex, setSelIndex] = useState(0);

  const actions = [
    ...NAV.map(n => ({ id: `nav-${n.id}`, label: `Navigate to ${n.label}`, icon: n.icon, act: () => onNavigate(n.id) })),
    { id: 'log', label: 'Quick Log New Activity', icon: '➕', act: () => onNavigate('tracker') },
    { id: 'coach', label: 'Ask EcoCoach for advice', icon: '🤖', act: () => onNavigate('ecocoach') },
  ];

  const results = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { setSelIndex(0); }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') setSelIndex(i => Math.min(i + 1, results.length - 1));
      else if (e.key === 'ArrowUp') setSelIndex(i => Math.max(i - 1, 0));
      else if (e.key === 'Enter' && results[selIndex]) {
        results[selIndex].act();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, results, selIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="nb-card" style={{ width: 600, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', padding: 20, borderBottom: '4px solid var(--nb-black)', background: 'var(--nb-yellow)' }}>
          <span style={{ fontSize: 24, marginRight: 16 }}>⚡</span>
          <input
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 24, fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-black)' }}
            autoFocus
            placeholder="Type a command..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span style={{ background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 900, alignSelf: 'center' }}>ESC</span>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto', background: 'var(--nb-white)' }}>
          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18 }}>No commands found.</div>
          ) : (
            results.map((r, i) => (
              <div
                key={r.id}
                style={{
                  padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: i === selIndex ? 'var(--nb-cyan)' : 'transparent',
                  borderBottom: '2px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18
                }}
                onMouseEnter={() => setSelIndex(i)}
                onClick={() => { r.act(); onClose(); }}
              >
                <span>{r.icon} {r.label}</span>
                {i === selIndex && <span style={{ fontSize: 14, background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '2px 8px', borderRadius: 4 }}>↵ Enter</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [page,        setPage]        = useState('dashboard');
  const [onboarded,   setOnboarded_]  = useState(false);
  const [user,        setUser]        = useState(null);
  const [toasts,      setToasts]      = useState([]);
  const [refreshKey,  setRefreshKey]  = useState(0);
  const [cmdOpen,     setCmdOpen]     = useState(false);

  // Init
  useEffect(() => {
    seedMockData();
    const u = getUser();
    if (u) { setUser(u); setOnboarded_(isOnboarded()); }
    else setOnboarded_(false);
  }, []);

  // Global hotkeys (G+key, and Ctrl+K)
  useEffect(() => {
    const keys = new Set();
    const onDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
        return;
      }
      keys.add(e.key.toLowerCase());
      if (keys.has('g')) {
        const match = NAV.find(n => keys.has(n.key));
        if (match) { navigate(match.id); keys.clear(); }
      }
    };
    const onUp = (e) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  const refresh  = useCallback(() => setRefreshKey(k => k + 1), []);
  
  const [wiping, setWiping] = useState(false);
  const navigate = useCallback((p) => {
    if (page === p) return;
    setWiping(true);
    setTimeout(() => {
      setPage(p);
    }, 200); 
    setTimeout(() => {
      setWiping(false);
    }, 400); 
  }, [page]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4200);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const updateUser = useCallback((updater) => {
    setUser(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveUser(next);
      return next;
    });
  }, []);

  const handleOnboardingComplete = (data) => {
    const u = defaultUser(data.name);
    u.xp = 50;
    u.baselineKg = data.baselineKg;
    u.targetKg   = data.baselineKg * 0.7;
    saveUser(u);
    setUser(u);
    setOnboarded();
    setOnboarded_(true);
    addToast({ type: 'success', icon: '🎉', title: 'Welcome aboard!', message: `Baseline: ${data.baselineKg.toFixed(0)} kg CO₂/mo` });
  };

  const logs          = getLogs();
  const offsets       = _getOffsets();
  const doneChallenges= getCompletedChallenges();
  const xp            = parseInt(user?.xp) || 0;
  const level         = getLevelFromXP(xp);
  const nextLevel     = getNextLevel(xp);
  const xpPct         = nextLevel ? Math.max(0, Math.min(100, ((xp - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100)) : 100;

  const sharedProps = { user, updateUser, addToast, refresh, refreshKey, logs, offsets, doneChallenges, navigate };

  return (
    <>
      <ComicCursor />

      {wiping && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--nb-black)',
          animation: 'slideUpHurdle 0.4s ease-out forwards'
        }} />
      )}

      <div className="app-layout">
        {!onboarded && <Onboarding onComplete={handleOnboardingComplete} />}

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-row">
              <div className="logo-icon-box">🌍</div>
              <div className="logo-text-box">
                <h1>CARBONTRACE</h1>
                <p>Eco Dashboard</p>
              </div>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Navigation</div>
            {NAV.map(item => (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: '0 24px 24px' }}>
            <button
              onClick={() => setCmdOpen(true)}
              style={{
                width: '100%', padding: '12px', background: 'var(--nb-white)', border: '3px solid var(--nb-black)',
                borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontFamily: 'Space Grotesk', fontWeight: 900, cursor: 'pointer', boxShadow: '2px 2px 0 var(--nb-black)'
              }}
            >
              <span>🔍 Command Palette</span>
              <span style={{ background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>CTRL K</span>
            </button>
          </div>

          {user && (
            <div className="sidebar-user">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div className="user-avatar-circle">{level.icon}</div>
                <div>
                  <div className="user-name">{user.name || 'EcoHero'}</div>
                  <div className="user-level-tag">{level.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-black)' }}>
                  {xp} {nextLevel ? `/ ${nextLevel.xpRequired}` : ''} XP
                </span>
              </div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="main-content">
          <LiveTicker />
          {page === 'dashboard'  && <Dashboard  key={refreshKey} {...sharedProps} />}
          {page === 'tracker'    && <Tracker    key={refreshKey} {...sharedProps} />}
          {page === 'ecocoach'   && <EcoCoach   key={refreshKey} {...sharedProps} />}
          {page === 'challenges' && <Challenges key={refreshKey} {...sharedProps} />}
          {page === 'offsets'    && <Offsets    key={refreshKey} {...sharedProps} />}
          {page === 'villains'   && <Villains   key={refreshKey} {...sharedProps} />}
          {page === 'herocard'   && <HeroCard   key={refreshKey} {...sharedProps} />}
          {page === 'trivia'     && <Trivia     key={refreshKey} {...sharedProps} />}
          {page === 'community'  && <Community  key={refreshKey} {...sharedProps} />}
        </main>

        <FAB onNavigate={navigate} />
        <Toasts toasts={toasts} remove={removeToast} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={navigate} />
      </div>
    </>
  );
}
