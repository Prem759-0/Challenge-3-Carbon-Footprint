import { useEffect, useState } from 'react';

export default function ComicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    let frame;
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      // Add trail element every few pixels
      if (Math.random() > 0.6) {
        const id = Date.now() + Math.random();
        setTrails(prev => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== id));
        }, 400); // trail duration
      }
    };
    
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        .comic-cursor {
          position: fixed; pointer-events: none; z-index: 999999;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--nb-yellow); border: 3px solid var(--nb-black);
          transform: translate(-50%, -50%); transition: transform 0.1s ease;
          box-shadow: 4px 4px 0 var(--nb-black);
          display: flex; align-items: center; justify-content: center;
        }
        .comic-cursor.clicked { transform: translate(-50%, -50%) scale(0.7); background: var(--nb-pink); }
        .comic-cursor::after {
          content: ''; position: absolute; width: 6px; height: 6px; background: var(--nb-black); border-radius: 50%;
        }
        .comic-trail {
          position: fixed; pointer-events: none; z-index: 999998;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--nb-cyan); border: 2px solid var(--nb-black);
          transform: translate(-50%, -50%);
          animation: fadeTrail 0.4s forwards;
        }
        @keyframes fadeTrail {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
      `}</style>
      
      {trails.map(t => (
        <div key={t.id} className="comic-trail" style={{ left: t.x, top: t.y }} />
      ))}
      
      <div 
        className={`comic-cursor ${clicked ? 'clicked' : ''}`}
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  );
}
