import { useRef } from 'react';
import gsap from 'gsap';

const XRayText = ({ children, className, overlayClassName }) => {
  const outlineRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(outlineRef.current, {
      clipPath: `circle(60px at ${x}px ${y}px)`, // Radius sedikit diperbesar
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(outlineRef.current, {
      clipPath: `circle(0px at 50% 50%)`,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  return (
    <div 
      className="relative inline-block cursor-crosshair isolate" // Tambah isolate
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* LAYER 1: BASE TEXT (SOLID WHITE) */}
      <div className={`${className} text-white`}>
        {children}
      </div>

      {/* LAYER 2: OVERLAY TEXT (BLACK FILL + WHITE OUTLINE) */}
      <div 
        ref={outlineRef} 
        className={`absolute inset-0 z-10 pointer-events-none will-change-[clip-path] ${className} ${overlayClassName || ''}`}
        aria-hidden="true"
        style={{
          // Set manual agar tidak conflict dengan Tailwind
          clipPath: 'circle(0px at 50% 50%)',
          color: 'black', // Warna FILL harus sama dengan Background Website (Hitam)
          WebkitTextStroke: '1.5px #d2ff00', // Garis pinggir Putih
          textStroke: '1.5px #d2ff00',
          paintOrder: 'stroke fill',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default XRayText;