import { useState, useRef, useEffect } from 'react';
import { COACH_RESPONSES } from '../utils/constants';
import { getCoachMessages, saveCoachMessages, getLogs, getTotalKg, getKgByCategory } from '../utils/storage';

const QUICK_PROMPTS = [
  { icon: '🚗', text: 'How can I cut transport emissions?' },
  { icon: '🥗', text: 'Best dietary changes for CO₂?' },
  { icon: '⚡', text: 'Tips to reduce home energy?' },
  { icon: '📊', text: 'Analyse my carbon footprint' },
  { icon: '🎯', text: 'How do I hit my monthly target?' },
  { icon: '🌲', text: 'Which offsets are most effective?' },
];

function getBotResponse(input, logs) {
  const lower = input.toLowerCase();
  const total = getTotalKg(logs);
  const cats  = getKgByCategory(logs);
  const top   = Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];

  if (lower.includes('analys') || lower.includes('footprint') || lower.includes('breakdown')) {
    if (top) return `📊 Your biggest impact area is **${top[0]}** at **${top[1].toFixed(1)} kg CO₂e**. Your total logged footprint is **${total.toFixed(1)} kg**. Focus on reducing ${top[0]} first — biggest gains there! 🎯`;
    return `📊 You've logged **${total.toFixed(1)} kg CO₂e** so far. Log more activities to get a full breakdown! 📋`;
  }
  if (lower.includes('target') || lower.includes('goal')) {
    return `🎯 Your target is set at **70% of your baseline**. You're currently at **${total.toFixed(1)} kg CO₂e**. Consistency beats big one-off changes — try logging every day this week! 💪`;
  }
  if (lower.includes('transport') || lower.includes('car') || lower.includes('driv')) {
    return COACH_RESPONSES.transport[Math.floor(Math.random()*COACH_RESPONSES.transport.length)];
  }
  if (lower.includes('diet') || lower.includes('food') || lower.includes('meat') || lower.includes('vegan')) {
    return COACH_RESPONSES.diet[Math.floor(Math.random()*COACH_RESPONSES.diet.length)];
  }
  if (lower.includes('energy') || lower.includes('electric') || lower.includes('heat')) {
    return COACH_RESPONSES.energy[Math.floor(Math.random()*COACH_RESPONSES.energy.length)];
  }
  if (lower.includes('offset') || lower.includes('tree') || lower.includes('plant')) {
    return `🌳 Offsets complement reductions but don't replace them. Head to **Offset Forest** to plant virtual trees and fund renewables using your EcoPoints. Each tree offsets ~21 kg CO₂/year!`;
  }
  return COACH_RESPONSES.general[Math.floor(Math.random()*COACH_RESPONSES.general.length)];
}

function formatMsg(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**')
      ? <strong key={i} style={{ color: 'var(--nb-black)', background: 'var(--nb-yellow)', padding: '0 4px', border: '2px solid var(--nb-black)' }}>{p.slice(2,-2)}</strong>
      : p
  );
}

export default function EcoCoach({ user, updateUser, addToast }) {
  const logs = getLogs();
  const [messages, setMessages] = useState(() => {
    const saved = getCoachMessages();
    if (saved.length > 0) return saved;
    return [{ id: 1, role: 'bot', text: COACH_RESPONSES.greeting[0], ts: Date.now() }];
  });
  const [input,   setInput]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { saveCoachMessages(messages.slice(-40)); }, [messages]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: msg, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    if (user && !(user.badges || []).includes('coach_chat')) {
      updateUser(u => ({ ...u, badges: [...(u.badges||[]), 'coach_chat'], xp: (u.xp||0) + 20 }));
      addToast({ type: 'success', icon: '🤖', title: 'Badge: Coach Consulted!', message: '+20 XP' });
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, role: 'bot', text: getBotResponse(msg, logs), ts: Date.now() }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const clearChat = () => {
    const fresh = [{ id: Date.now(), role: 'bot', text: COACH_RESPONSES.greeting[Math.floor(Math.random()*2)], ts: Date.now() }];
    setMessages(fresh);
    saveCoachMessages(fresh);
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .msg { max-width: 80%; display: flex; flex-direction: column; animation: comicPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .msg.user { align-self: flex-end; align-items: flex-end; }
        .msg.bot { align-self: flex-start; align-items: flex-start; }
        .msg-bubble { padding: 14px 18px; border-radius: var(--radius-sm); font-size: 16px; font-weight: 600; line-height: 1.5; color: var(--nb-black); border: 3px solid var(--nb-black); box-shadow: 2px 2px 0 var(--nb-black); }
        .msg.user .msg-bubble { background: var(--nb-yellow); border-bottom-right-radius: 0; }
        .msg.bot .msg-bubble { background: var(--nb-white); border-bottom-left-radius: 0; }
        .msg-time { font-size: 12px; color: var(--text-muted); font-weight: 800; margin-top: 6px; text-transform: uppercase; }
        
        .chat-input { flex: 1; padding: 16px 24px; background: var(--nb-white); border: 3px solid var(--nb-black); border-radius: var(--radius-sm); color: var(--nb-black); font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; outline: none; transition: var(--t-fast); box-shadow: inset 2px 2px 0 rgba(0,0,0,0.05); }
        .chat-input:focus { box-shadow: 4px 4px 0 var(--nb-cyan); transform: translate(-2px, -2px); }
        
        .typing-indicator { display: flex; gap: 6px; padding: 12px 18px; background: var(--nb-white); border: 3px solid var(--nb-black); border-radius: var(--radius-sm); border-bottom-left-radius: 0; box-shadow: 2px 2px 0 var(--nb-black); }
        .typing-dot { width: 8px; height: 8px; background: var(--nb-black); border-radius: 50%; animation: typeBounce 1.4s infinite ease-in-out both; }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; } .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typeBounce { 0%, 80%, 100% { transform: scale(0.6); } 40% { transform: scale(1.2); } }
        
        .qp-btn { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--nb-white); border: 3px solid var(--nb-black); border-radius: var(--radius-sm); color: var(--nb-black); font-size: 15px; font-weight: 800; cursor: pointer; transition: var(--t-fast); text-align: left; width: 100%; box-shadow: 2px 2px 0 var(--nb-black); }
        .qp-btn:hover { background: var(--nb-cyan); transform: translate(-2px, -2px); box-shadow: 4px 4px 0 var(--nb-black); }
      `}</style>

      <div className="page-header" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">🤖 Eco<span>Coach AI</span></div>
            <div className="page-subtitle">Your AI sustainability advisor — personalised, instant, always on.</div>
          </div>
          <button className="btn btn-outline" onClick={clearChat} style={{ fontSize: 14, padding: '8px 16px', background: 'var(--nb-pink)' }}>
            🗑 Reboot System
          </button>
        </div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        {/* Chat Window */}
        <div className="nb-card" style={{ display: 'flex', flexDirection: 'column', height: 650, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', background: 'var(--nb-yellow)', borderBottom: '4px solid var(--nb-black)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 32, filter: 'drop-shadow(2px 2px 0 #000)' }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)', letterSpacing: 1, textTransform: 'uppercase' }}>ECO_COACH_v5.0</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, background: 'var(--nb-black)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12, color: 'var(--nb-black)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>System Online</span>
              </div>
            </div>
            <span className="pill pill-cyan">AI MODEL</span>
          </div>

          <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--bg-base)' }}>
            {messages.map((m, idx) => (
              <div key={m.id} className={`msg ${m.role}`}>
                {m.role === 'bot' && (
                  <div style={{ fontSize: 11, color: 'var(--nb-black)', marginBottom: 6, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                    <span style={{ background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>SYS</span>EcoCoach
                  </div>
                )}
                <div className="msg-bubble">
                  {formatMsg(m.text)}
                </div>
                <div className="msg-time">{new Date(m.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            ))}
            {typing && (
              <div className="msg bot">
                <div style={{ fontSize: 11, color: 'var(--nb-black)', marginBottom: 6, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                  <span style={{ background: 'var(--nb-black)', color: 'var(--nb-white)', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>SYS</span>EcoCoach
                </div>
                <div className="typing-indicator">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '20px 24px', background: 'var(--nb-white)', borderTop: '4px solid var(--nb-black)', display: 'flex', gap: 16 }}>
            <input className="chat-input"
              placeholder="Query the system... 🌍"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              autoFocus
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={!input.trim()} style={{ borderRadius: 'var(--radius-sm)', width: 64, height: 64, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: 'var(--nb-cyan)' }}>
              ➤
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Quick prompts */}
          <div className="nb-card pink">
            <div className="section-title">⚡ Quick Queries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} className="qp-btn" onClick={() => send(q.text)}>
                  <span style={{ fontSize: 20 }}>{q.icon}</span> {q.text}
                </button>
              ))}
            </div>
          </div>

          {/* Eco stats */}
          <div className="nb-card cyan">
            <div className="section-title">📊 Profile Telemetry</div>
            {[
              { label: 'Total Output', val: `${getTotalKg(logs).toFixed(1)} kg`, col: 'var(--nb-pink)', icon: '💨' },
              { label: 'Activities',   val: logs.length,                          col: 'var(--nb-yellow)', icon: '📋' },
              { label: 'XP Earned',    val: user?.xp ? `${user.xp} XP` : '0 XP', col: 'var(--nb-lime)', icon: '⭐' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', background: 'var(--nb-white)',
                borderRadius: 'var(--radius-sm)', marginBottom: 12,
                border: `3px solid var(--nb-black)`, boxShadow: '2px 2px 0 var(--nb-black)'
              }}>
                <span style={{ color: 'var(--nb-black)', display: 'flex', gap: 12, alignItems: 'center', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>{s.label}
                </span>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: s.col, textShadow: '1px 1px 0 #000' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
