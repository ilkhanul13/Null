import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// KONFIGURASI ANIMASI
const BLOCK_DURATION = 0.6;
const STAGGER = 0.05;

// KONFIGURASI KECEPATAN (Interval dalam ms)
const SPEED_MAP = { 
  'slow-2g': 100, 
  '2g': 80,       
  '3g': 45,       
  '4g': 18,       
  'default': 25   
};

const blockVariants = {
  initial: { y: "0%" },
  animate: (i) => ({
    y: "-100%",
    transition: {
      duration: BLOCK_DURATION,
      delay: STAGGER * i,
      ease: [0.76, 0, 0.24, 1], 
    },
  }),
};

// Tambahkan prop onStartExit
export default function InitialLoader({ onFinished, onStartExit }) {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    // 1. Deteksi Kecepatan Internet
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = conn ? conn.effectiveType : 'default';
    const intervalTime = SPEED_MAP[effectiveType] || SPEED_MAP['default'];

    // 2. Logika Interval
    const interval = setInterval(() => {
      setCount((prev) => {
        // Jika sudah mencapai 100%
        if (prev >= 100) {
          clearInterval(interval);
          
          // Trigger fase keluar (angka hilang & balok mulai naik)
          setTimeout(() => {
            setIsCounting(false);
            
            // --- PERUBAHAN DISINI ---
            // Kita beri sinyal "Start Exit" agar Home mulai bergerak SEKARANG
            // (Bersamaan dengan balok putih naik)
            if (onStartExit) onStartExit(); 
            // ------------------------
            
          }, 400);
          
          // Trigger callback selesai total (component unmount)
          setTimeout(onFinished, 1200); 
          
          return 100;
        }
        // Increment angka
        return prev + 1; 
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onFinished, onStartExit]);

  return (
    <div className="fixed inset-0 flex pointer-events-none z-[99999] w-screen h-screen overflow-hidden">
      
      {/* 1. LAYER BACKGROUND (Balok Putih) */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={blockVariants}
          initial="initial"
          animate={!isCounting ? "animate" : "initial"} 
          className="relative w-full h-full bg-white border-none"
        />
      ))}

      {/* 2. LAYER KONTEN (Angka & Progress Bar) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-3">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ 
            opacity: isCounting ? 1 : 0, 
            y: isCounting ? 0 : -20 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center w-full max-w-[130px]"
        >
          <h1 className="text-black text-xl md:text-2xl tabular-nums tracking-tight mb-2">
            {count}%
          </h1>

          <div className="w-full h-[2px] bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-black absolute top-0 left-0"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ ease: "linear", duration: 0.1 }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}