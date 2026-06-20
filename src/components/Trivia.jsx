import { useState, useEffect } from 'react';

const QUESTIONS = [
  {
    id: 1,
    text: "Which of the following activities typically emits the most CO₂?",
    options: ["Eating a beef burger", "Leaving a TV on for 24 hours", "Taking a 10-minute shower", "Driving 1 km in a gas car"],
    answer: 0,
    explanation: "A single beef burger can account for over 2.5 kg of CO₂e, significantly more than leaving a standard LED TV on all day!"
  },
  {
    id: 2,
    text: "Roughly how many trees do you need to plant to offset 1 ton (1000 kg) of CO₂ over their lifetime?",
    options: ["5", "10", "40", "100"],
    answer: 2,
    explanation: "A typical tree absorbs about 21-25 kg of CO₂ per year. Over a 40-year lifespan, roughly 40 trees will offset 1 ton of CO₂."
  },
  {
    id: 3,
    text: "What percentage of global greenhouse gas emissions comes from transportation?",
    options: ["10%", "29%", "50%", "75%"],
    answer: 1,
    explanation: "Transportation accounts for roughly 29% of global greenhouse gas emissions, making it one of the largest contributors."
  },
  {
    id: 4,
    text: "Which diet has the lowest carbon footprint on average?",
    options: ["Pescatarian", "Vegetarian", "Vegan", "Keto (High Meat)"],
    answer: 2,
    explanation: "A vegan diet has the lowest carbon footprint, generating roughly half the emissions of a meat-heavy diet."
  },
  {
    id: 5,
    text: "What is the most effective way to save energy at home during winter?",
    options: ["Using space heaters", "Lowering the thermostat by 1-2°C", "Leaving lights on for warmth", "Running the oven with the door open"],
    answer: 1,
    explanation: "Lowering your thermostat by just 1-2 degrees Celsius can reduce your heating energy consumption by up to 10%!"
  }
];

export default function Trivia({ user, updateUser, addToast, refresh }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const question = QUESTIONS[currentQ];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    if (idx === question.answer) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const xpGained = 15 + (streak * 5); // Bonus XP for streaks
      updateUser(u => ({ ...u, xp: (u.xp || 0) + xpGained }));
      addToast({ type: 'success', icon: '🧠', title: 'Correct!', message: `Earned ${xpGained} XP!` });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setAnswered(false);
    setCurrentQ(prev => (prev + 1) % QUESTIONS.length); // Loop back for now
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">🧠 Eco <span>Trivia</span></div>
            <div className="page-subtitle">Test your knowledge, learn about climate action, and earn bonus XP!</div>
          </div>
        </div>
        <div className="page-header-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
        
        {/* TRIVIA BOARD */}
        <div className="nb-card yellow" style={{ padding: 40, border: '6px solid var(--nb-black)', boxShadow: '8px 8px 0 var(--nb-black)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontFamily: 'Space Grotesk', fontWeight: 900, color: 'var(--nb-black)' }}>
            <span style={{ fontSize: 20 }}>QUESTION {currentQ + 1}</span>
            <span style={{ fontSize: 20, color: 'var(--nb-pink)' }}>🔥 STREAK: {streak}</span>
          </div>

          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, color: 'var(--nb-black)', lineHeight: 1.3, marginBottom: 32 }}>
            {question.text}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {question.options.map((opt, idx) => {
              let btnClass = 'btn-outline';
              let bgColor = 'var(--nb-white)';
              if (answered) {
                if (idx === question.answer) bgColor = 'var(--nb-green)';
                else if (idx === selected) bgColor = '#D32F2F'; // red
              } else if (idx === selected) {
                bgColor = 'var(--nb-cyan)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  style={{
                    padding: '20px', background: bgColor,
                    border: '4px solid var(--nb-black)', borderRadius: 'var(--radius-sm)',
                    textAlign: 'left', cursor: answered ? 'default' : 'pointer', transition: 'var(--t-fast)',
                    boxShadow: answered ? '2px 2px 0 var(--nb-black)' : '4px 4px 0 var(--nb-black)',
                    transform: answered && idx !== selected && idx !== question.answer ? 'scale(0.98)' : 'none',
                    opacity: answered && idx !== selected && idx !== question.answer ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', gap: 16
                  }}
                >
                  <div style={{ width: 32, height: 32, background: 'var(--nb-black)', color: 'var(--nb-white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 900 }}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: answered && idx === selected && idx !== question.answer ? 'var(--nb-white)' : 'var(--nb-black)' }}>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="animate-fade-in" style={{ marginTop: 32, padding: 24, background: 'var(--nb-white)', border: '4px solid var(--nb-black)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Space Grotesk', color: selected === question.answer ? 'var(--nb-green)' : '#D32F2F', marginBottom: 8, textTransform: 'uppercase' }}>
                {selected === question.answer ? '✅ Correct!' : '❌ Incorrect!'}
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--nb-black)', marginBottom: 20 }}>
                {question.explanation}
              </p>
              <button className="btn btn-primary" onClick={nextQuestion} style={{ fontSize: 20, width: '100%', padding: '16px' }}>
                NEXT QUESTION ➔
              </button>
            </div>
          )}
        </div>

        {/* STATS PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="nb-card cyan">
            <div className="section-title">📊 Session Stats</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--nb-black)', paddingBottom: 12, marginBottom: 12 }}>
              <span style={{ fontWeight: 800, color: 'var(--nb-black)', textTransform: 'uppercase' }}>Correct</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)' }}>{score}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--nb-black)', paddingBottom: 12, marginBottom: 12 }}>
              <span style={{ fontWeight: 800, color: 'var(--nb-black)', textTransform: 'uppercase' }}>Questions</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-black)' }}>{currentQ + (answered ? 1 : 0)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: 'var(--nb-black)', textTransform: 'uppercase' }}>Current XP</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 24, color: 'var(--nb-pink)' }}>{user?.xp || 0}</span>
            </div>
          </div>

          <div className="nb-card pink">
            <div className="section-title">💡 Did you know?</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--nb-black)', lineHeight: 1.5 }}>
              By answering Trivia questions daily, you can earn up to 50 XP per day! This is a great way to level up and deal damage to Bosses even if you couldn't log any activities.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
