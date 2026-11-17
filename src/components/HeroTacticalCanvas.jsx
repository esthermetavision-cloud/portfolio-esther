import React, { useEffect, useRef } from 'react';

const TWO_PI = Math.PI * 2;
const LOOP_DURATION = 18000;

const NODES = [
  { lat: 50.6, lon: 3.0, code: 'NODE_01 // LILLE [FR]', primary: true },
  { lat: 51.5, lon: -0.1, code: 'SAT_UPLINK // LON-04', primary: false },
  { lat: 38.9, lon: -77.0, code: 'CMD_NET // DC-09', primary: true },
  { lat: 35.6, lon: 139.7, code: 'SEC_RELAY // TYO-02', primary: true },
  { lat: 55.7, lon: 37.6, code: 'INTERCEPT // MOW-07', primary: false },
  { lat: 37.5, lon: 127.0, code: 'HUNTER_SYS // SEL-01', primary: false },
];

const ARCS = [
  { from: 0, to: 2, offset: 0.0 },
  { from: 0, to: 3, offset: 0.25 },
  { from: 2, to: 1, offset: 0.5 },
  { from: 3, to: 5, offset: 0.72 },
  { from: 0, to: 4, offset: 0.85 },
];

const latLonToVec3 = (latDeg, lonDeg) => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.sin(lon), -Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
};

const project = (vx, vy, vz, rotY, tiltX, r, cx, cy) => {
  const x1 = vx * Math.cos(rotY) + vz * Math.sin(rotY);
  const z1 = -vx * Math.sin(rotY) + vz * Math.cos(rotY);
  const y2 = vy * Math.cos(tiltX) - z1 * Math.sin(tiltX);
  const z2 = vy * Math.sin(tiltX) + z1 * Math.cos(tiltX);
  const scale = 520 / (520 + z2 * r + 340);
  return { x: cx + x1 * r * scale, y: cy + y2 * r * scale, z: z2, scale };
};

/*
  ====================================================================================
  SCÈNE 3D TACTIQUE INSPIRÉE MW2 / MW3 (OPTIMISÉE POUR LA PRODUCTION) :
  - Redimensionnement synchrone juste avant le dessin dans requestAnimationFrame (zéro flash).
  - Protection anti-saut sur mobile lorsque la barre d'adresse se masque/affiche au scroll.
  - Mise en pause automatique lorsque l'onglet est masqué (visibilitychange) pour 0 % CPU en fond.
  - Respect strict de l'accessibilité système `prefers-reduced-motion` (rendu statique élégant).
  - Libération complète des ressources GPU/Canvas au démontage du composant.
  ====================================================================================
*/
export function HeroTacticalCanvas({ mouseRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0, smoothX = 0, smoothY = 0;
    let raf = null;
    let isDisposed = false;
    let pendingW = 0, pendingH = 0, pendingDpr = 1;

    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let prefersReducedMotion = Boolean(motionQuery?.matches);

    const measure = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const newW = Math.round(rect.width);
      const newH = Math.round(rect.height);
      if (newW <= 0 || newH <= 0) return;

      const isTouchMobile =
        window.innerWidth < 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      if (isTouchMobile && width > 0 && newW === width && Math.abs(newH - height) < 95) {
        return;
      }

      pendingW = newW;
      pendingH = newH;
      pendingDpr = Math.min(window.devicePixelRatio || 1, 2);

      // Si reduced-motion est actif, redessine immédiatement une image fixe aux nouvelles dimensions
      if (prefersReducedMotion && !isDisposed) {
        drawFrame(LOOP_DURATION * 0.25);
      }
    };

    const drawFrame = (now) => {
      if (pendingW > 0 && pendingH > 0 && (pendingW !== width || pendingH !== height)) {
        width = pendingW;
        height = pendingH;
        canvas.width = Math.round(width * pendingDpr);
        canvas.height = Math.round(height * pendingDpr);
        ctx.setTransform(pendingDpr, 0, 0, pendingDpr, 0, 0);
      }

      if (width <= 0 || height <= 0) return;

      const u = (now % LOOP_DURATION) / LOOP_DURATION;
      const phi = u * TWO_PI;

      if (prefersReducedMotion) {
        smoothX = 0;
        smoothY = 0;
      } else {
        smoothX += ((mouseRef.current?.x || 0) - smoothX) * 0.055;
        smoothY += ((mouseRef.current?.y || 0) - smoothY) * 0.055;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5, cy = height * 0.5;
      const radius = Math.max(130, Math.min(230, Math.min(width * 0.31, height * 0.36)));
      const rotY = phi + smoothX * 0.85;
      const tiltX = 0.28 + smoothY * 0.45;

      // Halo atmosphérique 3D derrière Kira
      const atmo = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius * 1.35);
      atmo.addColorStop(0, 'rgba(185, 28, 28, 0.24)');
      atmo.addColorStop(0.6, 'rgba(158, 13, 29, 0.09)');
      atmo.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, TWO_PI);
      ctx.fill();

      // Grille géodésique
      ctx.strokeStyle = 'rgba(185, 28, 28, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = cx % 64; x < width; x += 64) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = cy % 64; y < height; y += 64) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      // Anneau orbital 3D incliné
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.18 + smoothX * 0.1);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.38)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.38, radius * 0.44, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Parallèles & Méridiens 3D
      [-60, -30, 0, 30, 60].forEach((latDeg) => {
        ctx.beginPath();
        let started = false;
        ctx.strokeStyle = latDeg === 0 ? 'rgba(239, 68, 68, 0.55)' : 'rgba(220, 38, 38, 0.30)';
        ctx.lineWidth = latDeg === 0 ? 1.8 : 1.15;
        for (let lon = -180; lon <= 180; lon += 6) {
          const [vx, vy, vz] = latLonToVec3(latDeg, lon);
          const p = project(vx, vy, vz, rotY, tiltX, radius, cx, cy);
          if (p.z < 0.25) {
            started ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
            started = true;
          } else started = false;
        }
        ctx.stroke();
      });

      for (let lonDeg = 0; lonDeg < 360; lonDeg += 22.5) {
        ctx.beginPath();
        let started = false;
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.28)';
        ctx.lineWidth = 1.1;
        for (let lat = -90; lat <= 90; lat += 6) {
          const [vx, vy, vz] = latLonToVec3(lat, lonDeg);
          const p = project(vx, vy, vz, rotY, tiltX, radius, cx, cy);
          if (p.z < 0.25) {
            started ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
            started = true;
          } else started = false;
        }
        ctx.stroke();
      }

      // Arcs balistiques 3D intercontinentaux
      ARCS.forEach((arc) => {
        const vA = latLonToVec3(NODES[arc.from].lat, NODES[arc.from].lon);
        const vB = latLonToVec3(NODES[arc.to].lat, NODES[arc.to].lon);
        const localU = (u - arc.offset + 1) % 1;
        const head = localU * 1.35, tail = head - 0.38;
        for (let s = 0; s < 28; s++) {
          const t0 = s / 28, t1 = (s + 1) / 28;
          const e0 = 1 + Math.sin(t0 * Math.PI) * 0.28, e1 = 1 + Math.sin(t1 * Math.PI) * 0.28;
          const p0 = project((vA[0] * (1 - t0) + vB[0] * t0) * e0, (vA[1] * (1 - t0) + vB[1] * t0) * e0, (vA[2] * (1 - t0) + vB[2] * t0) * e0, rotY, tiltX, radius, cx, cy);
          const p1 = project((vA[0] * (1 - t1) + vB[0] * t1) * e1, (vA[1] * (1 - t1) + vB[1] * t1) * e1, (vA[2] * (1 - t1) + vB[2] * t1) * e1, rotY, tiltX, radius, cx, cy);
          if (p0.z < 0.30 && p1.z < 0.30) {
            const active = t0 >= tail && t0 <= head;
            ctx.strokeStyle = active ? 'rgba(254, 202, 202, 0.95)' : 'rgba(220, 38, 38, 0.32)';
            ctx.lineWidth = active ? 2.4 : 1.15;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
      });

      // Nœuds tactiques & ondes radar
      NODES.forEach((node, idx) => {
        const [vx, vy, vz] = latLonToVec3(node.lat, node.lon);
        const p = project(vx, vy, vz, rotY, tiltX, radius, cx, cy);
        if (p.z < 0.10) {
          const fade = Math.min(1, (-p.z + 0.10) * 1.6);
          const ringU = (u * 2 + idx * 0.17) % 1;
          ctx.strokeStyle = `rgba(239, 68, 68, ${(1 - ringU) * 0.88 * fade})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (7 + ringU * 44) * p.scale, 0, TWO_PI);
          ctx.stroke();
          ctx.fillStyle = `rgba(254, 202, 202, ${0.95 * fade})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (node.primary ? 4.0 : 2.8) * p.scale, 0, TWO_PI);
          ctx.fill();
          if (node.primary && p.z < -0.10 && width >= 640) {
            ctx.fillStyle = `rgba(229, 222, 209, ${0.85 * fade})`;
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillText(node.code, p.x + 15, p.y - 6);
          }
        }
      });

      // Onde sismique MW3 proportionnelle
      const pulse = (c) => {
        let d = u - c;
        d -= Math.round(d);
        return Math.exp(-(d * d) / (2 * 0.055 * 0.055));
      };
      const burst = 0.55 + 1.25 * (pulse(0.2) + pulse(0.52) + pulse(0.82));
      const waveScale = Math.min(1, Math.max(0.55, width / 1100));
      [
        { amp: 44 * waveScale, freq: 3, speed: 2, alpha: 0.75, w: 2.2 },
        { amp: 26 * waveScale, freq: 6, speed: -3, alpha: 0.45, w: 1.5 },
        { amp: 14 * waveScale, freq: 10, speed: 4, alpha: 0.26, w: 1.0 },
      ].forEach((l) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(239, 68, 68, ${l.alpha})`;
        ctx.lineWidth = l.w;
        const steps = Math.max(120, Math.floor(width / 5));
        for (let s = 0; s <= steps; s++) {
          const nx = s / steps;
          const env = Math.pow(Math.sin(nx * Math.PI), 1.1);
          const y =
            cy +
            (Math.sin(nx * TWO_PI * l.freq + phi * l.speed) * 0.72 +
              Math.cos(nx * TWO_PI * l.freq * 2.5 - phi * l.speed * 2) * 0.28) *
              l.amp *
              burst *
              env;
          s === 0 ? ctx.moveTo(nx * width, y) : ctx.lineTo(nx * width, y);
        }
        ctx.stroke();
      });
    };

    const startLoop = () => {
      if (isDisposed || raf !== null) return;
      if (prefersReducedMotion) {
        drawFrame(LOOP_DURATION * 0.25);
        return;
      }
      const tick = (now) => {
        if (isDisposed || document.hidden || prefersReducedMotion) {
          raf = null;
          return;
        }
        drawFrame(now);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    // Pause automatique quand l'utilisateur change d'onglet ou réduit la fenêtre
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    // Réaction dynamique aux préférences système de réduction des animations
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      stopLoop();
      startLoop();
    };

    window.addEventListener('resize', measure, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (motionQuery?.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && canvas.parentElement) ro.observe(canvas.parentElement);

    measure();
    if (!document.hidden) {
      startLoop();
    }

    return () => {
      isDisposed = true;
      stopLoop();
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (motionQuery?.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
      if (ro) ro.disconnect();
      // Libération propre de la mémoire du buffer graphique
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [mouseRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
