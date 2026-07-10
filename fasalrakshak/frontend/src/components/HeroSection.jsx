import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MotionLink = motion.create(Link);

import heroImage from '../images/rupiya_official_hero.png';

const HeroSection = () => {
  const containerRef = useRef(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100vh] lg:min-h-[90vh] flex items-center pt-20 md:pt-28 lg:pt-24 pb-0 overflow-hidden bg-white"
    >

      <div className="container relative z-10 mx-auto px-6 md:px-10 lg:px-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 mt-0">

        {/* --- TEXT CONTENT (LEFT SIDE) --- */}
        <motion.div
          style={{ opacity: opacityText }}
          className="flex-1 w-full lg:w-[50%] flex flex-col items-start xl:pl-12 lg:pl-6 z-20 pt-10 lg:pt-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 }
            }
          }}
        >
          {/* Main Title */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0 }
            }}
            className="font-sans text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[3.5rem] xl:text-[4rem] font-bold text-[#f97316] leading-[1.1] mb-4 tracking-tight w-full"
          >
            <span className="block mb-1 whitespace-nowrap">{t('hero.title1')}</span>
            <span
              className="block"
              dangerouslySetInnerHTML={{
                __html: t('hero.title2').replace('Digital', '<span class="text-[#166534] font-black">Digital</span>')
              }}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0 }
            }}
            className="font-sans text-[2rem] md:text-[2.6rem] lg:text-[3rem] text-[#166534] font-extrabold mb-5"
          >
            {t('hero.subtitle')}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-[#4b5563] text-[1.1rem] md:text-[1.25rem] font-semibold leading-relaxed mb-10 max-w-[550px]"
          >
            {t('hero.desc')}
          </motion.p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
            <MotionLink
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              to="#download"
              className="flex items-center justify-center gap-4 bg-[#166534] text-white font-bold text-[17px] px-8 py-[18px] rounded-full transition-all duration-300 shadow-xl w-full sm:w-auto hover:bg-[#14532d]"
            >
              <span>{t('hero.downloadBtn')}</span>
              <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
              </div>
            </MotionLink>

            <MotionLink
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              to="/ecosystem"
              className="flex items-center justify-center gap-3 bg-white border-2 border-[#166534]/20 text-[#166534] font-bold text-[17px] px-8 py-[16px] rounded-full transition-all duration-300 shadow-lg w-full sm:w-auto hover:bg-[#166534]/5"
            >
              <Landmark className="w-5 h-5" />
              <span>{t('nav.ecosystem')}</span>
            </MotionLink>
          </div>

          {/* SCANNING ACTIVE Pill Badge */}
          <HoverBadge
            topText={t('hero.scanningActive')}
            bottomText={t('hero.districts')}
          />

        </motion.div>

        {/* --- RIGHT SIDE: Farmer montage + farm below it --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="flex-1 w-full lg:w-[50%] relative z-20 flex flex-col items-center lg:items-end"
        >
          {/* Farmer montage - STATIC */}
          <div className="relative w-full max-w-[550px] xl:max-w-[650px] z-10">
            <img
              src={heroImage}
              alt="Farmer Hero Concept"
              className="w-full h-auto object-contain"
            />
          </div>

        </motion.div>

      </div>
    </section>
  );
};

/* Micro-component for the sleek Pill Badge shown in screenshot */
const HoverBadge = ({ topText, bottomText }) => (
  <div className="flex items-center gap-3 px-6 py-[12px] bg-white border-[1.5px] border-gray-100 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all bg-opacity-90 backdrop-blur-md mt-6">
    <div className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-60"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase leading-tight">{topText}</span>
      <span className="text-[12px] text-gray-700 font-black uppercase leading-tight">{bottomText}</span>
    </div>
  </div>
);

export default HeroSection;
