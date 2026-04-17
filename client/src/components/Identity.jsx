import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Identity = ({ setUser }) => {
  const handleSelect = (name) => {
    localStorage.setItem('mplayer_user', name);
    setUser(name);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-3xl flex flex-col items-center gap-8 text-center max-w-md w-full mx-4"
      >
        <div className="relative">
          <Heart className="w-16 h-16 text-primary animate-heart fill-primary/20" />
          <div className="absolute inset-0 bg-primary blur-3xl opacity-30"></div>
        </div>

        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Who are you?
          </h1>
          <p className="text-slate-400 mt-2">Pick your heart to start listening together</p>
        </div>

        <div className="flex gap-6 w-full mt-4">
          <button
            onClick={() => handleSelect('Abhishek')}
            className="flex-1 glass p-6 rounded-2xl hover:bg-primary/20 transition-all group active:scale-95 border-white/5 hover:border-primary/50"
          >
            <span className="block text-xl font-semibold group-hover:text-primary transition-colors">Abhishek</span>
            <span className="text-xs text-slate-500 mt-1 block">The Music Man</span>
          </button>

          <button
            onClick={() => handleSelect('Radhika')}
            className="flex-1 glass p-6 rounded-2xl hover:bg-primary/20 transition-all group active:scale-95 border-white/5 hover:border-primary/50"
          >
            <span className="block text-xl font-semibold group-hover:text-primary transition-colors">Radhika</span>
            <span className="text-xs text-slate-500 mt-1 block">The Melody Queen</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Identity;
