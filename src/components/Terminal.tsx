import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Log {
  type: 'info' | 'error' | 'success' | 'input';
  message: string;
}

export default function Terminal({ onLoginRequest }: { onLoginRequest?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<Log[]>([
    { type: 'info', message: 'Trivonix OS v1.0.4 loaded.' },
    { type: 'info', message: 'System heartbeat: Normal.' },
    { type: 'success', message: 'Neural link established.' },
    { type: 'info', message: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    const newLogs: Log[] = [...logs, { type: 'input', message: input }];

    switch (cmd) {
      case 'help':
        newLogs.push({ type: 'info', message: 'Available: projects, bio, tools, clear, contact, login' });
        break;
      case 'login':
        newLogs.push({ type: 'success', message: 'Initializing auth protocol...' });
        onLoginRequest?.();
        break;
      case 'projects':
        newLogs.push({ type: 'success', message: 'Fetching projects from main frame...' });
        newLogs.push({ type: 'info', message: '- TJ AI Assistant' });
        newLogs.push({ type: 'info', message: '- Rover Scout Ops' });
        break;
      case 'bio':
        newLogs.push({ type: 'info', message: 'AI Developer | HSC 2026 | BUET Aspirant' });
        break;
      case 'clear':
        setLogs([{ type: 'info', message: 'Console cleared.' }]);
        setInput('');
        return;
      case 'tools':
        newLogs.push({ type: 'info', message: 'Stack: Python, React, Kali Linux, Zorin OS, PyTorch' });
        break;
      case 'contact':
        newLogs.push({ type: 'success', message: 'Protocol: tanjimriachat@gmail.com' });
        break;
      default:
        newLogs.push({ type: 'error', message: `Command not found: ${cmd}` });
    }

    setLogs(newLogs);
    setInput('');
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 h-80 w-80 overflow-hidden glass rounded-[32px] border-white/10 flex flex-col shadow-2xl backdrop-blur-3xl sm:w-96"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-aqua animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">CORE_CONSOLE</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500/50" />
                <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                <div className="h-2 w-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5 scrollbar-hide"
            >
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "flex gap-2",
                  log.type === 'error' && "text-red-400",
                  log.type === 'success' && "text-neon-aqua",
                  log.type === 'input' && "text-neon-violet"
                )}>
                  <span className="opacity-50 select-none">
                    {log.type === 'input' ? '>' : '$'}
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommand} className="p-4 pt-0">
              <div className="flex items-center gap-1 border-t border-white/10 pt-3">
                <ChevronRight size={14} className="text-neon-aqua shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-transparent outline-none font-mono text-[11px] text-neon-aqua placeholder:opacity-30"
                  placeholder="Execute protocol..."
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full glass transition-all hover:scale-110 active:scale-95 group border-white/10",
          isOpen && "bg-white/10 border-white/20"
        )}
      >
        <TerminalIcon className={cn("text-white/60 group-hover:text-white transition-all duration-300", isOpen ? "rotate-180 text-neon-aqua" : "")} size={22} />
      </button>
    </div>
  );
}
