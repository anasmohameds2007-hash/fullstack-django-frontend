import { useRef, useEffect } from "react";

export default function Prism({
  animationType = "rotate",
  timeScale = 1,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0,
  glow = 1,
}) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const numLines = 10;
      for (let i = 0; i < numLines; i++) {
        const t = frame * 0.02 * timeScale + i;
        const x = w / 2 + Math.sin(t + i) * w * 0.3;
        const y = h / 2 + Math.cos(t + i) * h * 0.3;

        const hue = (frame * colorFrequency + i * 20 + hueShift) % 360;
        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.lineWidth = baseWidth;
        ctx.shadowBlur = glow * 10;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;

        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      frame++;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationType, timeScale, baseWidth, hueShift, colorFrequency, glow]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}