import { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

// Register plugin GSAP
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      // Menghubungkan ticker GSAP dengan Lenis
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Menonaktifkan lag smoothing default GSAP agar sinkron dengan Lenis
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Opsi Konfigurasi Lenis
  const options = {
    lerp: 0.1,        // Tingkat kehalusan
    duration: 1.5,    // Durasi scroll
    smoothTouch: false, // Matikan smooth scroll di touch device
    smooth: true,
  };

  return (
    <ReactLenis 
        root 
        ref={lenisRef} 
        autoRaf={false} /* Handle raf manual via GSAP ticker */
        options={options}
        // PERUBAHAN: style={{ position: 'relative' }} diganti class Tailwind
        className="relative" 
    >
      {children}
    </ReactLenis>
  );
}