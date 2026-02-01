import { motion } from "framer-motion";

const BLOCK_DURATION = 0.6; 
const STAGGER = 0.05;
const TEXT_STAY = 0.3; 

const textRevealVariants = {
  initial: { y: "100%" },
  animate: {
    y: ["100%", "0%", "0%", "-100%"],
    transition: {
      times: [0, 0.2, 0.8, 1],
      duration: TEXT_STAY + 0.4, 
      ease: [0.76, 0, 0.24, 1],
      delay: 0.1 
    }
  }
};

const blockVariants = {
  initial: { y: "0%" },
  animate: (i) => ({
    y: "-100%",
    transition: {
      duration: BLOCK_DURATION,
      delay: (TEXT_STAY + 0.3) + (STAGGER * i), 
      ease: [0.76, 0, 0.24, 1],
    },
    transitionEnd: { y: "100%" }
  }),
  exit: (i) => ({
    y: "0%",
    transition: {
      duration: BLOCK_DURATION,
      delay: STAGGER * i,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
};

export default function PageTransition({ children, routeName }) {
  return (
    <div className="relative w-full">
      <div className="fixed inset-0 flex pointer-events-none z-[9999] w-screen h-screen overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={blockVariants}
            initial="exit" // Mulai dari posisi nutup saat pindah rute
            animate="animate"
            exit="exit"
            className="relative w-full h-full bg-white border-none"
          />
        ))}
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
        <div className="overflow-hidden py-2">
          <motion.h1
            key={routeName}
            variants={textRevealVariants}
            initial="initial"
            animate="animate"
            className="text-black text-3xl md:text-5xl uppercase tracking-normal font-semibold text-center py-2"
          >
            {routeName}
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: TEXT_STAY }}
      >
        {children}
      </motion.div>
    </div>
  );
}