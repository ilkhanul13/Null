import React, { useRef } from 'react';
import { motion } from 'framer-motion'; 
import PageTransition from '../../components/PageTransition';
import { resumeData } from '../../utils/aboutData'; 
import VariableProximity from '../../components/VariableProximity.jsx';
import ResumeAccordion from '../../components/ResumeAccordion';
import RevealWrapper from '../../components/RevealWrapper.jsx';

// --- 1. VARIANTS CONFIGURATION ---

// Container Utama: Mengatur Timing Global
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.8, // Mulai setelah page transition
      staggerChildren: 0.15, // Jeda antar elemen (Headline -> Section -> Accordion)
    }
  }
};

// Animasi Masked Reveal (Untuk Teks)
const maskRevealVariants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { 
      duration: 1.1, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

// Animasi Standar Fade Up (Untuk Container/Gambar)
const simpleFadeVariants = {
  hidden: { y: 40, opacity: 0 }, // Jarak y sedikit lebih jauh agar efek naik lebih terasa
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 1, 
      ease: [0.22, 1, 0.36, 1],
      // Jika ingin konten di dalam section juga stagger, tambahkan ini:
      staggerChildren: 0.1 
    }
  }
};

// --- 2. COMPONENT HELPER ---
const MaskedReveal = ({ children, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div variants={maskRevealVariants}>
        {children}
      </motion.div>
    </div>
  );
};

export default function About() {
  
  const containerRef = useRef(null);
  const profileImageUrl = "https://res.cloudinary.com/dfovmrebt/image/upload/v1769214734/sample_ptixno.png"; 

  return (
    <PageTransition routeName="About">
      <style>{`
        @keyframes swayDirect {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }
      `}</style>
      
      <div className="w-full min-h-screen bg-black pt-22 md:pt-38 pb-32 px-5 md:px-10 box-border">
        
        {/* PARENT ORCHESTRATOR */}
        <motion.div 
          className="w-full h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* 1. HEADLINE */}
          <div className="max-w-360 mx-auto w-full text-center lg:text-left mb-12">
            <h1 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] text-white m-0">
               <MaskedReveal>Transforming ideas</MaskedReveal>
               <MaskedReveal>into impactful visuals</MaskedReveal>
            </h1>
          </div>

          {/* 2. SECTION UTAMA (Diberi Animasi Fade Up) */}
          <motion.section 
            variants={simpleFadeVariants} // <--- INI KUNCINYA (Section + Border naik bareng)
            ref={containerRef} 
            className="border-b border-white/20 bg-black w-full max-w-360 mx-auto pb-13 md:pb-20 lg:pb-25
              p-6 pr-0 pl-0 md:p-8 md:pr-0 md:pl-0 lg:p-12 lg:pr-0 lg:pl-0 
              box-border flex flex-col lg:flex-row justify-between gap-12 lg:gap-16
            "
          >
            
            {/* KIRI: Info & Text */}
            <div className="flex-[1.2] flex flex-col justify-between gap-12.5 lg:gap-0">
              
              {/* LOCATION PILL */}
              <div className="flex items-center lg:items-left gap-6 bg-[#d2ff00]
                  py-3 pl-8 pr-5 max-w-fit mb-12 max-md:w-full max-md:justify-between mx-auto lg:mx-0">
                <div className="flex flex-col text-left">
                  <MaskedReveal>
                    <p className="text-[#333] text-[0.85rem] m-0 leading-tight">Currently based in Indonesia</p>
                  </MaskedReveal>
                  <MaskedReveal>
                    <p className="text-black text-[1rem] m-0 font-medium leading-tight">Berau, East Kalimantan</p>
                  </MaskedReveal>
                </div>

                <div 
                  className="w-11.25 h-11.25 relative overflow-hidden rounded-full flex justify-center items-center shrink-0"
                  style={{ 
                    animation: 'swayDirect 3s ease-in-out infinite alternate',
                    transformOrigin: 'center' 
                  }}
                >
                  <iframe 
                    src="https://lottie.host/embed/6cb73e80-8ac7-4886-ad65-7332875846d2/DUxUGkj7DD.lottie"
                    className="w-[300%] h-[300%] border-none pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                    title="Globe Animation"
                  ></iframe>
                </div>
              </div>

              {/* IDENTITY (Name & Bio) */}
              <div className="mt-auto flex flex-col gap-7.5">
                <div className="text-center lg:text-left">
                    <MaskedReveal className="leading-[0.7]"> 
                        <VariableProximity
                          label="Ilkhanul"
                          className="text-[clamp(3.5rem,8vw,9rem)] max-md:text-[15vw] leading-[0.7] font-black text-white m-0 uppercase"
                          fromFontVariationSettings="'wght' 200, 'opsz' 40"
                          toFontVariationSettings="'wght' 900, 'opsz' 40"
                          containerRef={containerRef}
                          radius={150}
                          falloff="linear"
                        />
                    </MaskedReveal>
                    
                    <br className='hidden md:block'/>

                    <MaskedReveal className="leading-[0.95]">
                        <VariableProximity
                          label="Khalik"
                          className="text-[clamp(3.5rem,8vw,9rem)] max-md:text-[15vw] leading-[0.95] font-black text-white m-0 uppercase"
                          fromFontVariationSettings="'wght' 200, 'opsz' 40"
                          toFontVariationSettings="'wght' 900, 'opsz' 40"
                          containerRef={containerRef}
                          radius={150}
                          falloff="linear"
                        />
                    </MaskedReveal>
                </div>
                
                <div className="w-full">
                  <MaskedReveal>
                    <p className="text-[clamp(1rem,1.5vw,1.3rem)] text-white text-center lg:text-left leading-normal m-0 ">
                      I&apos;m a <span className='text-[#d2ff00]'>graphic designer</span> who loves turning complex ideas into visuals that are simple   
                    </p>
                  </MaskedReveal>
                  <MaskedReveal>
                    <p className="text-[clamp(1rem,1.5vw,1.3rem)] text-white text-center lg:text-left leading-normal m-0 ">
                      and easy to understand. Here, you can see some of my work.  
                    </p>
                  </MaskedReveal>
                  <MaskedReveal>
                    <p className="text-[clamp(1rem,1.5vw,1.3rem)] text-white text-center lg:text-left leading-normal m-0 ">
                      Like or curious about a project? <span className='text-[#d2ff00]'>Let&apos;s chat!</span>
                    </p>
                  </MaskedReveal>
                </div>
              </div>

            </div>

            {/* KANAN: Image */}
            <motion.div 
              // Image ikut animasi parent section, tapi kita bisa beri efek reveal sendiri jika mau
              // Disini saya biarkan plain agar ikut container section naik
              className="flex-[0.8] flex justify-end items-center max-lg:justify-center"
            >
               <div className="w-full h-full max-h-125 lg:max-h-200 overflow-hidden">
                  <img 
                    src={profileImageUrl} 
                    alt="Ilkhanul Khalik" 
                    className="w-full h-full object-cover block grayscale hover:grayscale-0 transition-all duration-500"
                  />
               </div>
            </motion.div>

          </motion.section>

          {/* 3. ACCORDION (Fade Up Terakhir) */}
          <RevealWrapper>
            <motion.div variants={simpleFadeVariants}>
              <ResumeAccordion data={resumeData} />
            </motion.div>
          </RevealWrapper>

        </motion.div>
        
      </div>
    </PageTransition>
  );
}