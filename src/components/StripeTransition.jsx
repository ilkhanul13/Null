import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';

function StripeTransition({
  firstImageSrc,
  secondImageSrc,
  columns = 2,
  animationStepDuration = 1.3,
  className = '',
  style = {},
  imgClassName = "" 
}) {
  const containerRef = useRef(null);
  const finalImageRef = useRef(null);
  
  // Gunakan state hanya untuk mentrigger animasi saat gambar SELESAI load
  const [imageLoadedFor, setImageLoadedFor] = useState(null);

  // 1. Preload Image tanpa reset state sinkron
  useEffect(() => {
    if (!secondImageSrc) return;

    const img = new Image();
    img.src = secondImageSrc;
    img.onload = () => {
      // Set state asinkron setelah gambar benar-benar diunduh
      setImageLoadedFor(secondImageSrc);
    };
  }, [secondImageSrc]);

  useLayoutEffect(() => {
    // Animasi hanya jalan jika gambar yang sudah "siap" sesuai dengan props saat ini
    if (imageLoadedFor !== secondImageSrc) return;

    const container = containerRef.current;
    const finalImage = finalImageRef.current;
    if (!container || !finalImage) return;

    const ctx = gsap.context(() => {
      container.innerHTML = '';
      const stripeWidth = 100 / columns;

      // Sembunyikan layer final & tampilkan container stripe
      gsap.set(finalImage, { opacity: 0, visibility: 'hidden' });
      gsap.set(container, { opacity: 1, visibility: 'visible' });

      for (let i = 0; i < columns; i++) {
        const stripe = document.createElement('div');
        const randomRotate = Math.random() > 0.5 ? 90 : -90;
        const origins = ["left center", "center center", "right center"];
        const randomOrigin = origins[Math.floor(Math.random() * origins.length)];

        Object.assign(stripe.style, {
          position: 'absolute',
          // Tambahkan +1px atau +0.1% untuk menghilangkan celah antar stripe
          width: `calc(${stripeWidth}% + 1px)`, 
          height: '100%',
          left: `${i * stripeWidth}%`,
          backgroundImage: `url(${secondImageSrc})`,
          // Gunakan 100% tinggi dan lebar proporsional
          backgroundSize: `${container.offsetWidth}px ${container.offsetHeight}px`,
          // Hitung posisi background berdasarkan koordinat X absolut stripe tersebut
          backgroundPosition: `-${i * (container.offsetWidth / columns)}px 0px`,
          backgroundRepeat: 'no-repeat',
          outline: '1px solid transparent', // Membantu anti-aliasing di Chrome
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
          opacity: '0',
        });
        
        gsap.set(stripe, { 
          rotationY: randomRotate, 
          transformOrigin: randomOrigin,
          z: -150,
        });
        
        container.appendChild(stripe);
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(container.children, {
        opacity: 1,
        rotationY: 0,
        z: 0,
        scaleX: 1.005, // Tambahkan sedikit scaling untuk menutup celah saat bergerak
        duration: animationStepDuration,
        stagger: { amount: 0.7, from: "random" }
      })
      .to(finalImage, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
      }, "-=0.5")
      .to(container, {
        opacity: 0,
        duration: 0.2,
      });

    }, container); 

    return () => ctx.revert(); 

  }, [imageLoadedFor, secondImageSrc, animationStepDuration, columns]);

  return (
    <div 
      className={`relative overflow-hidden w-full h-full bg-black ${className}`} 
      style={{ ...style, isolation: 'isolate', perspective: '1500px' }}
    >
      {/* LAYER 1: Gambar Lama */}
      {firstImageSrc && (
        <div 
          className={`absolute inset-0 w-full h-full bg-cover bg-center z-[1] ${imgClassName}`}
          style={{ backgroundImage: `url(${firstImageSrc})` }}
        />
      )}

      {/* LAYER 2: Container Stripe */}
      <div 
        ref={containerRef} 
        className={`absolute inset-0 w-full h-full pointer-events-none z-[10] ${imgClassName}`}
        style={{ 
          transformStyle: 'preserve-3d',
          // Sembunyikan container secara visual jika data belum sinkron
          opacity: imageLoadedFor === secondImageSrc ? 1 : 0 
        }} 
      />

      {/* LAYER 3: Gambar Final (Utuh) */}
      <div 
        ref={finalImageRef}
        className={`absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none z-[20] ${imgClassName}`}
        style={{ 
          backgroundImage: `url(${secondImageSrc})`,
          opacity: 0, // Kunci utama: jangan pernah biarkan terlihat sebelum animasi selesai
          visibility: 'hidden'
        }}
      />
    </div>
  );
}

export default StripeTransition;