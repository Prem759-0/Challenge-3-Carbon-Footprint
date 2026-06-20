import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', type: 'average' });

  const types = {
    minimal: { label: 'Minimalist (Vegan, no car)', val: 200 },
    average: { label: 'Average (Mixed diet, public transit)', val: 450 },
    heavy:   { label: 'Heavy (Meat daily, drives everywhere)', val: 900 }
  };

  const submit = () => {
    if (!data.name) return;
    onComplete({ ...data, baselineKg: types[data.type].val });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <div className="nb-card yellow" style={{ maxWidth: 500, width: '100%', padding: 40, border: '4px solid var(--nb-black)', boxShadow: '8px 8px 0 var(--nb-black)' }}>
        
        {step === 0 && (
          <div className="animate-pop" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 20, filter: 'drop-shadow(4px 4px 0 #000)' }}>🌍</div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 40, color: 'var(--nb-black)', textTransform: 'uppercase', lineHeight: 1, marginBottom: 16 }}>
              CarbonTrace<br/><span style={{ color: 'var(--nb-pink)', fontSize: 32 }}>Command</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 32 }}>
              Track your footprint. Offset emissions. Save the planet.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', fontSize: 20, padding: 20 }} onClick={() => setStep(1)}>
              INITIALISE PROFILE ➤
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, marginBottom: 24, color: 'var(--nb-black)', textTransform: 'uppercase' }}>Agent Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label className="form-label" style={{ fontSize: 18 }}>Callsign / Name</label>
                <input 
                  autoFocus
                  className="form-input" 
                  value={data.name} 
                  onChange={e => setData({ ...data, name: e.target.value })}
                  placeholder="e.g. EcoWarrior99"
                  style={{ fontSize: 20, padding: 20, border: '4px solid var(--nb-black)', boxShadow: '4px 4px 0 var(--nb-black)' }}
                  onKeyDown={e => e.key === 'Enter' && data.name && setStep(2)}
                />
              </div>
              <button className="btn btn-primary" disabled={!data.name.trim()} onClick={() => setStep(2)} style={{ padding: 20, fontSize: 20 }}>
                NEXT STEP ➤
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, marginBottom: 24, color: 'var(--nb-black)', textTransform: 'uppercase' }}>Baseline Scan</h2>
            <label className="form-label" style={{ fontSize: 18 }}>Select your current lifestyle:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {Object.entries(types).map(([k, v]) => (
                <button 
                  key={k}
                  onClick={() => setData({ ...data, type: k })}
                  style={{
                    padding: '20px', background: data.type === k ? 'var(--nb-cyan)' : 'var(--nb-white)',
                    border: '4px solid var(--nb-black)', borderRadius: 'var(--radius-sm)',
                    textAlign: 'left', cursor: 'pointer', transition: 'var(--t-fast)',
                    boxShadow: data.type === k ? '4px 4px 0 var(--nb-black)' : '2px 2px 0 var(--nb-black)',
                    transform: data.type === k ? 'translate(-2px, -2px)' : 'none'
                  }}
                >
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 20, color: 'var(--nb-black)', textTransform: 'uppercase' }}>{v.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--nb-black)', fontWeight: 800, marginTop: 4 }}>~{v.val} kg CO₂ / mo</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
              <button className="btn btn-outline" onClick={() => setStep(1)} style={{ padding: 20 }}>BACK</button>
              <button className="btn btn-primary" onClick={submit} style={{ flex: 1, padding: 20, fontSize: 20 }}>
                LAUNCH SYSTEM 🚀
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
