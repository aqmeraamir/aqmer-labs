// src/components/collision/CollisionSimulator.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import Particle from "./Particle";
import CollisionControls from "./CollisionControls";
import { MdTouchApp } from "react-icons/md";

// random number 
const rand = (min, max) => Math.random() * (max - min) + min;


const devicePixelRatioSafe = () => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

const defaultOptions = {
  gravity: false,
  gravityAccel: 300, // px/s^2 downward when gravity is on
  elasticity: 0.9, // coefficient of restitution for collisions (0..1)
  friction: 0.000, // simple global damping per second (small)
  maxInitialSpeed: 160,
  minRadius: 6,
  maxRadius: 20,
  showVectors: false,
  showTrails: false,
};

// Physics helpers (pairwise collision resolution)
function resolveCollision(a, b, elasticity) {
  // Vector between centers
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  // Normal vector
  const nx = dx / dist;
  const ny = dy / dist;

  // Relative velocity
  const rvx = b.vx - a.vx;
  const rvy = b.vy - a.vy;

  // Relative velocity along normal
  const velAlongNormal = rvx * nx + rvy * ny;

  // If velocities are separating, do nothing
  if (velAlongNormal > 0) return false;

  // Calculate impulse scalar j
  const invMassA = 1 / a.mass;
  const invMassB = 1 / b.mass;
  const j = -(1 + elasticity) * velAlongNormal / (invMassA + invMassB);

  // Apply impulse
  const impulseX = j * nx;
  const impulseY = j * ny;

  a.vx -= impulseX * invMassA;
  a.vy -= impulseY * invMassA;
  b.vx += impulseX * invMassB;
  b.vy += impulseY * invMassB;

  return true;
}

function separateOverlap(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const overlap = a.radius + b.radius - dist;
  if (overlap > 0) {
    // push each particle away proportionally to mass
    const totalMass = a.mass + b.mass;
    const ux = dx / dist;
    const uy = dy / dist;
    const pushA = (overlap * (b.mass / totalMass));
    const pushB = (overlap * (a.mass / totalMass));
    a.x -= ux * pushA;
    a.y -= uy * pushA;
    b.x += ux * pushB;
    b.y += uy * pushB;
  }
}

const CollisionSimulator = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const particlesRef = useRef([]);
  const collisionsRef = useRef(0);
  const fpsRef = useRef({ lastMeasure: 0, frames: 0, fps: 0 });

  // options / controls
  const [particleCount, setParticleCount] = useState(20);
  const [elasticity, setElasticity] = useState(defaultOptions.elasticity);
  const [gravity, setGravity] = useState(defaultOptions.gravity);
  const [showVectors, setShowVectors] = useState(defaultOptions.showVectors);
  const [showTrails, setShowTrails] = useState(defaultOptions.showTrails);
  const [paused, setPaused] = useState(false);
  const [simStats, setSimStats] = useState({
    collisions: 0,
    avgSpeed: 0,
    fps: 0,
    count: 0,
  });

  // initialize canvas size and scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = devicePixelRatioSafe();
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing to CSS pixels
    // clear trails if not showing trails
    if (!showTrails) ctx.clearRect(0, 0, w, h);
  }, [showTrails]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Helpers to manage particles (kept in ref for perf)
  const addParticle = useCallback(
    (x, y, opts = {}) => {
      const id = Date.now() + Math.random().toString(36).slice(2, 6);
      const radius = opts.radius ?? rand(defaultOptions.minRadius, defaultOptions.maxRadius);
      // initial random velocity
      const angle = rand(0, Math.PI * 2);
      const speed = opts.speed ?? rand(0, defaultOptions.maxInitialSpeed);
      const vx = opts.vx ?? Math.cos(angle) * speed;
      const vy = opts.vy ?? Math.sin(angle) * speed;
      const p = new Particle({ id, x, y, vx, vy, radius });
      particlesRef.current.push(p);
      return p;
    },
    []
  );

  const spawnRandom = useCallback(
    (n = 10) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        // try to spawn without overlapping existing few times
        let tries = 0;
        let placed = false;
        while (tries < 20 && !placed) {
          const r = rand(defaultOptions.minRadius, defaultOptions.maxRadius);
          const x = rand(rect.left + r, rect.left + rect.width - r) - rect.left;
          const y = rand(rect.top + r, rect.top + rect.height - r) - rect.top;
          const p = new Particle({
            id: Date.now() + "_" + i + "_" + Math.random().toString(36).slice(2, 4),
            x,
            y,
            radius: r,
            vx: rand(-defaultOptions.maxInitialSpeed, defaultOptions.maxInitialSpeed),
            vy: rand(-defaultOptions.maxInitialSpeed, defaultOptions.maxInitialSpeed),
          });

          // check overlap
          let ok = true;
          for (const q of particlesRef.current) {
            const dx = q.x - p.x;
            const dy = q.y - p.y;
            if (Math.hypot(dx, dy) < q.radius + p.radius + 2) {
              ok = false;
              break;
            }
          }
          if (ok) {
            particlesRef.current.push(p);
            placed = true;
          }
          tries++;
        }
        if (!placed) {
          // forced place
          const r = rand(defaultOptions.minRadius, defaultOptions.maxRadius);
          const x = rand(20, canvas.width / devicePixelRatioSafe() - 20);
          const y = rand(20, canvas.height / devicePixelRatioSafe() - 20);
          particlesRef.current.push(
            new Particle({
              id: Date.now() + "_" + i + "_" + Math.random().toString(36).slice(2, 4),
              x,
              y,
              radius: r,
            })
          );
        }
      }
    },
    []
  );

  // Clear particles
  const clearParticles = useCallback(() => {
    particlesRef.current = [];
    collisionsRef.current = 0;
    setSimStats((s) => ({ ...s, collisions: 0, avgSpeed: 0, count: 0 }));
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Step simulation once (useful when paused)
  const stepOnce = useCallback(
    (dt) => {
      const w = canvasRef.current?.width / devicePixelRatioSafe() || 0;
      const h = canvasRef.current?.height / devicePixelRatioSafe() || 0;
      const particles = particlesRef.current;
      const n = particles.length;

      // Integrate
      for (let i = 0; i < n; i++) {
        const p = particles[i];

        // integrate gravity
        if (gravity) p.vy += defaultOptions.gravityAccel * dt;

        // simple damping/friction
        const damp = 1 - defaultOptions.friction * dt;
        p.vx *= damp;
        p.vy *= damp;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // wall collisions (left/top/right/bottom)
        // left
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = Math.abs(p.vx) * elasticity;
        }
        // right
        if (p.x + p.radius > w) {
          p.x = w - p.radius;
          p.vx = -Math.abs(p.vx) * elasticity;
        }
        // top
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy = Math.abs(p.vy) * elasticity;
        }
        // bottom
        if (p.y + p.radius > h) {
          p.y = h - p.radius;
          p.vy = -Math.abs(p.vy) * elasticity;
        }
      }

      // Pairwise collisions (naive O(n^2) — fine up to a few hundred particles)
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          if (dist < a.radius + b.radius) {
            // separate overlap first
            separateOverlap(a, b);
            // resolve impulse
            const didResolve = resolveCollision(a, b, elasticity);
            if (didResolve) collisionsRef.current++;
          }
        }
      }

      // stats update (lightweight)
      let speedSum = 0;
      for (const p of particles) speedSum += p.speed();
      const avgSpeed = particles.length ? speedSum / particles.length : 0;

      setSimStats({
        collisions: collisionsRef.current,
        avgSpeed,
        fps: fpsRef.current.fps,
        count: particles.length,
      });
    },
    [gravity, elasticity]
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let last = performance.now();
    lastTimeRef.current = last;
    fpsRef.current = { lastMeasure: last, frames: 0, fps: 0 };

    const loop = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05); // seconds, clamp to avoid huge leaps
      lastTimeRef.current = now;

      // FPS counting
      fpsRef.current.frames++;
      if (now - fpsRef.current.lastMeasure > 500) {
        fpsRef.current.fps = Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.lastMeasure));
        fpsRef.current.lastMeasure = now;
        fpsRef.current.frames = 0;
      }

      if (!paused) {
        // update physics
        stepOnce(dt);
      } else {
        // if paused we still update fps display
        setSimStats((s) => ({ ...s, fps: fpsRef.current.fps }));
      }

      // drawing
      const cssW = canvas.width / devicePixelRatioSafe();
      const cssH = canvas.height / devicePixelRatioSafe();

      // trails handling: if trails disabled clear each frame; if enabled, draw translucent rect to fade
      if (!showTrails) {
        ctx.clearRect(0, 0, cssW, cssH);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        // on dark backgrounds, tweak; we keep it neutral
        ctx.fillRect(0, 0, cssW, cssH);
      }

      // draw particles
      const parts = particlesRef.current;
      for (const p of parts) {
        // circle
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // outline
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.stroke();

        // draw vectors optionally
        if (showVectors) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 0.12, p.y + p.vy * 0.12); // scaled for visibility
          ctx.strokeStyle = "rgba(0,0,0,0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // overlay stats
      // ctx.fillStyle = "rgba(0,0,0,0.6)";
      // ctx.font = "12px sans-serif";
      // backdrop
      // ctx.fillStyle = "rgba(255,255,255,0.92)";
      // ctx.fillRect(6, 6, 180, 64);
      // ctx.fillStyle = "#111827";
      // ctx.fillText(`Particles: ${simStats.count}`, 12, 24);
      // ctx.fillText(`Avg speed: ${simStats.avgSpeed.toFixed(1)} px/s`, 12, 40);
      // ctx.fillText(`Collisions: ${simStats.collisions}`, 12, 56);
      // ctx.fillText(`FPS: ${fpsRef.current.fps}`, 110, 56);

      // schedule next
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [paused, stepOnce, showTrails, simStats.count, simStats.avgSpeed, simStats.collisions, showVectors]);

  // click handler: add particle where you click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addParticle(x, y, { radius: rand(defaultOptions.minRadius, defaultOptions.maxRadius) });
    };
    canvas.addEventListener("click", handler);
    return () => canvas.removeEventListener("click", handler);
  }, [addParticle]);

  // expose controls callbacks
  const onPauseToggle = () => setPaused((p) => !p);
  const onStep = () => {
    // step using a fixed dt (1/60s)
    stepOnce(1 / 60);
  };
  const onClear = () => clearParticles();
  const onSpawnRandom = (n) => spawnRandom(n);

  // initial spawn on mount for demonstration
  useEffect(() => {
    clearParticles();
    spawnRandom(12);
  }, [clearParticles, spawnRandom]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-4 pb-3">
        <CollisionControls
          paused={paused}
          onPauseToggle={onPauseToggle}
          onStep={onStep}
          onClear={onClear}
          onSpawnRandom={onSpawnRandom}
          particleCount={particleCount}
          setParticleCount={setParticleCount}
          elasticity={elasticity}
          setElasticity={setElasticity}
          gravity={gravity}
          setGravity={setGravity}
          showVectors={showVectors}
          setShowVectors={setShowVectors}
          showTrails={showTrails}
          setShowTrails={setShowTrails}
        />
      </div>

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-md shadow-inner bg-white/80 dark:bg-navy-800"
          style={{ touchAction: "none" }}
        />
        <div className="absolute left-3 top-3 bg-white/90 dark:bg-navy-700 rounded-md p-2 text-xs">
          <div className="flex items-center gap-2">
            <MdTouchApp />
            <span>Click canvas to add particle</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <div>Particles: {simStats.count}</div>
            <div>Avg speed: {simStats.avgSpeed.toFixed(1)} px/s</div>
            <div>Collisions: {simStats.collisions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollisionSimulator;
