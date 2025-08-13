import React, { useEffect, useRef } from "react";

// Overlay that renders pixel-art style laser and explosion particles on click/tap
// Also generates retro sound effects via WebAudio for minimal payload
export default function LaserFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let audioCtx: AudioContext | null = null;

    const state = {
      width: 0,
      height: 0,
      lasers: [] as Array<{
        x: number;
        y: number;
        t: number;
        ttl: number;
        dir: number;
      }>,
      particles: [] as Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        max: number;
      }>,
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
    };

    const getVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const hsl = (v: string) => `hsl(${getVar(v)})`;

    const playShot = () => {
      if (!audioCtx)
        audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      // Laser pew: square wave with quick pitch slide
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(880, t);
      o.frequency.exponentialRampToValueAtTime(440, t + 0.08);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.13);
    };

    const playExplosion = () => {
      if (!audioCtx)
        audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      if (!audioCtx) return;
      const bufferSize = 0.2; // seconds
      const sampleRate = audioCtx.sampleRate;
      const frameCount = Math.floor(sampleRate * bufferSize);
      const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount); // white noise with decay
      const src = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + bufferSize
      );
      src.buffer = buffer;
      src.connect(gain).connect(audioCtx.destination);
      src.start();
    };

    const handlePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * dpr;
      const y = (clientY - rect.top) * dpr;

      // Laser going upward (classic Galactica style) — shorter and snappier
      state.lasers.push({ x, y, t: 0, ttl: 0.08, dir: -1 });

      // Small explosion particles at click point
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = (60 + Math.random() * 80) * dpr;
        state.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 0.4 + Math.random() * 0.3,
        });
      }

      playShot();
      playExplosion();
    };

    const onPointerDown = (e: PointerEvent) => {
      handlePointer(e.clientX, e.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handlePointer(t.clientX, t.clientY);
    };

    const loop = (time: number) => {
      const now = time / 1000;
      const dt = Math.min(0.033, now - state.lastTime || 0.016);
      state.lastTime = now;

      // Clear only what we draw (transparent canvas overlay)
      ctx.clearRect(0, 0, state.width, state.height);

      const beamColor = hsl("--primary");
      const explosionColor = hsl("--accent");

      // Lasers
      for (let i = state.lasers.length - 1; i >= 0; i--) {
        const L = state.lasers[i];
        L.t += dt;
        const p = Math.min(1, L.t / L.ttl);
        // Shorter beam length
        const len = (36 * (1 - p) + 24) * dpr;
        const alpha = 1 - p;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = beamColor.replace(")", ` / ${0.9 * alpha})`);
        // Thinner beam width
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(L.x, L.y);
        ctx.lineTo(L.x, L.y + L.dir * len);
        ctx.stroke();
        ctx.restore();
        if (p >= 1) state.lasers.splice(i, 1);
      }

      // Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const P = state.particles[i];
        P.life += dt;
        if (P.life >= P.max) {
          state.particles.splice(i, 1);
          continue;
        }
        // friction and gravity feel
        P.vx *= 0.985;
        P.vy = P.vy * 0.985 + 20 * dpr * dt;
        P.x += P.vx * dt;
        P.y += P.vy * dt;

        const alpha = 1 - P.life / P.max;
        ctx.fillStyle = explosionColor.replace(")", ` / ${0.8 * alpha})`);
        ctx.fillRect(P.x - 2 * dpr, P.y - 2 * dpr, 4 * dpr, 4 * dpr);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    rafRef.current = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchstart", onTouchStart);
      if (audioCtx) audioCtx.close();
    };
  }, [dpr]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
}
