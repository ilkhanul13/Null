import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import ProjectCard from '../../components/ProjectCard/ProjectCard'; // Sesuaikan path
import RevealWrapper from '../../components/RevealWrapper';      // Sesuaikan path
import { projectsData } from '../../utils/projectsData';            // Sesuaikan path

// 1. Variasi Animasi Teks (Reveal Mask)
const textRevealVariants = {
  initial: { y: "110%" }, // Mulai dari bawah (tersembunyi oleh overflow wrapper)
  animate: {
    y: "0%",
    transition: {
      duration: 1,
      delay: 0.6, // Delay agar muncul tepat saat balok PageTransition terbuka
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// 2. Variasi Animasi Grid Container
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.8, // Gambar mulai muncul sedikit setelah teks naik
      staggerChildren: 0.1,
    },
  },
};

// 3. Variasi Animasi Kartu Proyek
const cardVariants = {
  initial: { y: 50, opacity: 0, scale: 0.95 },
  animate: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.76, 0, 0.24, 1] 
    }
  }
};

export default function Work() {
  const getSizeClass = (size) => {
    if (size === 'large') {
      return "col-span-1 row-span-1 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-4";
    }
    if (size === 'medium') {
      return "col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2";
    }
    return "col-span-1 row-span-1";                      
  };

  return (
    <PageTransition routeName="Work">
      <div className="w-full px-5 md:px-10 pt-22 md:pt-38 pb-12 md:pb-32 box-border bg-black">
        <div className="w-full max-w-360 mx-auto">
          
          {/* --- BAGIAN JUDUL (REVEAL MASK) --- */}
          <div className="mb-12 overflow-hidden w-full"> {/* Wrapper Masking */}
            <motion.h1 
              variants={textRevealVariants}
              initial="initial"
              animate="animate"
              className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] text-white font-medium origin-bottom-left"
            >
              Selected Work
            </motion.h1>
          </div>
          {/* ---------------------------------- */}

          <RevealWrapper>
            <motion.div 
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2.75 auto-rows-auto grid-flow-dense mb-32"
            >
              {projectsData.map((project) => (
                <motion.div 
                  key={project.id} 
                  variants={cardVariants}
                  className={`w-full relative aspect-square overflow-hidden reveal-child ${getSizeClass(project.size)}`}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </RevealWrapper>
        </div>
      </div>
    </PageTransition>
  );
}