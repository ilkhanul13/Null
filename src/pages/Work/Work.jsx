import { useState, useMemo } from 'react'; // Tambahkan useState dan useMemo
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan AnimatePresence
import PageTransition from '../../components/PageTransition';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import RevealWrapper from '../../components/RevealWrapper';
import { projectsData } from '../../utils/projectsData';

// 1. Variasi Animasi Teks (Reveal Mask) - Tetap sama
const textRevealVariants = {
  initial: { y: "110%" },
  animate: {
    y: "0%",
    transition: {
      duration: 1,
      delay: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// 2. Variasi Animasi Grid Container - Sedikit disesuaikan agar tidak konflik dengan filter
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.8,
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
  },
  exit: { // Animasi saat item hilang karena di-filter
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");

  // A. Ambil semua kategori unik dari data secara otomatis
  const categories = useMemo(() => {
    const uniqueCategories = ["All", ...new Set(projectsData.map((item) => item.category))];
    return uniqueCategories;
  }, []);

  // B. Logic Filter Data
  const filteredProjects = projectsData.filter((project) => {
    return activeCategory === "All" ? true : project.category === activeCategory;
  });

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
      <div className="w-full px-5 md:px-10 pt-22 md:pt-38 pb-12 md:pb-32 box-border bg-black min-h-screen">
        <div className="w-full max-w-360 mx-auto">
          
          {/* --- BAGIAN JUDUL --- */}
          <div className="mb-8 overflow-hidden w-full">
            <motion.h1 
              variants={textRevealVariants}
              initial="initial"
              animate="animate"
              className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] text-white font-medium origin-bottom-left text-center md:text-start"
            >
              Selected Work
            </motion.h1>
          </div>

          {/* --- BAGIAN FILTER BUTTONS (BARU) --- */}
          <RevealWrapper>
            <div className="flex flex-wrap gap-3 mb-12 items-center justify-center md:justify-start">
{categories.map((cat, index) => {
  // Cek apakah kategori ini sedang aktif
  const isActive = activeCategory === cat;

  return (
    <button
      key={index}
      onClick={() => setActiveCategory(cat)}
      className={`
        relative group overflow-hidden px-5 py-2 text-sm md:text-base 
        border transition-all duration-300 ease-in-out cursor-pointer
        ${isActive ? 'border-white/20' : 'border-white/20 hover:border-white/20'}
      `}
    >
      {/* 1. LAYER BACKGROUND ANIMASI 
          - Jika Active: Langsung muncul (translate-y-0)
          - Jika Tidak Active: Sembunyi di bawah (translate-y-full), naik saat hover
      */}
      <span 
        className={`
          absolute inset-0 bg-[#d2ff00] transition-transform duration-500 ease-[cubic-bezier(0.80,0,0.43,1)]
          ${isActive ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}
        `}
      ></span>

      {/* 2. LAYER TEXT (CONTENT)
          - Harus z-10 agar berada di atas background kuning
          - Warnanya berubah jadi hitam jika Active ATAU jika di-hover
      */}
      <span 
        className={`
          relative z-10 font-medium transition-colors duration-300
          ${isActive ? 'text-black' : 'text-white/60 group-hover:text-black'}
        `}
      >
        {cat}
      </span>
    </button>
  );
})}
            </div>
          </RevealWrapper>

          {/* --- BAGIAN GRID PROJECT --- */}
          <RevealWrapper>
            <motion.div 
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2.75 auto-rows-auto grid-flow-dense mb-32"
            >
              {/* AnimatePresence memungkinkan animasi saat item dihapus dari DOM */}
              <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project) => (
                  <motion.div 
                    layout // PROPERTI PENTING: Membuat kartu bergeser mulus saat posisi berubah
                    key={project.id} 
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`w-full relative aspect-square overflow-hidden reveal-child ${getSizeClass(project.size)}`}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </RevealWrapper>

        </div>
      </div>
    </PageTransition>
  );
}