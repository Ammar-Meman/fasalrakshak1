import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Leaf, Sprout, CloudRain, TrendingUp, HandCoins, PhoneCall, Camera, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';

const quickActions = [
  { id: 'disease', icon: <Sprout className="w-4 h-4 text-emerald-600" />, label: "Crop Disease" },
  { id: 'fertilizer', icon: <Leaf className="w-4 h-4 text-emerald-600" />, label: "Fertilizer" },
  { id: 'weather', icon: <CloudRain className="w-4 h-4 text-emerald-600" />, label: "Weather Tips" },
  { id: 'schemes', icon: <HandCoins className="w-4 h-4 text-emerald-600" />, label: "Govt Schemes" },
];

const AISahayikBot = ({ isOpen, onClose, initialPosition }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "🙏 Namaste! I am your KisanDost AI Assistant.\n\nI can help you with crop diseases, fertilizer, weather, profit prediction, and **Government Schemes (PKVY, NMSA, etc.)** — in Hindi, English, or Gujarati!\n\nBas apna sawaal puchiye! / Simply ask your question below 👇" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToProcess = input) => {
    if (!textToProcess.trim()) return;

    const userMsg = { role: 'user', content: textToProcess };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the actual language from context
      const currentLang = lang || 'EN';
      
      // Knowledge Injection for Schemes
      const schemesData = `
        Govt Schemes Knowledge:
        1. PKVY (Paramparagat Krishi Vikas Yojana): Support ₹50,000 per hectare for 3 years. Focus on cluster approach & PGS certification. Eligibility: Small/marginal farmers in clusters of 50+.
        2. NMSA (National Mission for Sustainable Agriculture): Climate resilience, water efficiency, integrated nutrient management, insurance. Eligibility: Registered farmers with land docs.
        3. Soil Health Card (SHC): Free testing every 2 years, personalized manure recommendations. Cost savings on Urea/DAP. Eligibility: All land-holding farmers.
        4. RKVY (Rashtriya Krishi Vikas Yojana): High-tech horticulture, infrastructure for organic markets, DBT. Eligibility: Groups, individual farmers, cooperatives.
      `;

      const response = await fetch('/api/agri/anthropic-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `[Language: ${currentLang}] ${schemesData}\nUser Question: ${textToProcess}. Note: Provide technical but easy to understand agricultural advice.` }]
        })
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const aiReply = data.content?.[0]?.text || "Maaf karein, main abhi uttar nahi de pa raha hoon. Kripya thodi der baad prayas karein.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Network issue detected. I am using my local knowledge: Please ensure your crop has proper drainage and balanced NPK." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (label) => {
    handleSend(`Sir, mujhe ${label} ke baare me janna hai.`);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Microphone access is required to use Voice Intelligence." }]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    setMessages(prev => [...prev, { role: 'user', content: `🎤 [Voice Message Sent]` }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice.webm');
      
      const response = await fetch('/api/agent/tools/voice', {
        method: 'POST',
        // Assuming we need to pass headers with token in a real app, but using standard fetch here
        body: formData
      });

      if (!response.ok) throw new Error("Voice API Error");

      const data = await response.json();
      
      if (data.transcript) {
        setMessages(prev => {
           const newMsgs = [...prev];
           // Replace the "Voice Message Sent" with actual transcript
           newMsgs[newMsgs.length - 1].content = `🎤 "${data.transcript}"`;
           newMsgs.push({ role: 'assistant', content: data.agentResponse || "Analyzed voice input." });
           return newMsgs;
        });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Could not transcribe audio." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Failed to process voice input." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isTooHigh = initialPosition?.y < 400; // If trigger is in the top 400px

  const dynamicStyle = initialPosition?.y > 0 ? {
    ...(isTooHigh ? { top: `calc(${initialPosition.y}px + 60px)` } : { bottom: `calc(100vh - ${initialPosition.y}px + 10px)` }),
    left: `calc(clamp(20px, ${initialPosition.x}px - 190px, 100vw - 400px))`, // clamp to handle edges
    transform: 'none'
  } : {
    bottom: '100px',
    right: '24px'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: isTooHigh ? -20 : 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: isTooHigh ? -20 : 20, scale: 0.9 }}
        style={{ ...dynamicStyle, position: 'fixed' }}
        className="w-[380px] h-[600px] max-h-[85vh] bg-[#F7F9F5] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col z-[1000] border border-green-100/50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#4D9D53] p-5 flex justify-between items-center text-white shrink-0 shadow-lg relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-playfair font-black text-lg leading-tight">KisanDost AI Sahayak</h3>
              <p className="text-[10px] font-nunito font-bold tracking-wider text-green-100 uppercase opacity-80">Hindi • English • Gujarati</p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-2xl transition-all active:scale-95 flex items-center justify-center border border-white/30 shadow-inner group"
            aria-label="Close Assistant"
          >
            <X className="w-6 h-6 text-white stroke-[3px] group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#F7F9F5] relative">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 mt-1 border border-green-100 shadow-sm">
                  <Leaf className="w-5 h-5 text-[#4D9D53]" />
                </div>
              )}

              <div className={`max-w-[80%] p-4 rounded-[24px] text-[15px] font-nunito font-semibold leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#4D9D53] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br/>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3 items-center">
               <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-green-100 shadow-sm">
                  <Sprout className="w-5 h-5 text-[#4D9D53] animate-pulse" />
                </div>
               <div className="bg-white px-5 py-4 rounded-[20px] rounded-tl-none shadow-sm flex gap-1.5 items-center border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce duration-700" />
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce duration-700 delay-150" />
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce duration-700 delay-300" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-4 shrink-0 flex flex-wrap gap-2 bg-white pt-4 border-t border-gray-50 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.label)}
              className="px-4 py-2 bg-[#F0F8EC] border border-[#D5EED1] rounded-2xl flex items-center gap-2 hover:bg-[#E2F0DE] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              {action.icon}
              <span className="text-[13px] font-black text-[#2A6A30]">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white pb-6 shrink-0 border-t border-gray-50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3"
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="bot-camera-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                setMessages(prev => [...prev, { role: 'user', content: `📸 [Image: ${file.name}] \nAnalyze this leaf for potential diseases.` }]);
                setIsLoading(true);

                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  const resp = await fetch('http://localhost:8080/predict-disease', { method: 'POST', body: formData });
                  if (!resp.ok) throw new Error("Server Error");
                  const data = await resp.json();
                  const accuracyVal = (data.confidence * 100).toFixed(1);
                  const replyText = `🔬 Result: *${data.disease}*\n✅ Accuracy: ${accuracyVal}%\n\n🌿 Remedy: ${data.remedy}`;
                  setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
                } catch (err) {
                  setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Local AI analysis failed. Please ensure the model server is running." }]);
                } finally {
                  setIsLoading(false);
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('bot-camera-upload').click()}
              className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-emerald-50 transition-all border border-gray-200 text-gray-500 hover:text-emerald-600 active:scale-95 group shrink-0"
              title="Upload leaf photo"
            >
              <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shrink-0 ${isRecording ? 'bg-red-500 border-red-600 text-white animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'} active:scale-95`}
              title="Hold to speak"
            >
              <Mic className="w-6 h-6" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna sawaal likhein..."
              className="flex-1 bg-[#F5F8F4] rounded-2xl px-6 py-4 text-[15px] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4D9D53]/30 border border-[#E5ECE3] min-w-0 shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-2xl bg-[#4D9D53] flex items-center justify-center hover:bg-[#3d8343] transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-green-900/10 active:scale-95"
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AISahayikBot;
