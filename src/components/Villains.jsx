import { useState } from 'react';

const BOSSES = [
  { id: 'smog', name: 'Smogzilla', type: 'Air Pollution', hp: 1000, desc: 'A giant beast made of industrial exhaust and car fumes.', img: '☁️', color: 'var(--nb-cyan)' },
  { id: 'plastic', name: 'Captain Plasticbeard', type: 'Ocean Waste', hp: 2500, desc: 'Pirate king of the Great Pacific Garbage Patch.', img: '🏴‍☠️', color: 'var(--nb-pink)' },
  { id: 'coal', name: 'King Coal', type: 'Fossil Fuels', hp: 5000, desc: 'The ancient lord of dirty energy.', img: '🔥', color: 'var(--nb-yellow)' },
];

export default function Villains({ user }) {
  const userXp = user?.xp || 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">💥 Boss <span>Fights</span></div>
            <div className="page-subtitle">Your XP is your attack power. Defeat eco-villains to save the planet!</div>
          </div>
        </div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
        {BOSSES.map((boss, idx) => {
          const previousBossesHp = BOSSES.slice(0, idx).reduce((sum, b) => sum + b.hp, 0);
          const isUnlocked = userXp >= previousBossesHp;
          
          let damageDealt = 0;
          if (isUnlocked) {
            damageDealt = Math.min(boss.hp, userXp - previousBossesHp);
          }

          const isDefeated = damageDealt >= boss.hp;
          const hpPct = Math.max(0, 100 - (damageDealt / boss.hp) * 100);

          return (
            <div key={boss.id} className="nb-card" style={{ 
              background: isUnlocked ? boss.color : 'var(--nb-white)',
              opacity: isUnlocked ? 1 : 0.6,
              filter: isUnlocked ? 'none' : 'grayscale(1)',
              display: 'flex', gap: 32, alignItems: 'center'
            }}>
              <div style={{ 
                fontSize: 80, width: 140, height: 140, background: 'var(--nb-white)', 
                border: '4px solid var(--nb-black)', borderRadius: 'var(--radius-sm)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '4px 4px 0 var(--nb-black)',
                transform: isDefeated ? 'rotate(90deg) scale(0.8)' : 'none',
                transition: 'var(--t-spring)',
                opacity: isDefeated ? 0.5 : 1
              }}>
                {isUnlocked ? boss.img : '🔒'}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, color: 'var(--nb-black)', textTransform: 'uppercase' }}>
                      {isUnlocked ? boss.name : 'Unknown Threat'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--nb-black)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {isUnlocked ? `Type: ${boss.type}` : 'Locked'}
                    </div>
                  </div>
                  {isDefeated && <div className="pill pill-green" style={{ fontSize: 18, transform: 'rotate(10deg)' }}>DEFEATED! 🎉</div>}
                </div>
                
                {isUnlocked && (
                  <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--nb-black)', marginTop: 12, marginBottom: 20 }}>
                    {boss.desc}
                  </p>
                )}

                {isUnlocked ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-black)', marginBottom: 8 }}>
                      <span>HP: {(boss.hp - damageDealt).toFixed(0)} / {boss.hp}</span>
                      <span>{damageDealt} DMG DEALT</span>
                    </div>
                    <div style={{ height: 24, background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ 
                        width: `${hpPct}%`, height: '100%', background: '#D32F2F', 
                        borderRight: hpPct > 0 ? '4px solid var(--nb-black)' : 'none',
                        transition: 'width 1s ease-in-out'
                      }} />
                      {/* Comic damage star if attacking */}
                      {!isDefeated && damageDealt > 0 && (
                        <div style={{ position: 'absolute', top: -10, left: `${hpPct}%`, transform: 'translateX(-50%)', fontSize: 24, filter: 'drop-shadow(2px 2px 0 #000)' }}>
                          💥
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 20, fontSize: 16, fontWeight: 800, color: 'var(--text-muted)' }}>
                    Defeat previous bosses to unlock. Requires {previousBossesHp} Total XP.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
