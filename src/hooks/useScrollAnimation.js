// hooks/useScrollAnimation.js
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Terima parameter selector, default-nya ".animate-item"
export const useScrollAnimation = (selector = ".animate-item") => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cari elemen berdasarkan selector yang dikirim
      const items = gsap.utils.toArray(selector);

      items.forEach((item) => {
        gsap.fromTo(
          item,
          { 
            y: 50, 
            opacity: 0, 
            scale: 0.95 
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100", 
              toggleActions: "play none none reverse", 
            },
          }
        );
      });
    }, containerRef); // Scope pencarian elemen hanya di dalam containerRef

    return () => ctx.revert();
  }, [selector]); // Re-run jika selector berubah (jarang terjadi, tapi good practice)

  return { containerRef };
};