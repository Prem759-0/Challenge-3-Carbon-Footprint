import { useState, useMemo } from 'react';

// Mock data for community members
const MOCK_FRIENDS = [
  { id: 1, name: 'EcoWarrior99', xp: 4500, level: 'Forest Guardian', isFriend: true, latestAction: 'Planted 5 trees' },
  { id: 2, name: 'PlanetSaver', xp: 3200, level: 'Young Oak', isFriend: true, latestAction: 'Switched to Solar' },
  { id: 3, name: 'GreenGiant', xp: 2800, level: 'Sapling', isFriend: true, latestAction: 'Cycled 20 miles' },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'EarthChampion', xp: 12500, level: 'Eco Master' },
  { rank: 2, name: 'NatureLover', xp: 11200, level: 'Eco Master' },
  { rank: 3, name: 'ZeroWasteHero', xp: 9800, level: 'Forest Guardian' },
  { rank: 4, name: 'EcoWarrior99', xp: 4500, level: 'Forest Guardian' },
  { rank: 5, name: 'PlanetSaver', xp: 3200, level: 'Young Oak' },
];

export default function Community({ user }) {
  const [friends, setFriends] = useState(MOCK_FRIENDS);

  const addFriend = (name) => {
    if (friends.find(f => f.name === name)) return;
    const newFriend = { id: Date.now(), name, xp: 0, level: 'Sprout', isFriend: true, latestAction: 'Joined Community' };
    setFriends(prev => [newFriend, ...prev]);
  };

  const userXp = user?.xp || 0;
  
  // Mix user into leaderboard
  const globalLeaderboard = useMemo(() => {
    const combined = [...MOCK_LEADERBOARD, { rank: 0, name: 'You', xp: userXp, level: 'Your Level' }];
    combined.sort((a, b) => b.xp - a.xp);
    return combined.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [userXp]);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">🤝 Global <span>Community</span></div>
            <div className="page-subtitle">Connect with eco-heroes, compete on the leaderboard, and make an impact together.</div>
          </div>
        </div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
        
        {/* LEFT COL: FRIENDS */}
        <div className="nb-card pink" style={{ padding: 32 }}>
          <div className="section-title">👥 Your Friends</div>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input 
              type="text" 
              placeholder="Search username..." 
              className="form-input" 
              style={{ padding: '12px 16px', fontSize: 16, flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addFriend(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button className="btn btn-primary" style={{ padding: '0 20px', fontSize: 16, background: 'var(--nb-yellow)' }}>Add</button>
          </div>

          {friends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--nb-black)' }}>
              <div style={{ fontSize: 40, opacity: 0.5, marginBottom: 12 }}>🤝</div>
              <p style={{ fontWeight: 800 }}>No friends added yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {friends.map(f => (
                <div key={f.id} style={{
                  padding: '16px', background: 'var(--nb-white)', border: '3px solid var(--nb-black)',
                  borderRadius: 'var(--radius-sm)', transition: 'var(--t-fast)', boxShadow: '2px 2px 0 var(--nb-black)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 18, color: 'var(--nb-black)' }}>{f.name}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 18, color: 'var(--nb-green)' }}>{f.xp} <span style={{fontSize: 12, fontWeight: 700, color: 'var(--text-muted)'}}>XP</span></div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8 }}>{f.level}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>⚡</span> {f.latestAction}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COL: LEADERBOARD */}
        <div className="nb-card cyan" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div className="section-title">🏆 Global Leaderboard</div>
          
          <div style={{ background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: '4px 4px 0 var(--nb-black)', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '4px solid var(--nb-black)', background: 'var(--nb-yellow)', textAlign: 'left' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--nb-black)', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>RANK</th>
                  <th style={{ padding: '16px 20px', color: 'var(--nb-black)', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>USER</th>
                  <th style={{ padding: '16px 20px', color: 'var(--nb-black)', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 16, letterSpacing: 1, textAlign: 'right' }}>TOTAL XP</th>
                </tr>
              </thead>
              <tbody>
                {globalLeaderboard.map((entry, index) => (
                  <tr key={entry.name} style={{ 
                    borderBottom: index < globalLeaderboard.length - 1 ? '2px solid var(--nb-black)' : 'none',
                    background: entry.name === 'You' ? 'var(--nb-lime)' : 'transparent',
                  }}>
                    <td style={{ padding: '16px 20px', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)' }}>
                      #{entry.rank}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 18, color: 'var(--nb-black)' }}>
                        {entry.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
                        {entry.level}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-pink)', textShadow: '1px 1px 0 #000' }}>
                      {entry.xp} <span style={{fontSize: 14, color: 'var(--nb-black)', fontWeight: 800, textShadow: 'none'}}>XP</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 32 }}>
            <div style={{ padding: 24, background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: 'var(--radius-sm)', textAlign: 'center', boxShadow: '4px 4px 0 var(--nb-black)' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)', marginBottom: 8, textTransform: 'uppercase' }}>Weekly Community Challenge</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 20 }}>Together, plant 50,000 virtual trees this week!</p>
              
              <div style={{ height: 24, background: 'var(--bg-base)', border: '3px solid var(--nb-black)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'var(--nb-green)', borderRight: '3px solid var(--nb-black)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 14, fontWeight: 900, color: 'var(--nb-black)', fontFamily: 'Space Grotesk' }}>
                <span>32,500 planted</span>
                <span>50,000 target</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
