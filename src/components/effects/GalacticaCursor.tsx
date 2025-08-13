import React, { useEffect, useRef, useState } from "react";
import shipPng from "@/assets/galactica-cursor.png";

interface Position {
  x: number;
  y: number;
}

interface TrailParticle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

interface Laser {
  x: number;
  y: number;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
}

interface Explosion {
  x: number;
  y: number;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
  }>;
  life: number;
  maxLife: number;
  // visual ring burst
  ringMaxRadius?: number;
}

export default function GalacticaCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<Position>({ x: 0, y: 0 });
  const spaceshipPos = useRef<Position>({ x: 0, y: 0 });
  const trail = useRef<TrailParticle[]>([]);
  const lasers = useRef<Laser[]>([]);
  const explosions = useRef<Explosion[]>([]);
  const lastTime = useRef<number>(0);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let audioCtx: AudioContext | null = null;

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
    };

    const getVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const hsl = (v: string) => `hsl(${getVar(v)})`;

    const playLaserSound = () => {
      if (!audioCtx)
        audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.16);
    };

    const playExplosionSound = () => {
      if (!audioCtx)
        audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      if (!audioCtx) return;
      const bufferSize = 0.15;
      const sampleRate = audioCtx.sampleRate;
      const frameCount = Math.floor(sampleRate * bufferSize);
      const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount) * 0.3;
      }
      const src = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + bufferSize
      );
      src.buffer = buffer;
      src.connect(gain).connect(audioCtx.destination);
      src.start();
    };

    const createExplosion = (x: number, y: number) => {
      const particleCount = 12;
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = (40 + Math.random() * 60) * dpr;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.3 + Math.random() * 0.2,
        });
      }
      explosions.current.push({
        x,
        y,
        particles,
        life: 0,
        maxLife: 0.6,
        ringMaxRadius: 28 * dpr,
      });
      playExplosionSound();
    };

    const checkCollision = (laser: Laser) => {
      const laserX = laser.x / dpr;
      const laserY = laser.y / dpr;

      // Check viewport edges
      if (
        laserX <= 0 ||
        laserX >= window.innerWidth ||
        laserY <= 0 ||
        laserY >= window.innerHeight
      ) {
        createExplosion(laser.x, laser.y);
        return true;
      }

      // Check clickable elements
      const element = document.elementFromPoint(laserX, laserY);
      if (
        element &&
        (element.tagName === "A" ||
          element.tagName === "BUTTON" ||
          element.closest("a") ||
          element.closest("button") ||
          element.classList.contains("hover-scale") ||
          element.classList.contains("story-link"))
      ) {
        // Brief visual feedback on hit to match hover-scale
        const target = (element.closest("a") ||
          element.closest("button") ||
          element) as HTMLElement;
        target.classList.add("laser-hit");
        setTimeout(() => target.classList.remove("laser-hit"), 150);
        createExplosion(laser.x, laser.y);
        // Trigger click after a brief delay for explosion effect
        setTimeout(() => {
          if (element.tagName === "A" || element.closest("a")) {
            (element as HTMLAnchorElement).click();
          } else if (
            element.tagName === "BUTTON" ||
            element.closest("button")
          ) {
            (element as HTMLButtonElement).click();
          }
        }, 100);
        return true;
      }

      return false;
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = spaceshipPos.current.x;
      const startY = spaceshipPos.current.y;

      // Calculate angle towards mouse direction (spaceship nose forward)
      const angle = -Math.PI / 2; // Pointing upward

      lasers.current.push({
        x: startX,
        y: startY,
        startX,
        startY,
        angle,
        // Faster so it feels snappy with shorter beam
        speed: 1000 * dpr,
        life: 0,
        // Shorter lifetime to reduce on-screen length
        maxLife: 0.25,
      });

      playLaserSound();
    };

    const updateTrail = (dt: number) => {
      // Add new trail particle
      if (Math.random() < 0.7) {
        trail.current.push({
          x: spaceshipPos.current.x,
          y: spaceshipPos.current.y + 15 * dpr, // Behind spaceship
          life: 0,
          maxLife: 0.5 + Math.random() * 0.3,
        });
      }

      // Update existing trail particles
      for (let i = trail.current.length - 1; i >= 0; i--) {
        const particle = trail.current[i];
        particle.life += dt;
        if (particle.life >= particle.maxLife) {
          trail.current.splice(i, 1);
        }
      }
    };

    const updateLasers = (dt: number) => {
      for (let i = lasers.current.length - 1; i >= 0; i--) {
        const laser = lasers.current[i];
        laser.life += dt;

        laser.x += Math.cos(laser.angle) * laser.speed * dt;
        laser.y += Math.sin(laser.angle) * laser.speed * dt;

        if (checkCollision(laser) || laser.life >= laser.maxLife) {
          lasers.current.splice(i, 1);
        }
      }
    };

    const updateExplosions = (dt: number) => {
      for (let i = explosions.current.length - 1; i >= 0; i--) {
        const explosion = explosions.current[i];
        explosion.life += dt;

        for (let j = explosion.particles.length - 1; j >= 0; j--) {
          const particle = explosion.particles[j];
          particle.life += dt;
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          particle.vx *= 0.95; // friction
          particle.vy *= 0.95;

          if (particle.life >= particle.maxLife) {
            explosion.particles.splice(j, 1);
          }
        }

        if (
          explosion.life >= explosion.maxLife ||
          explosion.particles.length === 0
        ) {
          explosions.current.splice(i, 1);
        }
      }
    };

    const animate = (time: number) => {
      const now = time / 1000;
      const dt = Math.min(0.033, now - lastTime.current || 0.016);
      lastTime.current = now;

      // Smooth spaceship movement
      const targetX = mousePos.current.x * dpr;
      const targetY = mousePos.current.y * dpr;
      spaceshipPos.current.x += (targetX - spaceshipPos.current.x) * 0.15;
      spaceshipPos.current.y += (targetY - spaceshipPos.current.y) * 0.15;

      // Update the DOM cursor element position (convert back to CSS pixels)
      if (cursorRef.current) {
        const cssX = spaceshipPos.current.x / dpr;
        const cssY = spaceshipPos.current.y / dpr;
        cursorRef.current.style.left = `${cssX}px`;
        cursorRef.current.style.top = `${cssY}px`;
      }

      updateTrail(dt);
      updateLasers(dt);
      updateExplosions(dt);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryColor = hsl("--primary");
      const accentColor = hsl("--accent");
      const trailColor = "hsl(30 100% 50%)"; // orange

      // Draw trail particles (orange)
      trail.current.forEach((particle) => {
        const alpha = 1 - particle.life / particle.maxLife;
        const size = (3 + Math.random() * 2) * dpr;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = trailColor.replace(")", ` / ${0.6 * alpha})`);
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
        ctx.restore();
      });

      // Draw lasers
      lasers.current.forEach((laser) => {
        const alpha = 1 - laser.life / laser.maxLife;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        // Thinner cursor laser
        ctx.strokeStyle = accentColor.replace(")", ` / ${0.9 * alpha})`);
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.x, laser.y);
        ctx.stroke();

        // Subtle glow
        ctx.strokeStyle = accentColor.replace(")", ` / ${0.25 * alpha})`);
        ctx.lineWidth = 4 * dpr;
        ctx.stroke();
        ctx.restore();
      });

      // Draw explosions
      explosions.current.forEach((explosion) => {
        // Ring burst
        const p = Math.min(1, explosion.life / explosion.maxLife);
        const ringAlpha = 0.35 * (1 - p);
        if (explosion.ringMaxRadius && ringAlpha > 0.02) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = accentColor.replace(")", ` / ${ringAlpha})`);
          ctx.lineWidth = 3 * dpr;
          ctx.beginPath();
          ctx.arc(
            explosion.x,
            explosion.y,
            explosion.ringMaxRadius * p,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }

        // Particles
        explosion.particles.forEach((particle) => {
          const alpha = 1 - particle.life / particle.maxLife;
          const size = (4 + Math.random() * 3) * dpr; // bigger for visibility
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = accentColor.replace(")", ` / ${0.95 * alpha})`);
          ctx.fillRect(
            particle.x - size / 2,
            particle.y - size / 2,
            size,
            size
          );
          ctx.restore();
        });
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseClick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseClick);
      if (audioCtx) audioCtx.close();
    };
  }, [dpr]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        aria-hidden="true"
      />
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: mousePos.current.x,
          top: mousePos.current.y,
          backgroundImage: `url(${shipPng})`,
          backgroundSize: "48px 48px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </>
  );
}
