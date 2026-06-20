import { useState, useEffect } from 'react';
import { getLogs, getTotalKg, getKgByCategory, getTotalOffsetKg } from '../utils/storage';

function AnimCounter({ val }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let start = disp;
    let end = val;
    if (start === end) return;
    const dur = 800;
    const startT = performance.now();
    const tick = (now) => {
      const elapsed = now - startT;
      const prog = Math.min(elapsed / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3); // cubic out
      setDisp(start + (end - start) * ease);
      if (prog < 1) requestAnimationFrame(tick);
      else setDisp(end);
    };
    requestAnimationFrame(tick);
  }, [val]);

  return <>{disp.toFixed(1)}</>;
}

export default function Dashboard({ user, refreshKey, logs, offsets, navigate }) {
  const totalEmission = getTotalKg(logs);
  const target = user?.targetKg || 0;
  const isOver = totalEmission > target && target > 0;
  const totalOffset = getTotalOffsetKg(offsets);

  const netEmission = Math.max(0, totalEmission - totalOffset);

  const cats = getKgByCategory(logs);
  const maxCatVal = Math.max(...Object.values(cats), 1);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">📊 Commander's <span>Dashboard</span></div>
        <div className="page-subtitle">Your real-time carbon telemetry and monthly impact summary.</div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        
        <div className="nb-card yellow">
          <div className="section-title">☁️ Total Footprint</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 56, lineHeight: 1, color: 'var(--nb-black)' }}>
            <AnimCounter val={totalEmission} /> <span style={{fontSize: 20}}>kg</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--nb-black)' }}>
            {target > 0 ? (
              isOver ? (
                <span style={{ color: '#D32F2F' }}>Exceeded monthly target of {target}kg!</span>
              ) : (
                <span>{(target - totalEmission).toFixed(1)}kg remaining this month</span>
              )
            ) : (
              <span>No target set</span>
            )}
          </div>
        </div>

        <div className="nb-card pink">
          <div className="section-title">🌳 Offsets Applied</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 56, lineHeight: 1, color: 'var(--nb-black)' }}>
            <AnimCounter val={totalOffset} /> <span style={{fontSize: 20}}>kg</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => navigate('offsets')}>
              Plant More Trees
            </button>
          </div>
        </div>

        <div className="nb-card cyan">
          <div className="section-title">⚖️ Net Impact</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 56, lineHeight: 1, color: 'var(--nb-black)' }}>
            <AnimCounter val={netEmission} /> <span style={{fontSize: 20}}>kg</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--nb-black)' }}>
            {netEmission === 0 && totalEmission > 0 ? '✨ Carbon Neutral! ✨' : 'Gross Emissions - Offsets'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div className="nb-card">
          <div className="section-title">📈 Emissions by Category</div>
          {Object.keys(cats).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, opacity: 0.5, marginBottom: 12 }}>📭</div>
              <p>No data to display. Log some activities!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat, val]) => (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 700 }}>
                    <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                    <span>{val.toFixed(1)} kg</span>
                  </div>
                  <div style={{ height: 16, background: 'var(--bg-base)', border: '2px solid var(--nb-black)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(val / maxCatVal) * 100}%`, height: '100%', 
                      background: cat === 'transport' ? 'var(--nb-pink)' : cat === 'diet' ? 'var(--nb-lime)' : 'var(--nb-cyan)',
                      borderRight: '2px solid var(--nb-black)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nb-card purple">
          <div className="section-title">⚡ Recent Activity</div>
          {logs.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--nb-black)' }}>
              <p style={{ fontWeight: 700 }}>Silence in the logs...</p>
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {logs.slice(-5).reverse().map(log => (
                <div key={log.id} style={{ 
                  background: 'var(--nb-white)', padding: 16, border: '3px solid var(--nb-black)', 
                  borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '2px 2px 0 var(--nb-black)'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--nb-black)' }}>{log.action}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 20, color: 'var(--nb-pink)' }}>
                    +{log.kg.toFixed(1)} kg
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
