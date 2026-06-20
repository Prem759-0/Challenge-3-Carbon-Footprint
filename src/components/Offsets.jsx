import { useState, useMemo, useEffect } from 'react';
import { OFFSET_ACTIONS as OFFSETS } from '../utils/constants';
import { addOffset, getTotalOffsetKg } from '../utils/storage';

// ── Virtual Forest Map ──
function VirtualForest({ offsets }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);

  // Generate deterministic but random-looking positions for trees based on offset ID or index
  const trees = useMemo(() => {
    let planted = [];
    offsets.forEach((o, i) => {
      // 1 tree per 21 kg approx, max 50 visual trees per offset record
      const count = Math.max(1, Math.min(50, Math.round(o.kg / 21)));
      for (let j = 0; j < count; j++) {
        // Pseudo-random coordinates
        const x = ((i * 137 + j * 73) % 100);
        const y = ((i * 193 + j * 59) % 100);
        const scale = 0.8 + ((i * 11 + j * 17) % 40) / 100;
        const type = ((i + j) % 3); // 0, 1, or 2
        planted.push({ id: `${o.id}-${j}`, x, y, scale, type, date: o.timestamp });
      }
    });
    // Sort by Y so things in front are drawn last (isometric pseudo-depth)
    return planted.sort((a, b) => a.y - b.y);
  }, [offsets]);

  const treeStyles = [
    { base: 'var(--nb-green)', trunk: '#5D4037' },
    { base: 'var(--nb-lime)',  trunk: '#4E342E' },
    { base: 'var(--nb-cyan)',  trunk: '#3E2723' },
  ];

  return (
    <div style={{
      width: '100%', height: 350, background: 'var(--nb-white)',
      borderRadius: 'var(--radius-sm)', border: '4px solid var(--nb-black)',
      position: 'relative', overflow: 'hidden', boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.1)',
      marginTop: 20
    }}>
      {/* Ground Grid lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.1) 2px, transparent 2px)',
        backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)',
        transformOrigin: 'top', opacity: 1
      }} />

      {trees.length === 0 ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontSize: 56, filter: 'grayscale(1) contrast(2)' }}>🌱</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--nb-black)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 10, background: 'var(--nb-yellow)', padding: '4px 12px', border: '2px solid var(--nb-black)', transform: 'rotate(-2deg)' }}>Barren Wasteland</div>
        </div>
      ) : (
        trees.map((t, idx) => {
          const st = treeStyles[t.type];
          return (
            <div key={t.id} style={{
              position: 'absolute',
              left: `${t.x}%`, top: `${t.y}%`,
              transform: `translate(-50%, -100%) scale(${mounted ? t.scale : 0})`,
              transition: `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.02}s`,
              pointerEvents: 'none'
            }}>
              {/* Simple CSS Pine Tree - Comic Style */}
              <div style={{ width: 8, height: 16, background: st.trunk, margin: '0 auto', border: '2px solid var(--nb-black)' }} />
              <div style={{ width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: `24px solid ${st.base}`, position: 'absolute', bottom: 12, left: -16, filter: 'drop-shadow(2px 2px 0 var(--nb-black))' }} />
              <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: `20px solid ${st.base}`, position: 'absolute', bottom: 24, left: -12, filter: 'drop-shadow(2px 2px 0 var(--nb-black))' }} />
              <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: `16px solid ${st.base}`, position: 'absolute', bottom: 36, left: -8, filter: 'drop-shadow(2px 2px 0 var(--nb-black))' }} />
            </div>
          );
        })
      )}
      
      {/* HUD overlay */}
      <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--nb-yellow)', padding: '8px 16px', border: '3px solid var(--nb-black)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '2px 2px 0 var(--nb-black)' }}>
        <span style={{ fontSize: 24 }}>🌳</span>
        <div>
          <div style={{ fontSize: 11, color: 'var(--nb-black)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Trees Planted</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)', lineHeight: 1 }}>{trees.length}</div>
        </div>
      </div>
    </div>
  );
}


export default function Offsets({ offsets, refresh, addToast, updateUser }) {
  const [loading, setLoading] = useState(null);

  const totalOffset = getTotalOffsetKg(offsets);

  const handlePurchase = (pkg) => {
    setLoading(pkg.id);
    setTimeout(() => {
      addOffset({
        name: pkg.name,
        provider: pkg.provider,
        kg: pkg.kg,
        cost: pkg.cost
      });
      // Reward tons of XP for offsetting
      const xpReward = Math.round(pkg.kg * 0.5);
      updateUser(u => ({ ...u, xp: u.xp + xpReward }));
      addToast({ type: 'success', icon: '🌳', title: 'Offset Confirmed', message: `You offset ${pkg.kg} kg and earned ${xpReward} XP!` });
      setLoading(null);
      refresh();
    }, 1200); // fake network delay
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">🌳 Offset <span>Forest</span></div>
            <div className="page-subtitle">Invest in verified projects. Every contribution grows your virtual forest.</div>
          </div>
        </div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
        
        {/* LEFT COL: PACKAGES */}
        <div className="nb-card yellow">
          <div className="section-title">📦 Offset Packages</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {OFFSETS.map(pkg => (
              <div key={pkg.id} style={{ padding: 24, border: '4px solid var(--nb-black)', background: 'var(--nb-white)', borderRadius: 'var(--radius-sm)', transition: 'var(--t-smooth)', boxShadow: '4px 4px 0 var(--nb-black)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, marginBottom: 4, color: 'var(--nb-black)', textTransform: 'uppercase' }}>{pkg.name}</h3>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🏢 {pkg.provider}</span>
                      <span style={{ color: 'var(--nb-black)', border: '2px solid var(--nb-black)', padding: '2px 8px', borderRadius: 12, background: 'var(--nb-lime)', textTransform: 'uppercase' }}>🛡️ Verified</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, color: 'var(--nb-pink)', lineHeight: 1 }}>${pkg.cost.toFixed(2)}</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>ONE-TIME</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20, marginBottom: 20 }}>
                  <div className="pill pill-green" style={{ fontSize: 14 }}>-{pkg.kg} kg CO₂</div>
                  <div className="pill pill-cyan" style={{ fontSize: 14 }}>+{Math.round(pkg.kg * 0.5)} XP</div>
                </div>

                <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 24, lineHeight: 1.6 }}>{pkg.desc}</p>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 18, padding: '16px' }}
                  disabled={loading === pkg.id}
                  onClick={() => handlePurchase(pkg)}
                >
                  {loading === pkg.id ? 'PROCESSING...' : `PURCHASE FOR $${pkg.cost}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COL: VIRTUAL FOREST & STATS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="nb-card lime" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--nb-black)', textTransform: 'uppercase', letterSpacing: 2 }}>Total Carbon Offset</div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 64, color: 'var(--nb-black)', margin: '16px 0', textShadow: '2px 2px 0 var(--nb-white)' }}>
              {totalOffset.toLocaleString()} <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--nb-black)' }}>kg</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--nb-black)' }}>
              Equivalent to roughly <strong style={{ color: 'var(--nb-pink)', fontSize: 20, textShadow: '1px 1px 0 #000' }}>{(totalOffset/21).toFixed(1)} trees</strong> planted!
            </div>
            
            <VirtualForest offsets={offsets} />
          </div>

          <div className="nb-card cyan">
            <div className="section-title">📜 Offset Registry</div>
            {offsets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--nb-black)' }}>
                <div style={{ fontSize: 40, opacity: 0.5, marginBottom: 16 }}>📂</div>
                <p style={{ fontWeight: 800 }}>No offsets purchased yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {offsets.slice(0, 5).map(o => (
                  <div key={o.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', border: '3px solid var(--nb-black)', borderRadius: 'var(--radius-sm)',
                    background: 'var(--nb-white)', boxShadow: '2px 2px 0 var(--nb-black)'
                  }}>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 18, color: 'var(--nb-black)', textTransform: 'uppercase' }}>{o.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 700 }}>{new Date(o.timestamp).toLocaleDateString()} · {o.provider}</div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-green)' }}>
                      -{o.kg} <span style={{fontSize: 14, fontWeight: 900, color: 'var(--text-muted)'}}>kg</span>
                    </div>
                  </div>
                ))}
                {offsets.length > 5 && <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 800, color: 'var(--nb-black)', marginTop: 16 }}>And {offsets.length - 5} more...</div>}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
