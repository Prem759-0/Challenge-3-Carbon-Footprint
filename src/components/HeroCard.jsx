import { useState, useEffect } from 'react';
import { getLevelFromXP, getNextLevel } from '../utils/constants';
import { getLogs, getTotalOffsetKg, getTotalKg, getKgByCategory } from '../utils/storage';

export default function HeroCard({ user, logs, offsets, doneChallenges }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const xp = user?.xp || 0;
  const level = getLevelFromXP(xp);
  const nextLevel = getNextLevel(xp);
  const totalOffset = getTotalOffsetKg(offsets);
  const totalEmission = getTotalKg(logs);
  const cats = getKgByCategory(logs);
  const topCat = Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">💳 Hero <span>License</span></div>
            <div className="page-subtitle">Your official Eco-Hero Trading Card and Badge Collection.</div>
          </div>
          <button className="btn btn-outline" onClick={() => window.print()} style={{ fontSize: 14, padding: '8px 16px', background: 'var(--nb-cyan)' }}>
            🖨️ Print ID
          </button>
        </div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        
        {/* TRADING CARD */}
        <div style={{ perspective: '1000px', display: 'flex', justifyContent: 'center' }}>
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              width: 380, height: 550, background: 'var(--nb-yellow)', 
              border: '6px solid var(--nb-black)', borderRadius: 'var(--radius-lg)',
              boxShadow: '12px 12px 0 var(--nb-black)',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'none',
              transformStyle: 'preserve-3d', position: 'relative', overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            {/* Holographic shine effect */}
            <div style={{
              position: 'absolute', inset: -100,
              background: 'linear-gradient(125deg, transparent 20%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
              transform: `translateX(${tilt.y * 5}px) translateY(${tilt.x * 5}px)`,
              pointerEvents: 'none', zIndex: 10
            }} />

            {/* Card Header */}
            <div style={{ padding: 20, borderBottom: '6px solid var(--nb-black)', background: 'var(--nb-white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)', textTransform: 'uppercase' }}>HERO ID</div>
              <div style={{ background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 900, fontFamily: 'Space Grotesk' }}>CLASS {level.name.split(' ')[0].toUpperCase()}</div>
            </div>

            {/* Avatar Section */}
            <div style={{ height: 200, background: 'var(--nb-pink)', borderBottom: '6px solid var(--nb-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Comic burst background */}
              <div style={{ position: 'absolute', width: 400, height: 400, background: 'repeating-conic-gradient(var(--nb-pink) 0 15deg, #FF4081 15deg 30deg)', animation: 'spin 20s linear infinite' }} />
              <div style={{ fontSize: 100, filter: 'drop-shadow(6px 6px 0 var(--nb-black))', zIndex: 1 }}>{level.icon}</div>
              
              <div style={{ position: 'absolute', bottom: -16, left: 20, background: 'var(--nb-cyan)', border: '4px solid var(--nb-black)', padding: '4px 16px', borderRadius: 'var(--radius-full)', zIndex: 2, fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 20, boxShadow: '4px 4px 0 var(--nb-black)', transform: 'rotate(-5deg)' }}>
                LVL {Math.floor(xp / 100) + 1}
              </div>
            </div>

            {/* User Details */}
            <div style={{ padding: 24, background: 'var(--nb-white)', height: '100%' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, color: 'var(--nb-black)', lineHeight: 1, textTransform: 'uppercase' }}>{user?.name || 'EcoHero'}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{level.name}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed var(--nb-black)', paddingBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: 'var(--nb-black)' }}>POWER (XP)</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-pink)', fontSize: 20 }}>{xp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed var(--nb-black)', paddingBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: 'var(--nb-black)' }}>CARBON SAVED</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-green)', fontSize: 20 }}>{totalOffset.toFixed(0)} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed var(--nb-black)', paddingBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: 'var(--nb-black)' }}>NEMESIS</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-black)', fontSize: 16, textTransform: 'uppercase' }}>{topCat ? topCat[0] : 'None'}</span>
                </div>
              </div>
            </div>
            
            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        </div>

        {/* BADGES & STATS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="nb-card cyan">
            <div className="section-title">🎖️ Badge Collection</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {/* Render dynamic badges based on achievements */}
              {user?.badges?.includes('coach_chat') && (
                <div style={{ width: 80, height: 80, background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '4px 4px 0 var(--nb-black)', position: 'relative' }} title="Coach Consulted">
                  🤖
                </div>
              )}
              {totalOffset >= 100 && (
                <div style={{ width: 80, height: 80, background: 'var(--nb-lime)', border: '4px solid var(--nb-black)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '4px 4px 0 var(--nb-black)' }} title="Tree Hugger (100kg Offset)">
                  🌲
                </div>
              )}
              {doneChallenges.length >= 3 && (
                <div style={{ width: 80, height: 80, background: 'var(--nb-pink)', border: '4px solid var(--nb-black)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '4px 4px 0 var(--nb-black)' }} title="Challenge Master (3 Challenges)">
                  🏆
                </div>
              )}
              {totalEmission < (user?.targetKg || Infinity) && logs.length > 0 && (
                <div style={{ width: 80, height: 80, background: 'var(--nb-yellow)', border: '4px solid var(--nb-black)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '4px 4px 0 var(--nb-black)' }} title="On Target">
                  🎯
                </div>
              )}
              {/* Placeholder for empty state */}
              {!user?.badges?.length && totalOffset < 100 && doneChallenges.length < 3 && (
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Complete challenges, offset carbon, and talk to EcoCoach to unlock badges!
                </div>
              )}
            </div>
          </div>

          <div className="nb-card pink">
            <div className="section-title">📈 Level Progression</div>
            {nextLevel ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 18, color: 'var(--nb-black)', marginBottom: 8 }}>
                  <span>Current: {level.name}</span>
                  <span>Next: {nextLevel.name}</span>
                </div>
                <div style={{ height: 24, background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(100, Math.max(0, ((xp - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100))}%`, 
                    height: '100%', background: 'var(--nb-yellow)', borderRight: '4px solid var(--nb-black)' 
                  }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 800, marginTop: 8, color: 'var(--text-muted)' }}>
                  {nextLevel.xpRequired - xp} XP to level up
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)', textAlign: 'center' }}>
                MAX LEVEL REACHED! 🌟
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
