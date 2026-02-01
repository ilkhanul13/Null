import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register plugin hanya sekali
if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
}

// Konfigurasi Animasi
const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.1 };
const SVG_PATHS = {
  INITIAL: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
  START: "M 0 100 V 50 Q 50 0 100 50 V 100 z",
  END: "M 0 100 V 0 Q 50 0 100 0 V 100 z"
};

/**
 * Custom Hook untuk menangani logika magnetic parallax
 */
function useMagnetic(strength, parallaxStrength) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const contentXRaw = useMotionValue(0);
  const contentYRaw = useMotionValue(0);

  return {
    container: { x: useSpring(x, SPRING_CONFIG), y: useSpring(y, SPRING_CONFIG) },
    content: { x: useSpring(contentXRaw, SPRING_CONFIG), y: useSpring(contentYRaw, SPRING_CONFIG) },
    setPos: (mx, my) => {
      x.set(mx * strength);
      y.set(my * strength);
      contentXRaw.set(mx * parallaxStrength);
      contentYRaw.set(my * parallaxStrength);
    },
    resetPos: () => {
      x.set(0); y.set(0);
      contentXRaw.set(0); contentYRaw.set(0);
    }
  };
}

export default function MagneticParallax({ 
  children, 
  className = "", 
  onClick,
  strength = 0.45, 
  parallaxStrength = 0.35,
  fillColor = "#d2ff00"
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const svgWrapperRef = useRef(null);
  const timeline = useRef(null);
  
  const { container, content, setPos, resetPos } = useMagnetic(strength, parallaxStrength);

  // Inisialisasi GSAP Timeline
  useLayoutEffect(() => {
    timeline.current = gsap.timeline({ paused: true })
      .to(pathRef.current, { morphSVG: SVG_PATHS.START, duration: 0.4, ease: "power2.in" })
      .to(pathRef.current, { morphSVG: SVG_PATHS.END, duration: 0.3, ease: "power2.out" });
    
    return () => timeline.current?.kill();
  }, []);

  const updateRotation = useCallback((e) => {
    if (!containerRef.current) return;

    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Hitung angle dalam derajat
    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const angleDeg = (angleRad * 180) / Math.PI;

    gsap.set(svgWrapperRef.current, { 
      rotation: angleDeg - 90, 
      transformOrigin: "50% 50%" 
    });
  }, []);

  const handleMouseEnter = (e) => {
    updateRotation(e);
    timeline.current?.play();
  };

  const handleMouseMove = (e) => {
    // 1. Update Fill Rotation jika animasi belum selesai
    if (timeline.current?.progress() < 1) {
      updateRotation(e);
    }

    // 2. Update Magnetic Position
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const middleX = e.clientX - (left + width / 2);
    const middleY = e.clientY - (top + height / 2);
    
    setPos(middleX, middleY);
  };

  const handleMouseLeave = (e) => {
    updateRotation(e);
    timeline.current?.reverse();
    resetPos();
  };

  return (
    <motion.button
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: container.x, y: container.y }}
      className={`relative flex items-center justify-center cursor-pointer overflow-hidden transform-gpu bg-white rounded-full ${className}`}
    >
      {/* Background Morphing Layer */}
      <div 
        ref={svgWrapperRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ scale: 1.5 }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            ref={pathRef}
            fill={fillColor} 
            d={SVG_PATHS.INITIAL}
          />
        </svg>
      </div>

      {/* Foreground Content */}
      <motion.div style={{ x: content.x, y: content.y }} className="relative z-10">
        {children}
      </motion.div>
    </motion.button>
  );
}