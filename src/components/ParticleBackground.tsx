"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface TransientConnection {
  particleA: Particle;
  particleB: Particle;
  life: number;
  maxLife: number;
}

// Configurable constants for the neural network / constellation physics
const CONFIG = {
  desktopCount: 65,
  tabletCount: 38,
  mobileCount: 22,
  minRadius: 1.2,
  maxRadius: 2.2,
  minSpeed: 0.15,
  maxSpeed: 0.35,
  connectionDistanceDesktop: 130,
  connectionDistanceMobile: 90,
  lineBaseAlpha: 0.20,
  mouseRadius: 110,
  mouseRepelForce: 0.65,
  clickBlastRadius: 180,
  clickImpulse: 7.0,
  springFactor: 0.022,
  damping: 0.94,
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device for the hint text
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (null when off-screen)
    let mouseX: number | null = null;
    let mouseY: number | null = null;

    const ripples: ClickRipple[] = [];
    const transientLines: TransientConnection[] = [];
    const particles: Particle[] = [];

    // Responsive configuration
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const particleCount = isMobile
      ? CONFIG.mobileCount
      : isTablet
      ? CONFIG.tabletCount
      : CONFIG.desktopCount;

    const maxConnectionDistance = isMobile
      ? CONFIG.connectionDistanceMobile
      : CONFIG.connectionDistanceDesktop;
    const maxConnectionDistanceSq = maxConnectionDistance * maxConnectionDistance;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Create particle instances
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed =
        Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed;
      const x = Math.random() * width;
      const y = Math.random() * height;

      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        radius:
          Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) +
          CONFIG.minRadius,
        alpha: Math.random() * 0.35 + 0.45,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Static render for users who prefer reduced motion
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxConnectionDistanceSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha =
              (1 - dist / maxConnectionDistance) * CONFIG.lineBaseAlpha * 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(203, 213, 225, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha * 0.8})`;
        ctx.fill();
      }

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    // Subtle mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    // Click handler for particle interaction
    const handlePointerDown = (e: MouseEvent) => {
      // Do NOT trigger particle interactions when clicking interactive UI elements
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "a, button, input, textarea, select, [role='button'], .cursor-pointer, nav"
        )
      ) {
        return;
      }

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Find nearest particle
      let nearestParticle: Particle | null = null;
      let minDistance = Infinity;

      for (const p of particles) {
        const d = Math.hypot(p.x - clickX, p.y - clickY);
        if (d < minDistance) {
          minDistance = d;
          nearestParticle = p;
        }
      }

      // Center explosion on nearest particle if reasonably close (within 80px), otherwise at click
      const blastCenterX =
        nearestParticle && minDistance < 80 ? nearestParticle.x : clickX;
      const blastCenterY =
        nearestParticle && minDistance < 80 ? nearestParticle.y : clickY;

      // 1. Trigger ripple wave
      ripples.push({
        x: blastCenterX,
        y: blastCenterY,
        radius: 3,
        maxRadius: CONFIG.clickBlastRadius,
        alpha: 0.75,
        color: "rgba(226, 232, 240, 0.8)",
      });

      // 2. Physical push: Push nearby particles outward
      const blastNeighbors: Particle[] = [];
      for (const p of particles) {
        const dx = p.x - blastCenterX;
        const dy = p.y - blastCenterY;
        const dist = Math.hypot(dx, dy);

        if (dist < CONFIG.clickBlastRadius && dist > 1) {
          blastNeighbors.push(p);
          const force =
            Math.pow(1 - dist / CONFIG.clickBlastRadius, 1.8) *
            CONFIG.clickImpulse;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // 3. Create transient extra connection lines between neighbors during blast
      if (nearestParticle) {
        for (const neighbor of blastNeighbors) {
          if (neighbor !== nearestParticle) {
            transientLines.push({
              particleA: nearestParticle,
              particleB: neighbor,
              life: 0,
              maxLife: 55, // ~1 second flare
            });
          }
        }
      }

      // Dismiss the hint
      setHasInteracted(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Main 60 FPS animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update & draw shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 3.4;
        ripple.alpha *= 0.93;

        if (ripple.alpha <= 0.02 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = ripple.alpha;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update particle physics (drift, mouse repulsion, spring back to equilibrium)
      for (const p of particles) {
        // Subtle mouse repulsion when cursor is close
        if (mouseX !== null && mouseY !== null) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < CONFIG.mouseRadius && dist > 1) {
            const force =
              (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseRepelForce;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Spring force returning particle gently toward its drift origin
        const springX = (p.originX - p.x) * CONFIG.springFactor;
        const springY = (p.originY - p.y) * CONFIG.springFactor;
        p.vx += springX;
        p.vy += springY;

        // Damping/friction
        p.vx *= CONFIG.damping;
        p.vy *= CONFIG.damping;

        // Advance natural drift origin
        p.originX += p.baseVx;
        p.originY += p.baseVy;

        p.x += p.vx + p.baseVx;
        p.y += p.vy + p.baseVy;

        // Screen boundary wrapping for seamless continuous canvas
        const margin = 20;
        if (p.x < -margin) {
          p.x = width + margin;
          p.originX = p.x;
        } else if (p.x > width + margin) {
          p.x = -margin;
          p.originX = p.x;
        }
        if (p.y < -margin) {
          p.y = height + margin;
          p.originY = p.y;
        } else if (p.y > height + margin) {
          p.y = -margin;
          p.originY = p.y;
        }

        // Subtle gentle breathing pulse
        p.pulsePhase += p.pulseSpeed;
      }

      // 3. Render connection lines between nearby particles
      ctx.lineWidth = 0.85;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectionDistanceSq) {
            const dist = Math.sqrt(distSq);
            let lineAlpha =
              (1 - dist / maxConnectionDistance) *
              CONFIG.lineBaseAlpha *
              Math.min(a.alpha, b.alpha);

            // Slightly boost line opacity near mouse cursor
            if (mouseX !== null && mouseY !== null) {
              const mouseDist = Math.hypot(a.x - mouseX, a.y - mouseY);
              if (mouseDist < CONFIG.mouseRadius) {
                lineAlpha *= 1.45;
              }
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(203, 213, 225, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // 4. Render transient flare lines generated by clicking a particle
      for (let i = transientLines.length - 1; i >= 0; i--) {
        const line = transientLines[i];
        line.life++;
        const progress = line.life / line.maxLife;

        if (progress >= 1) {
          transientLines.splice(i, 1);
          continue;
        }

        const flareAlpha = (1 - progress) * 0.45;
        ctx.beginPath();
        ctx.moveTo(line.particleA.x, line.particleA.y);
        ctx.lineTo(line.particleB.x, line.particleB.y);
        ctx.strokeStyle = `rgba(226, 232, 240, ${flareAlpha})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // 5. Draw particles (dots)
      for (const p of particles) {
        const currentAlpha =
          p.alpha + Math.sin(p.pulsePhase) * 0.1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 245, 249, ${Math.max(0.2, currentAlpha)})`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.shadowBlur = 3;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Background Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-55 dark:opacity-45 transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* Subtle Hint Text (inspired by williamlin.io) */}
      <div
        className={`pointer-events-none fixed bottom-5 right-6 z-10 select-none font-mono text-[11px] tracking-wider text-foreground/35 transition-opacity duration-700 ${
          hasInteracted ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        {isTouchDevice ? "tap the particles..." : "click the particles..."}
      </div>
    </>
  );
}
