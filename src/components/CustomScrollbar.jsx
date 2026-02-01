import { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { motion, useAnimation } from 'framer-motion';

export default function CustomScrollbar() {
  const lenis = useLenis();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const controls = useAnimation();

  // 1. Hitung Tinggi Thumb Scrollbar
  useEffect(() => {
    const updateMetrics = () => {
      const vHeight = window.innerHeight;
      const sHeight = document.documentElement.scrollHeight;
      setViewportHeight(vHeight);
      setScrollHeight(sHeight);
      
      // Rumus tinggi thumb proporsional
      // Minimal 50px biar gampang diklik/dilihat
      const tHeight = Math.max((vHeight / sHeight) * vHeight, 50);
      setThumbHeight(tHeight);
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    
    // Perbarui metrics saat halaman berubah ukuran (mount/unmount konten)
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('resize', updateMetrics);
      resizeObserver.disconnect();
    };
  }, []);

  // 2. Logic Hide/Show saat idle
  useEffect(() => {
    let timeout;
    if (isScrolling) {
      controls.start({ opacity: 1 });
      clearTimeout(timeout);
      
      // Hilang setelah 1 detik diam
      timeout = setTimeout(() => {
        setIsScrolling(false);
        controls.start({ opacity: 0 });
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isScrolling, controls]);

  // 3. Update Posisi berdasarkan Lenis Event
  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ scroll, limit }) => {
      // Logic Scroll Landon Norris (Hide/Show)
      setIsScrolling(true);

      // Hitung posisi top thumb
      // progress (0 - 1) * (ruang gerak thumb)
      const progress = scroll / limit;
      const availableSpace = viewportHeight - thumbHeight;
      const newTop = progress * availableSpace;
      
      setThumbTop(newTop);
    };

    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  }, [lenis, viewportHeight, thumbHeight]);

  // Jika konten tidak cukup panjang untuk scroll, jangan tampilkan
  if (scrollHeight <= viewportHeight) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-3 z-[99999] mix-blend-difference pointer-events-none">
       {/* Menggunakan pointer-events-none di wrapper agar klik tembus ke bawah,
         tapi pointer-events-auto di thumb agar (nanti) bisa di-drag jika mau.
         Untuk sekarang hanya visual indicator.
       */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          height: thumbHeight,
          y: thumbTop,
        }}
        // Styling Thumb mirip Landon Norris
        className="absolute right-[4px] w-[6px] bg-[#666] rounded-full" 
      />
    </div>
  );
}