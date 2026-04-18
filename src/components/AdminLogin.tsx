import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, LogIn, Globe } from 'lucide-react';
import { useAdmin } from '@/src/context/AdminContext';

export default function AdminLogin({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, loginWithGoogle } = useAdmin();
  const [number, setNumber] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(number, pass)) {
      onClose();
      setNumber('');
      setPass('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass rounded-[40px] border-white/10 p-10 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="h-16 w-16 rounded-full bg-neon-aqua/10 flex items-center justify-center mb-6 border border-neon-aqua/20">
                <Lock size={24} className="text-neon-aqua" />
              </div>
              <h2 className="text-3xl font-display font-bold italic mb-2">ADMIN_ACCESS</h2>
              <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Restricted Protocol Area</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2 ml-4">Access Number</label>
                <input
                  autoFocus
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-neon-aqua/50 transition-colors"
                  placeholder="Enter secure node number..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2 ml-4">Security Key</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-neon-aqua/50 transition-colors"
                  placeholder="Enter clearance code..."
                />
              </div>

              {error && (
                <p className="text-red-400 text-[10px] uppercase tracking-widest text-center animate-shake">
                  INVALID_CREDENTIALS: ACCESS_DENIED
                </p>
              )}

              <button
                type="submit"
                className="w-full py-5 bg-neon-aqua text-obsidian font-display font-black tracking-[0.2em] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <LogIn size={20} />
                AUTHORIZE
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] text-white/20">
                  <span className="px-4 bg-obsidian">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                  onClose();
                }}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-display font-bold tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Globe size={18} className="text-neon-aqua" />
                CLOUD_SYNC_AUTH
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
