import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';

function LiquidImageTransition({
  firstImageSrc,
  secondImageSrc,
  numPoints = 5,
  duration = 1.3,
  className = '',
  imgClassName = ""
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // SOLUSI: Lazy Initializer. Fungsi ini hanya lari 1x saat mount.
  // Ini dianggap 'pure' oleh React untuk inisialisasi state.
  const [direction] = useState(() => {
    const modes = ['TOP_TO_BOTTOM', 'BOTTOM_TO_TOP', 'LEFT_TO_RIGHT', 'RIGHT_TO_LEFT'];
    return modes[Math.floor(Math.random() * modes.length)];
  });

  // Preload gambar tetap di useEffect (Side Effect)
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = secondImageSrc;
    img.onload = () => {
      if (isMounted) setIsReady(true);
    };
    return () => { isMounted = false; };
  }, [secondImageSrc]);

  useLayoutEffect(() => {
    if (!isReady || !pathRef.current) return;

    const points = [];
    for (let j = 0; j < numPoints; j++) points.push(100);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onUpdate: () => render(points),
        defaults: { ease: "power2.inOut" }
      });

      points.forEach((_, j) => {
        const pointDelay = Math.random() * 0.4;
        tl.to(points, {
          [j]: 0,
          duration: duration
        }, pointDelay);
      });
    }, containerRef);

    function render(p) {
      if (!pathRef.current) return;
      let d = "";

      // Logika render berdasarkan sumbu (X untuk Horisontal, Y untuk Vertikal)
      
      
      if (direction === 'BOTTOM_TO_TOP') {
        d = `M 0 100 V ${p[0]} C`;
        for (let j = 0; j < numPoints - 1; j++) {
          const x = ((j + 1) / (numPoints - 1)) * 100;
          const cp = x - (100 / (numPoints - 1)) / 2;
          d += ` ${cp} ${p[j]} ${cp} ${p[j+1]} ${x} ${p[j+1]}`;
        }
        d += ` V 100 H 0 Z`;
      } 
      else if (direction === 'TOP_TO_BOTTOM') {
        d = `M 0 0 V ${100 - p[0]} C`;
        for (let j = 0; j < numPoints - 1; j++) {
          const x = ((j + 1) / (numPoints - 1)) * 100;
          const cp = x - (100 / (numPoints - 1)) / 2;
          d += ` ${cp} ${100 - p[j]} ${cp} ${100 - p[j+1]} ${x} ${100 - p[j+1]}`;
        }
        d += ` V 0 H 0 Z`;
      }
      else if (direction === 'LEFT_TO_RIGHT') {
        d = `M 0 0 H ${100 - p[0]} C`;
        for (let j = 0; j < numPoints - 1; j++) {
          const y = ((j + 1) / (numPoints - 1)) * 100;
          const cp = y - (100 / (numPoints - 1)) / 2;
          d += ` ${100 - p[j]} ${cp} ${100 - p[j+1]} ${cp} ${100 - p[j+1]} ${y}`;
        }
        d += ` H 0 V 0 Z`;
      }
      else if (direction === 'RIGHT_TO_LEFT') {
        d = `M 100 0 H ${p[0]} C`;
        for (let j = 0; j < numPoints - 1; j++) {
          const y = ((j + 1) / (numPoints - 1)) * 100;
          const cp = y - (100 / (numPoints - 1)) / 2;
          d += ` ${p[j]} ${cp} ${p[j+1]} ${cp} ${p[j+1]} ${y}`;
        }
        d += ` H 100 V 0 Z`;
      }

      pathRef.current.setAttribute("d", d);
    }

    return () => ctx.revert();
  }, [isReady, direction, numPoints, duration]);

  const clipId = React.useId().replace(/:/g, "");

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background (Gambar lama) */}
      {firstImageSrc && (
        <div 
          className={`absolute inset-0 bg-cover bg-center ${imgClassName}`}
          style={{ backgroundImage: `url(${firstImageSrc})` }}
        />
      )}

      {/* Foreground (Gambar baru dengan Liquid Mask) */}
      <div 
        className={`absolute inset-0 bg-cover bg-center ${imgClassName}`}
        style={{ 
          backgroundImage: `url(${secondImageSrc})`,
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`
        }}
      />

      <svg className="absolute w-0 h-0">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path ref={pathRef} transform="scale(0.01, 0.01)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default LiquidImageTransition;