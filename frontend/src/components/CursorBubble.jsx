import { useEffect, useState } from 'react';
import './CursorBubble.css';

export default function CursorBubble() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Create a new bubble at click position
      const newBubble = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 20 + 10, // Random size between 10-30px
        color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`, // Random vibrant color
      };

      setBubbles((prev) => [...prev, newBubble]);

      // Remove bubble after animation completes (1 second)
      setTimeout(() => {
        setBubbles((prev) => prev.filter((bubble) => bubble.id !== newBubble.id));
      }, 1000);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="cursor-bubble"
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle at 30% 30%, ${bubble.color}, transparent)`,
            boxShadow: `
              inset 0 0 ${bubble.size / 4}px rgba(255, 255, 255, 0.8),
              inset ${bubble.size / 8}px ${bubble.size / 8}px ${bubble.size / 4}px rgba(255, 255, 255, 0.6),
              0 0 ${bubble.size / 2}px ${bubble.color}
            `,
          }}
        />
      ))}
    </>
  );
}
