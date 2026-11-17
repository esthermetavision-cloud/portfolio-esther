import React, { useRef, useState, memo } from 'react';

/*
  DESIGN VERROUILLÉ (CARTES 3D TILT + REFLET SPÉCULAIRE CARMIN) :
  Effet 3D au survol demandé sur les cartes Projets, Accréditations et Labs Techniques.
*/
export const TiltCard = memo(function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'rotateX(0deg) rotateY(0deg) translateY(0px)',
    mx: '50%',
    my: '50%',
    active: false,
  });

  const onMove = (e) => {
    if (e.pointerType === 'touch' || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const nx = x / r.width - 0.5;
    const ny = y / r.height - 0.5;
    setStyle({
      transform: `rotateX(${(-ny * 8).toFixed(2)}deg) rotateY(${(nx * 8).toFixed(2)}deg) translateY(-3px)`,
      mx: `${((x / r.width) * 100).toFixed(1)}%`,
      my: `${((y / r.height) * 100).toFixed(1)}%`,
      active: true,
    });
  };

  const onLeave = () =>
    setStyle((s) => ({ ...s, transform: 'rotateX(0deg) rotateY(0deg) translateY(0px)', active: false }));

  return (
    <div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        transform: style.transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        willChange: 'transform',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[1]"
        style={{
          opacity: style.active ? 1 : 0,
          background: `radial-gradient(circle at ${style.mx} ${style.my}, rgba(220, 38, 38, 0.14), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
});
