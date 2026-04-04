import { useEffect, useRef } from "react";

type Props = {
  progress: number;
};

function getColor(p: number): { h: number; s: number; l: number } {
  if (p < 40) return { h: 4, s: 72, l: 45 };
  if (p < 75) return { h: 38, s: 85, l: 50 };
  return { h: 145, s: 65, l: 42 };
}

export function CardLiquidFill({ progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef({ level: 0, time: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const anim = animRef.current;

    const draw = () => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);
      anim.time += 0.02;
      anim.level += (progress - anim.level) * 0.03;

      const fillHeight = (anim.level / 100) * h;
      const surfaceY = h - fillHeight;
      const color = getColor(anim.level);

      const grad = ctx.createLinearGradient(0, surfaceY, 0, h);
      grad.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l + 15}%, 0.35)`);
      grad.addColorStop(0.5, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.45)`);
      grad.addColorStop(1, `hsla(${color.h}, ${color.s - 10}%, ${color.l - 8}%, 0.55)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, surfaceY);

      for (let x = 0; x <= w; x += 4) {
        const wave =
          Math.sin(x * 0.02 + anim.time * 1.5) * 3 +
          Math.sin(x * 0.035 + anim.time * 2.2) * 2 +
          Math.sin(x * 0.05 + anim.time * 0.8) * 1.5;
        ctx.lineTo(x, surfaceY + wave);
      }

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = `hsla(${color.h + 20}, ${color.s - 20}%, ${color.l + 25}%, 0.08)`;
      ctx.beginPath();
      ctx.ellipse(
        w * 0.7,
        surfaceY + fillHeight * 0.4,
        w * 0.25,
        fillHeight * 0.2,
        -0.1,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl"
    />
  );
}
