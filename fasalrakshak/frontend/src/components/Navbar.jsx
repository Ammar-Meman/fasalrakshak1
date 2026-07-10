import React, { useState, useEffect, useContext, useRef } from 'react';
import { Menu, X, Globe, ChevronDown, Sparkles, Package, Users, Droplets, Sun, ShoppingBag, Landmark, ArrowLeft, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import UserMenu from './auth/UserMenu';
import circularFarmLogo from '../images/circular_farm.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const langMenuRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const shouldShowSolid = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isOrganicMode = location.pathname === '/organic';

  // Navigation without icons (Clean & Professional)
  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.detect'), href: '/detect' },
    { name: t('nav.soil_report'), href: '/soil-report' },
    { name: t('nav.store'), href: '/store' },
    { name: t('nav.library'), href: '/library' },
    { name: t('nav.weather'), href: '/weather' },
    { name: t('nav.ecosystem'), href: '/ecosystem' },
  ];

  const organicLinks = [
    { name: t('nav.organic.dashboard'), href: '/organic#hero' },
    { name: t('nav.organic.market'), href: '/organic#schemes' },
    { name: t('nav.organic.crop_path'), href: '/organic#timeline' },
    { name: t('nav.organic.engine'), href: '/organic#features' },
    { name: t('nav.organic.greenhouse'), href: '/organic#greenhouse' },
  ];

  const activeLinks = isOrganicMode ? organicLinks : navLinks;

  const languages = [
    { code: 'HI', name: 'हिन्दी', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'GUJ', name: 'ગુજરાતી', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'EN', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  ];

  // Premium, slightly vintage earthy header styles
  const headerStyles = shouldShowSolid
    ? 'py-3 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e5e0d8] shadow-[0_4px_20px_rgba(45,90,39,0.08)]'
    : 'bg-transparent py-6';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${headerStyles}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center max-w-[1400px]">
        {/* Logo & Back */}
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full transition-all flex items-center justify-center text-[#5c4d3c] hover:bg-[#eadecc] hover:text-[#2d5a27] bg-white shadow-sm border border-[#e5e0d8]"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <Link to={isOrganicMode ? "/organic" : "/"} className="flex items-center gap-3 group shrink-0">
            <img src={circularFarmLogo} alt="FasalRakshak" className="w-10 h-10 object-contain" />
            <span className="font-nunito text-[24px] font-black tracking-tight text-[#1a3818] hidden sm:flex items-center">
              FasalRakshak
            </span>
          </Link>
        </div>

        {/* Desktop Nav - Earthy, attractive, elegant, compact to prevent overlap */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
          {activeLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`group relative flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 text-[14px] font-bold whitespace-nowrap ${isActive
                    ? 'text-white bg-[#1a3818] shadow-md'
                    : 'text-gray-900 hover:text-[#1a3818] hover:bg-black/5'
                  }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative hidden md:block" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-[13px] font-semibold text-[#5c4d3c] hover:bg-[#eadecc]/60 border border-[#e5e0d8] bg-white shadow-sm hover:shadow-md"
            >
              <Globe className="w-4 h-4 text-[#8a7a63]" />
              <span>{lang}</span>
              <ChevronDown className={`w-3 h-3 text-[#8a7a63] transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-52 rounded-2xl shadow-[0_10px_40px_rgba(45,90,39,0.15)] border border-[#e5e0d8] bg-[#fdfbf7] overflow-hidden py-2 z-[100]"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 transition-colors ${lang === l.code ? 'bg-[#eadecc]/50 text-[#2d5a27]' : 'hover:bg-white text-[#5c4d3c]'
                        }`}
                    >
                      <img src={l.flag} alt={l.code} className="w-5 h-4 object-cover rounded shadow-sm border border-[#e5e0d8]" />
                      <span className="text-[14px] font-semibold">{l.name}</span>
                      {lang === l.code && <div className="ml-auto w-2 h-2 rounded-full bg-[#d97706] shadow-[0_0_8px_rgba(217,119,6,0.6)]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="hidden lg:block">
              <UserMenu isMobile={false} />
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:flex bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-[#fdfbf7] font-semibold h-10 px-6 rounded-full transition-all duration-300 items-center justify-center text-[14px] shadow-[0_4px_14px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] hover:-translate-y-[1px]"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#2d5a27] p-2 focus:outline-none hover:bg-[#eadecc]/50 rounded-full bg-white shadow-sm border border-[#e5e0d8]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed top-0 right-0 w-[85%] sm:w-[350px] h-screen bg-[#fdfbf7] shadow-[-20px_0_40px_rgba(0,0,0,0.1)] py-8 px-6 flex flex-col gap-4 z-[1000] overflow-y-auto border-l border-[#e5e0d8]"
          >
            <div className="flex justify-between items-center mb-6 border-b border-[#e5e0d8] pb-6">
              <div className="flex items-center gap-3">
                <img src={circularFarmLogo} alt="FasalRakshak" className="w-10 h-10 object-contain" />
                <span className="font-nunito text-[24px] font-black tracking-tight text-[#1a3818] flex items-center">
                  FasalRakshak
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-full transition-all bg-white text-[#5c4d3c] hover:bg-[#eadecc] border border-[#e5e0d8] shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {activeLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isActive
                        ? 'bg-[#1a3818] text-white shadow-md'
                        : 'text-gray-900 hover:bg-black/5'
                      }`}
                  >
                    <span className="font-bold text-[18px]">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8 border-t border-[#e5e0d8]">
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-4 mb-6 rounded-xl font-bold text-[15px] bg-gradient-to-r from-[#d97706] to-[#b45309] text-[#fdfbf7] shadow-[0_4px_14px_rgba(217,119,6,0.3)]"
                >
                  Sign In
                </Link>
              )}
              <div className="text-[11px] font-bold text-[#8a7a63] uppercase tracking-widest mb-4 ml-1">Language</div>
              <div className="flex gap-2">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-3 px-2 rounded-xl border text-[12px] font-bold transition-all ${lang === l.code
                        ? 'bg-[#2d5a27] border-[#2d5a27] text-[#fdfbf7] shadow-md'
                        : 'border-[#e5e0d8] text-[#5c4d3c] bg-white'
                      }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
