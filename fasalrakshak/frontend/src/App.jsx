import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import Detect from './pages/Detect';
import DiseaseLibrary from './pages/DiseaseLibrary';
import DiseaseDetail from './pages/DiseaseDetail';
import AgriStore from './pages/Store';

import Weather from './pages/Weather';
import Ecosystem from './pages/Ecosystem';
import SoilReport from './pages/SoilReport';
import LandingPage from './pages/LandingPage';
import OrganicToggle from './components/organic/OrganicToggle';
import NotFound from './components/NotFound';

import { AuthContext } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import AISahayikBot from './components/chatbot/AISahayikBot';
import circularFarmLogo from './images/circular_farm.png';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [botPosition, setBotPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const { isLoading, isLoggedIn } = React.useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(scrollPx / winHeightPx * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Premium Loader while Auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f9f1] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-full h-full border-4 border-green-100 border-t-[#2d5a27] rounded-full flex items-center justify-center"
          >
            <img src={circularFarmLogo} alt="FasalRakshak" className="w-8 h-8 object-contain" />
          </motion.div>
        </div>
        <div className="text-center font-playfair">
          <h2 className="text-3xl font-black text-gray-800">Fasal<span className="text-green-700">Rakshak</span></h2>
          <p className="text-green-600/60 font-nunito font-black uppercase tracking-[0.3em] text-[10px] mt-2">Restoring Your Session</p>
        </div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full h-1 z-[1000] pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
          style={{ width: `${scrollProgress}%`, transition: 'width 0.1s' }}
        ></div>
      </div>

      {!isAuthPage && <Navbar />}

      <div className={`flex-grow flex flex-col ${isAuthPage ? '' : 'pt-16 lg:pt-20'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/detect" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={isLoggedIn ? <Navigate to="/detect" replace /> : <Signup />}
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detect"
              element={<Detect />}
            />
            <Route
              path="/library"
              element={<DiseaseLibrary />}
            />
            <Route
              path="/library/:id"
              element={<DiseaseDetail />}
            />
            {/* Redirect old /diseases URLs to /library */}
            <Route
              path="/diseases"
              element={<Navigate to="/library" replace />}
            />
            <Route
              path="/diseases/:id"
              element={<Navigate to="/library/:id" replace />}
            />
            <Route
              path="/weather"
              element={<Weather />}
            />
            <Route
              path="/ecosystem"
              element={<Ecosystem />}
            />
            <Route
              path="/soil-report"
              element={<SoilReport />}
            />
            {/* New Store Feature from Rishikesh */}
            <Route
              path="/store"
              element={<AgriStore />}
            />
            <Route 
              path="/organic" 
              element={<LandingPage />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isAuthPage && <Footer />}

      {/* Global Organic Farming Switch Toggle */}
      <OrganicToggle />

      {/* Global AI Chatbot Floating Trigger */}
      <div className="fixed bottom-6 right-6 z-[600]">
        {!isChatOpen && (
          <motion.button
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info) => {
              setBotPosition({ x: info.point.x, y: info.point.y });
              // Small timeout to prevent immediate click trigger after drag
              setTimeout(() => setIsDragging(false), 50);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, cursor: "grabbing" }}
            onClick={() => {
              if (!isDragging) setIsChatOpen(true);
            }}
            className="bg-[#4D9D53] text-white px-3 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 whitespace-nowrap hover:bg-[#3d8343] transition-colors cursor-grab active:cursor-grabbing"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-green-100" />
            </div>
            <div className="flex flex-col items-start pr-1">
              <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 leading-none">KisanDost AI</span>
              <span className="text-[12px] font-bold leading-tight">Sahayak</span>
            </div>
          </motion.button>
        )}
      </div>
      
      {/* The actual Chatbot Component */}
      <AISahayikBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        initialPosition={botPosition}
      />
    </div>
  );
}

export default App;
