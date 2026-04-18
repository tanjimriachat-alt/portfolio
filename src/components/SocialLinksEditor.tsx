import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Facebook, MessageCircle, Youtube, X, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SocialLinks {
  facebook: string;
  whatsapp: string;
  youtube?: string;
  github?: string;
  email: string;
}

interface SocialLinksEditorProps {
  isOpen: boolean;
  onClose: () => void;
  data: SocialLinks;
  onSave: (links: SocialLinks) => void;
}

export default function SocialLinksEditor({ isOpen, onClose, data, onSave }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<SocialLinks>(data);

  useEffect(() => {
    setLinks(data);
  }, [data, isOpen]);

  const handleSave = () => {
    onSave(links);
    onClose();
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass rounded-[40px] border-white/10 p-8 md:p-12 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-[0.6em] text-neon-aqua uppercase mb-2 block">System_Config</span>
              <h2 className="text-3xl font-display font-bold tracking-tighter uppercase italic">Neutral Links</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white/40 mb-2">
                  <Facebook size={14} className="text-blue-400" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Facebook URL</span>
                </div>
                <input 
                  type="text"
                  value={links.facebook}
                  onChange={(e) => setLinks(prev => ({ ...prev, facebook: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-aqua transition-colors font-mono text-sm"
                  placeholder="https://facebook.com/your-profile"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white/40 mb-2">
                  <MessageCircle size={14} className="text-green-400" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">WhatsApp Number</span>
                </div>
                <input 
                  type="text"
                  value={links.whatsapp}
                  onChange={(e) => setLinks(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-aqua transition-colors font-mono text-sm"
                  placeholder="018XXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white/40 mb-2">
                  <Youtube size={14} className="text-red-500" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">YouTube URL</span>
                </div>
                <input 
                  type="text"
                  value={links.youtube || ''}
                  onChange={(e) => setLinks(prev => ({ ...prev, youtube: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-aqua transition-colors font-mono text-sm"
                  placeholder="https://youtube.com/@your-channel"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white/40 mb-2">
                  <Github size={14} className="text-neon-aqua" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">GitHub URL</span>
                </div>
                <input 
                  type="text"
                  value={links.github || ''}
                  onChange={(e) => setLinks(prev => ({ ...prev, github: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-aqua transition-colors font-mono text-sm"
                  placeholder="https://github.com/your-username"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full mt-10 py-5 bg-neon-aqua text-obsidian rounded-2xl font-display font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)]"
            >
              <Save size={18} />
              SYNC_ALL_LINKS
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
