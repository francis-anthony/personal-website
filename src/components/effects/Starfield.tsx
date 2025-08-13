import React, { useEffect, useRef } from "react";

// Fullscreen starfield with parallax and Earth approach effect
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
      width: 0,
      height: 0,
      layers: [] as Array<{ speed: number; stars: Array<{ x: number; y: number; r: number }> }>,
      lastTime: 0,
    };

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      state.width = canvas.width;
      state.height = canvas.height;

      // Rebuild stars with density based on area
      const area = (innerWidth * innerHeight) / (1280 * 720);
      const base = 220; // baseline number of stars at 1280x720 across all layers
      const total = Math.max(120, Math.floor(base * area));

      const layerConfigs = [
        { speed: 40, count: Math.floor(total * 0.5), size: [0.6, 1.4] },
        { speed: 75, count: Math.floor(total * 0.3), size: [1.0, 2.0] },
        { speed: 120, count: Math.floor(total * 0.2), size: [1.5, 2.6] },
      ];

      state.layers = layerConfigs.map((cfg) => ({
        speed: cfg.speed,
        stars: new Array(cfg.count).fill(0).map(() => ({
          x: Math.random() * state.width,
          y: Math.random() * state.height,
          r: (cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0])) * dpr,
        })),
      }));
    };

    const getVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const hsl = (hslVar: string) => `hsl(${getVar(hslVar)})`;

    const drawEarth = (progress: number) => {
      // Draw an approaching Earth (as a large gradient circle) at the bottom center
      const cx = state.width / 2;
      const maxRadius = Math.max(state.width, state.height) * 0.9;
      const radius = Math.max(0, progress) * maxRadius;
      if (radius <= 2) return;

      const base = hsl("--secondary"); // cyan/mint in themes
      const atmosphere = hsl("--ring"); // accent ring

      const grad = ctx.createRadialGradient(
        cx,
        state.height + radius * 0.25,
        radius * 0.2,
        cx,
        state.height + radius * 0.25,
        radius
      );
      grad.addColorStop(0, atmosphere.replace(")", " / 0.85)"));
      grad.addColorStop(0.35, base.replace(")", " / 0.9)"));
      grad.addColorStop(0.7, base.replace(")", " / 0.8)"));
      grad.addColorStop(1, base.replace(")", " / 0.0)"));

      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(cx, state.height + radius * 0.25, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (time: number) => {
      const now = time / 1000;
      const dt = Math.min(0.033, now - state.lastTime || 0.016);
      state.lastTime = now;

      // Read theme-tied colors every frame so toggling theme updates visuals
      const bg = hsl("--background");
      const star = hsl("--foreground");

      // Clear background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, state.width, state.height);

      // Scroll progress for parallax and Earth size
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      // Parallax multiplier across layers
      const parallax = 1 + progress * 1.2;

      // Draw stars
      ctx.fillStyle = star.replace(")", " / 0.85)");
      state.layers.forEach((layer, idx) => {
        const speed = layer.speed * parallax * dpr;
        for (const s of layer.stars) {
          s.y += speed * dt;
          if (s.y - s.r > state.height) {
            s.y = -s.r;
            s.x = Math.random() * state.width;
          }
          // Slight twinkle per layer
          const alpha = 0.6 + Math.sin((now + (idx + 1) * 0.37 + s.x * 0.001) * 6) * 0.2;
          ctx.fillStyle = star.replace(")", ` / ${alpha})`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Earth approaching based on scroll
      drawEarth(progress);

      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [dpr]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
