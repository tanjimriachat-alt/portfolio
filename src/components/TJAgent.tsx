import { useState } from 'react';
import { Bot, Send, X, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '@/src/lib/utils';

// Initialize conditionally to prevent crash if key is missing
let genAI: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'undefined') {
    genAI = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("AI Initialization failed:", e);
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function TJAgent({ onLoginRequest }: { onLoginRequest?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Greetings! I am TJ, your neural guide to TRIVONIX. How can I assist your exploration today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!genAI) {
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'ai', content: "Neural authentication failed. Environment configuration incomplete." }
      ]);
      setInput('');
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const model = 'gemini-3-flash-preview';
      const prompt = `
        You are "TJ", an advanced AI agent for the portfolio of "Trivonix".
        Trivonix's developer is a high-achieving student (HSC 2026) aspiring for BUET.
        Skills: Python, React, Kali Linux, Zorin OS, AI models, Robotics.
        Notable projects:
        1. TJ AI Assistant: This very agent you are based on.
        2. Rover Scout Ops: A complex operations management tool for Rover Scouts.
        
        Style: Sophisticated, futuristic, polite, but with a tech-edge. Use terms like "Neural Link", "Optimization", "Intelligence".
        Keep responses concise (max 3 sentences). Communicate primarily in English but understand Bengali if asked.
        
        User context: ${userMsg}
      `;

      if (!genAI) throw new Error("AI not initialized");
      const response = await (genAI as any).models.generateContent({
        model,
        contents: prompt,
      });

      const aiResponse = response.text || "I'm experiencing a minor neural synchronization delay. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Neural link offline. Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 flex h-[500px] w-80 flex-col overflow-hidden glass rounded-[32px] border-white/10 shadow-2xl backdrop-blur-3xl sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-white/[0.02] p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-neon-violet/40 to-neon-aqua/40 flex items-center justify-center border border-white/10">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-obsidian bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold tracking-tight text-white">TJ AGENT</h3>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-neon-aqua animate-pulse">Neural active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <X size={16} className="opacity-70" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    msg.role === 'ai' 
                      ? "bg-white/5 border border-white/10 rounded-tl-none self-start" 
                      : "bg-neon-violet/20 border border-neon-violet/30 rounded-tr-none self-end ml-auto"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-2 self-start">
                  <MoreHorizontal className="animate-pulse" size={16} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire with TJ..."
                  className="w-full rounded-xl bg-obsidian/50 border border-white/10 px-4 py-2.5 pr-12 text-sm outline-none focus:border-neon-violet/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1.5 rounded-lg bg-neon-violet p-1.5 text-white hover:bg-neon-violet/80 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full glass transition-all hover:scale-110 active:scale-95 group border-white/10 hover:border-neon-violet/30",
          isOpen && "bg-white/10 border-white/20"
        )}
      >
        <Bot className={cn("transition-all duration-300", isOpen ? "text-neon-violet rotate-12" : "text-white/60 group-hover:text-white")} size={32} />
      </button>
    </div>
  );
}
