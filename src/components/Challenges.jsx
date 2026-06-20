import { useState } from 'react';
import { CHALLENGES } from '../utils/constants';
import { completeChallenge } from '../utils/storage';

export default function Challenges({ refresh, addToast, doneChallenges, updateUser }) {
  const [animating, setAnimating] = useState(null);

  const handleComplete = (ch) => {
    setAnimating(ch.id);
    setTimeout(() => {
      completeChallenge(ch.id);
      updateUser(u => ({ ...u, xp: (u.xp || 0) + ch.xp }));
      addToast({ type: 'success', icon: ch.icon, title: 'Challenge Complete!', message: `Earned ${ch.xp} XP` });
      setAnimating(null);
      refresh();
    }, 600);
  };

  const active = CHALLENGES.filter(c => !doneChallenges.includes(c.id));
  const done   = CHALLENGES.filter(c => doneChallenges.includes(c.id));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">🏆 Active <span>Challenges</span></div>
        <div className="page-subtitle">Push your limits, earn XP, and unlock new Eco Badges.</div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        
        {/* ACTIVE CHALLENGES */}
        <div>
          <div className="nb-card lime" style={{ marginBottom: 32 }}>
            <div className="section-title">🔥 Current Missions</div>
            {active.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--nb-black)' }}>
                <div style={{ fontSize: 40, opacity: 0.5, marginBottom: 12 }}>🏁</div>
                <p style={{ fontWeight: 700, fontSize: 18 }}>All missions accomplished. Stand by for more.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {active.map(ch => (
                  <div key={ch.id} style={{
                    display: 'flex', gap: 20, padding: 24,
                    background: 'var(--nb-white)', border: '4px solid var(--nb-black)',
                    borderRadius: 'var(--radius-sm)', position: 'relative', overflow: 'hidden',
                    transform: animating === ch.id ? 'scale(0.95)' : 'none',
                    opacity: animating === ch.id ? 0.5 : 1,
                    transition: 'var(--t-spring)',
                    boxShadow: '4px 4px 0 var(--nb-black)'
                  }}>
                    <div style={{ fontSize: 48, filter: 'drop-shadow(2px 2px 0 var(--nb-black))' }}>{ch.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)', letterSpacing: '-0.5px' }}>{ch.title}</div>
                        <div className="pill pill-yellow">+{ch.xp} XP</div>
                      </div>
                      <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>{ch.desc}</p>
                      
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleComplete(ch)}
                        style={{ width: '100%', fontSize: 16 }}
                      >
                        MARK COMPLETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COMPLETED & STATS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="nb-card cyan">
            <div className="section-title">⭐ Trophy Room</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--nb-black)' }}>Total Completed</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, color: 'var(--nb-black)' }}>{done.length}/{CHALLENGES.length}</span>
            </div>
            
            <div style={{ height: 24, background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ width: `${(done.length / CHALLENGES.length) * 100}%`, height: '100%', background: 'var(--nb-pink)', borderRight: '4px solid var(--nb-black)' }} />
            </div>

            {done.length > 0 && (
              <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {done.map(c => (
                  <div key={c.id} style={{ 
                    width: 48, height: 48, background: 'var(--nb-white)', border: '3px solid var(--nb-black)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, boxShadow: '2px 2px 0 var(--nb-black)', position: 'relative'
                  }} title={c.title}>
                    {c.icon}
                    <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: 'var(--nb-green)', border: '2px solid var(--nb-black)', borderRadius: '50%' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="nb-card pink">
             <div className="section-title">🎖️ Badge Unlocks</div>
             <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--nb-black)', marginBottom: 16 }}>Complete specific combinations of challenges to unlock rare badges!</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {['Vegan Voyager', 'Zero Carbon Commuter', 'Energy Saver'].map(b => (
                 <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--nb-white)', border: '3px solid var(--nb-black)', borderRadius: 'var(--radius-sm)' }}>
                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--nb-black)', color: 'var(--nb-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔒</div>
                   <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-muted)' }}>{b}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
