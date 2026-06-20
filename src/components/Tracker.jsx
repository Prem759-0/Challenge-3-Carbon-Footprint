import { useState } from 'react';
import { EMISSION_FACTORS } from '../utils/constants';
import { addLog } from '../utils/storage';

export default function Tracker({ refresh, addToast, updateUser }) {
  const [cat, setCat] = useState('transport');
  const [val, setVal] = useState('');

  const currentFactor = EMISSION_FACTORS[cat];

  const handleLog = (e) => {
    e.preventDefault();
    if (!val || isNaN(val) || val <= 0) return;

    const kg = parseFloat(val) * currentFactor.factor;
    addLog({ category: cat, action: currentFactor.actionName, kg });
    
    // Tiny XP reward for logging
    updateUser(u => ({ ...u, xp: (u.xp || 0) + 5 }));
    
    addToast({ type: 'success', icon: '📝', title: 'Activity Logged', message: `Added ${kg.toFixed(1)} kg CO₂` });
    setVal('');
    refresh();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">📝 Track <span>Activity</span></div>
        <div className="page-subtitle">Log your daily actions to calculate your real-time carbon footprint.</div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        
        {/* LOGGING FORM */}
        <div className="nb-card lime">
          <div className="section-title">⚡ Input Telemetry</div>
          
          <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label className="form-label" style={{ color: 'var(--nb-black)' }}>Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {Object.keys(EMISSION_FACTORS).map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCat(k)}
                    style={{
                      padding: '16px', background: cat === k ? 'var(--nb-black)' : 'var(--nb-white)',
                      color: cat === k ? 'var(--nb-white)' : 'var(--nb-black)',
                      border: '3px solid var(--nb-black)', borderRadius: 'var(--radius-sm)',
                      fontWeight: 900, textTransform: 'capitalize', cursor: 'pointer',
                      boxShadow: cat === k ? 'inset 2px 2px 0 rgba(255,255,255,0.2)' : '2px 2px 0 var(--nb-black)',
                      transform: cat === k ? 'translate(2px, 2px)' : 'none',
                      transition: 'var(--t-fast)'
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{k === 'transport' ? '🚗' : k === 'diet' ? '🥗' : '⚡'}</div>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ color: 'var(--nb-black)' }}>
                {currentFactor.unit === 'km' ? 'Distance (km)' : currentFactor.unit === 'kWh' ? 'Energy (kWh)' : 'Meals (count)'}
              </label>
              <input 
                type="number" step="0.1"
                className="form-input"
                value={val} onChange={e => setVal(e.target.value)}
                placeholder={`Enter ${currentFactor.unit}...`}
                style={{ fontSize: 24, fontWeight: 900, padding: 20 }}
              />
            </div>

            <div style={{ padding: 20, background: 'var(--nb-white)', border: '3px solid var(--nb-black)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '2px 2px 0 var(--nb-black)' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Estimated Impact:</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 28, color: 'var(--nb-pink)' }}>
                {val ? (parseFloat(val) * currentFactor.factor).toFixed(1) : '0.0'} <span style={{fontSize: 16}}>kg CO₂</span>
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: 20, fontSize: 20 }}>
              🚀 LOG ACTIVITY
            </button>
          </form>
        </div>

        {/* INFO PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="nb-card pink">
            <div className="section-title">💡 Did you know?</div>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, color: 'var(--nb-black)' }}>
              {cat === 'transport' && "Driving a petrol car emits roughly 0.19 kg of CO₂ per kilometer. Taking public transport or cycling can slash this drastically!"}
              {cat === 'diet' && "A single meat-based meal can generate over 2.5 kg of CO₂. Swapping to a plant-based meal reduces that by almost 80%."}
              {cat === 'energy' && "1 kWh of electricity produces about 0.23 kg of CO₂ depending on your local grid. Turn off devices when not in use to save!"}
            </p>
          </div>

          <div className="nb-card cyan" style={{ flex: 1 }}>
            <div className="section-title">🎯 Quick Log Macros</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button className="btn btn-outline" onClick={() => { setCat('transport'); setVal('10'); }}>🚗 10km Commute</button>
              <button className="btn btn-outline" onClick={() => { setCat('diet'); setVal('3'); }}>🥗 3 Vegan Meals</button>
              <button className="btn btn-outline" onClick={() => { setCat('energy'); setVal('5'); }}>⚡ 5 kWh Used</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
