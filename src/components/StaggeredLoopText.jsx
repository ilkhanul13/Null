//StaggeredLoopText
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION = 0.3; 
const STAGGER = 0.020;
const INTERVAL_TIME = 3000; 

export default function StaggeredLoopText({ words = [], className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div 
      className={`inline-flex relative overflow-hidden leading-[1.2] py-0.5 align-bottom ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index} 
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: STAGGER } },
            exit: { transition: { staggerChildren: STAGGER } },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          // Styles Wrapper:
          // flex            -> Menyusun huruf secara horizontal
          // whitespace-pre  -> Menjaga spasi agar tidak collapse
          // relative        -> Layout positioning
          className="flex whitespace-pre relative"
        >
          {words[index].split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: "125%" }, // Masuk dari bawah
                animate: { y: 0 },      // Posisi normal
                exit: { y: "-125%" },   // Keluar ke atas
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
              }}
              // Styles Character:
              // inline-block -> Wajib agar transform Y bekerja
              // Conditional: Jika karakter adalah spasi " ", beri min-width agar tidak gepeng
              className={`inline-block ${char === " " ? "min-w-[0.3em]" : ""}`}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}