import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { Github, Linkedin, Mail, Cpu, Shield, Code, Globe, LogOut, Settings, RotateCcw, Image as ImageIcon } from 'lucide-react';
import Background3D from '@/src/components/Background3D';
import Terminal from '@/src/components/Terminal';
import TJAgent from '@/src/components/TJAgent';
import ProjectCard from '@/src/components/ProjectCard';
import CustomCursor from '@/src/components/CustomCursor';
import AdminLogin from '@/src/components/AdminLogin';
import EditableText from '@/src/components/EditableText';
import { cn } from '@/src/lib/utils';
import { useAdmin } from '@/src/context/AdminContext';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isEditMode, setIsEditMode, isAdmin, logout } = useAdmin();
  const { data, updateData, resetData } = usePortfolioData();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-obsidian text-white/90 selection:bg-neon-aqua/30 selection:text-white">
      <div className="background-ambient" />
      <Background3D />
      <CustomCursor />
      <TJAgent />

      {/* Admin Toolbar */}
      {isAdmin && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 glass px-6 py-3 rounded-full border-neon-aqua/30 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className={cn("w-2 h-2 rounded-full", isEditMode ? "bg-neon-aqua animate-pulse" : "bg-white/20")} />
            <span className="text-[9px] font-mono tracking-widest uppercase">
              {isEditMode ? "Mode: Editing" : "Mode: Restricted"}
            </span>
          </div>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isEditMode ? "bg-neon-aqua text-obsidian" : "hover:bg-white/5"
            )}
            title="Toggle Edit Mode"
          >
            <Settings size={16} />
          </button>
          {isEditMode && (
            <button 
              onClick={() => {
                const url = prompt("Enter Image URL:", data.about.profileImage);
                if (url) updateData(prev => ({ ...prev, about: { ...prev.about, profileImage: url } }));
              }}
              className="p-2 rounded-lg hover:bg-neon-aqua/20 text-neon-aqua transition-colors"
              title="Update Profile Image"
            >
              <ImageIcon size={16} />
            </button>
          )}
          {isEditMode && (
            <button 
              onClick={() => {
                if(confirm("Factory reset all data? This cannot be undone.")) resetData();
              }}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              title="Reset to Factory Defaults"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button 
            onClick={logout}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Secure Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-10 pointer-events-none">
        <div className="pointer-events-auto">
          <span className="font-display font-black text-2xl tracking-tighter italic text-glow-aqua">TRIVONIX</span>
        </div>
        <div className="hidden md:flex gap-12 pointer-events-auto items-center">
          {['Projects', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.4em] font-medium hover:text-neon-aqua transition-colors opacity-60 hover:opacity-100"
            >
              {item}
            </a>
          ))}
          <a href="#" className="p-3 glass rounded-full hover:bg-neon-aqua/20 transition-all border-white/10 group">
            <Github size={18} className="group-hover:text-neon-aqua" />
          </a>
          {!isAdmin && (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="p-3 glass rounded-full hover:bg-black/20 hover:text-neon-aqua transition-all border-white/10"
              title="Admin Login"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center pt-20">
        <div className="relative">
          <div className="absolute -inset-20 bg-neon-aqua/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="mb-8 font-mono text-[10px] tracking-[0.65em] text-neon-aqua uppercase opacity-80">
            <EditableText 
              value={data.hero.protocol} 
              onChange={(val) => updateData(prev => ({ ...prev, hero: { ...prev.hero, protocol: val } }))}
            />
          </div>
          
          <h1 className="text-[12vw] md:text-[8vw] font-display font-black leading-[0.85] tracking-tighter uppercase">
            <span className="block text-white">
              <EditableText 
                value={data.hero.titleTop} 
                onChange={(val) => updateData(prev => ({ ...prev, hero: { ...prev.hero, titleTop: val } }))}
              />
            </span>
            <span className="block text-white/20 hover:text-neon-aqua transition-colors duration-1000">
              <EditableText 
                value={data.hero.titleMid} 
                onChange={(val) => updateData(prev => ({ ...prev, hero: { ...prev.hero, titleMid: val } }))}
              />
            </span>
            <span className="block bg-gradient-to-r from-white/10 via-white to-white/10 bg-clip-text text-transparent italic">
              <EditableText 
                value={data.hero.titleBottom} 
                onChange={(val) => updateData(prev => ({ ...prev, hero: { ...prev.hero, titleBottom: val } }))}
              />
            </span>
          </h1>

          <div className="mt-12 max-w-lg mx-auto">
            <div className="text-sm md:text-base text-white/40 leading-relaxed font-light tracking-wide italic">
              <EditableText 
                multiline
                value={data.hero.description} 
                onChange={(val) => updateData(prev => ({ ...prev, hero: { ...prev.hero, description: val } }))}
              />
            </div>
          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center gap-4 opacity-30"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent" />
          <span className="text-[9px] tracking-[0.5em] uppercase">INITIATE_SCROLL</span>
        </motion.div>
      </section>

      {/* New Project Showcase */}
      <section id="projects" className="py-40 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-32 border-b border-white/5 pb-12 gap-10">
            <h2 className="text-6xl md:text-9xl font-display font-extrabold tracking-tighter italic">GALLERY</h2>
            <p className="max-w-xs text-xs text-white/30 uppercase tracking-[0.3em] leading-loose">
              001 / SELECTED WORKS <br/>
              A COLLECTION OF HIGH-FIDELITY DEPLOYMENTS FOR THE NEXT ERA OF HUMAN-AI INTERACTION.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {data.projects.map((project, i) => (
              <ProjectCard
                key={i}
                index={i}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                onUpdate={(updated) => updateData(prev => {
                  const newProjects = [...prev.projects];
                  newProjects[i] = { ...newProjects[i], ...updated };
                  return { ...prev, projects: newProjects };
                })}
                className={cn(
                  "aspect-[4/5] md:aspect-[3/4]",
                  i % 2 === 1 ? "md:mt-40" : ""
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Portrait Divider */}
      <section className="relative h-[80vh] w-full overflow-hidden z-0">
        <motion.div 
          style={{ y: portraitY }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <img 
            src={data.about.profileImage} 
            alt="Cinematic Portrait" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale opacity-60 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center"
          >
            <span className="font-mono text-[10px] tracking-[1em] text-neon-aqua uppercase mb-6 block opacity-50">EYE_OF_THE_ARCHITECT</span>
            <h2 className="text-[10vw] font-display font-black tracking-tighter uppercase opacity-20">SENTIENCE</h2>
          </motion.div>
        </div>
      </section>

      {/* About / Status Section */}
      <section id="about" className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div>
            <span className="font-mono text-xs text-neon-aqua tracking-[0.4em] uppercase mb-8 block">
              <EditableText 
                value={data.about.profileTag} 
                onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, profileTag: val } }))}
              />
            </span>
            <h3 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-12">
              <EditableText 
                value={data.about.titleTop} 
                onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, titleTop: val } }))}
              />
              <br/> 
              <span className="text-white/30 italic">
                <EditableText 
                  value={data.about.titleBottom} 
                  onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, titleBottom: val } }))}
                />
              </span>
            </h3>
            <div className="text-lg text-white/50 leading-relaxed max-w-xl font-light italic mb-16">
              <EditableText 
                multiline
                value={data.about.description} 
                onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, description: val } }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
              {data.about.stats.map((stat, i) => (
                <div key={i} className="group">
                  <div className="text-3xl font-display font-bold mb-2 group-hover:text-neon-aqua transition-colors">
                    <EditableText 
                      value={stat.val} 
                      onChange={(val) => updateData(prev => {
                        const newStats = [...prev.about.stats];
                        newStats[i] = { ...newStats[i], val: val };
                        return { ...prev, about: { ...prev.about, stats: newStats } };
                      })}
                    />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                    <EditableText 
                      value={stat.label} 
                      onChange={(val) => updateData(prev => {
                        const newStats = [...prev.about.stats];
                        newStats[i] = { ...newStats[i], label: val };
                        return { ...prev, about: { ...prev.about, stats: newStats } };
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[3/4] glass rounded-[40px] overflow-hidden border-neon-violet/20 hover:border-neon-aqua/40 transition-all duration-700">
              <img 
                src={data.about.profileImage} 
                alt="Architecture" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
            </div>
            <div className="absolute -top-10 -right-10 glass p-8 rounded-3xl border-white/5 backdrop-blur-3xl hidden md:block">
              <div className="font-mono text-[9px] text-neon-aqua mb-2 tracking-[0.3em]">LOC: DHAKA_BD</div>
              <div className="font-mono text-[9px] text-white/40 tracking-[0.3em]">SYST_INIT: 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Connect */}
      <footer id="contact" className="py-40 px-8 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-40 bg-gradient-to-b from-white/20 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-6xl md:text-[10vw] font-display font-black tracking-tighter mb-16 uppercase opacity-10 hover:opacity-100 transition-opacity duration-1000 cursor-default">
            CONNECT
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-24">
            <a href="mailto:tanjimriachat@gmail.com" className="group">
              <div className="text-2xl font-display font-bold mb-2 group-hover:text-neon-aqua transition-colors italic leading-none">EMAIL_PROTOCOL</div>
              <div className="text-white/40 font-light hover:text-white transition-colors">tanjimriachat@gmail.com</div>
            </a>
            <div className="h-[1px] w-20 bg-white/10 hidden md:block" />
            <div className="flex gap-8">
              <a href="#" className="p-4 glass rounded-full hover:bg-neon-aqua/20 transition-all group">
                <Github size={24} className="group-hover:text-neon-aqua" />
              </a>
              <a href="#" className="p-4 glass rounded-full hover:bg-neon-violet/20 transition-all group">
                <Linkedin size={24} className="group-hover:text-neon-violet" />
              </a>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase italic">
            <span>&copy; TRIVONIX PROTOCOL 2026</span>
            <div className="flex gap-10">
              <span>LAT: 23.8N</span>
              <span>LONG: 90.4E</span>
            </div>
            <span>SENTIENCE ENGINE v4.0</span>
          </div>
        </div>
      </footer>

      <Terminal onLoginRequest={() => setIsLoginOpen(true)} />
      <AdminLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
