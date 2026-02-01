import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import StaggeredButton from '../../components/StaggeredButton';

export default function Footer() {
  const location = useLocation();
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  // Cek apakah sedang di halaman contact
  const isContactPage = location.pathname === '/contact';

  return (
    <div ref={container} className="w-full bg-[#0c0c0c] overflow-hidden">
      
    <motion.div
        style={{ y, opacity }}
        layoutId="footer-content"
        className="w-full py-10 md:py-20 md:pb-10 px-4 md:px-10">

        <div className="w-full max-w-360 mx-auto flex flex-col h-full">
            
            {/* --- CALL TO ACTION (CTA) --- */}
            <div className="flex flex-col lg:flex-row gap-y-4 justify-between items-center lg:items-end mb-10 md:mb-20 gap-10 lg:gap-10">
                
                {/* CTA Text */}
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[5rem] leading-none font-normal text-white m-0">
                        Let&apos;s work
                    </h2>
                    <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[5rem] leading-none font-normal text-white m-0">
                        together
                    </h2>
                </div>
                
                {/* BUTTON AREA */}
                {/* 3. LOGIKA KONDISIONAL: 
                    Hanya tampilkan div ini jika BUKAN halaman contact (!isContactPage) 
                */}
                {!isContactPage && (
                    <div className="shrink-0 w-full lg:w-auto mt-6 lg:mt-0 flex justify-center lg:justify-end">
                        <StaggeredButton 
                            href="/contact" 
                            className="inline-flex items-center justify-center w-full md:w-auto px-10 py-5 border border-[#555] text-[1.2rem] text-white bg-transparent transition-all duration-300"
                        >
                            Get in touch
                        </StaggeredButton>
                    </div>
                )}

            </div>
            
            {/* Garis Pembatas */}
            <div className="w-full h-px bg-[#333] mb-7.5 md:mb-7.5 mt-5 md:mt-0"></div>
            
            {/* --- BOTTOM BAR --- */}
            <div className="flex flex-col-reverse gap-y-4 lg:flex-row justify-between items-center lg:items-center text-[0.9rem] text-[#d2ff00] gap-8 lg:gap-0">
                
                {/* Copyright */}
                <div className="w-full lg:w-auto text-center lg:text-left">
                    <p className="text-[#d2ff00]">© 2026 Ilkhanul Khalik</p>
                </div>

                {/* Socials */}
                <div className="flex gap-5 w-full lg:w-auto justify-center lg:justify-end">
                    <StaggeredButton
                        enableHoverBg={false} 
                        href="https://www.instagram.com/ilkhanul_/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-300 transition-colors duration-300 hover:text-[#d2ff00]"
                        >Instagram
                    </StaggeredButton>
                    <StaggeredButton
                        enableHoverBg={false} 
                        href="https://www.linkedin.com/in/ilkhanul-khalik-262920391/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-300 transition-colors duration-300 hover:text-[#d2ff00]"
                        >LinkedIn
                    </StaggeredButton>
                    <StaggeredButton
                        enableHoverBg={false} 
                        href="https://github.com/ilkhanul13"
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-300 transition-colors duration-300 hover:text-[#d2ff00]"
                        >Github
                    </StaggeredButton>
                </div>

            </div>
        </div>
      </motion.div>
    </div>
  );
}