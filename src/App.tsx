import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { Github, Youtube, Linkedin, Mail, Cpu, Shield, Code, Globe, LogOut, Settings, RotateCcw, Facebook, MessageCircle, Image as ImageIcon } from 'lucide-react';
import Background3D from '@/src/components/Background3D';
import Terminal from '@/src/components/Terminal';
import TJAgent from '@/src/components/TJAgent';
import ProjectCard from '@/src/components/ProjectCard';
import CustomCursor from '@/src/components/CustomCursor';
import AdminLogin from '@/src/components/AdminLogin';
import SocialLinksEditor from '@/src/components/SocialLinksEditor';
import EditableText from '@/src/components/EditableText';
import { cn } from '@/src/lib/utils';
import { useAdmin } from '@/src/context/AdminContext';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  onEdit: () => void;
  isEditMode: boolean;
}

function SocialLink({ href, icon, label, colorClass, onEdit, isEditMode }: SocialLinkProps) {
  if (isEditMode) {
    return (
      <button 
        onClick={onEdit}
        className={cn("p-3 glass rounded-full transition-all border border-white/5 relative group", colorClass)}
        title={`Edit ${label}`}
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-aqua rounded-full flex items-center justify-center border border-obsidian">
          <Settings size={6} className="text-obsidian" />
        </div>
        {icon}
      </button>
    );
  }

  return (
    <a 
      href={href === '#' ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("p-3 glass rounded-full transition-all border border-white/5 group", colorClass)}
    >
      {icon}
    </a>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isEditMode, setIsEditMode, isAdmin, logout } = useAdmin();
  const { data, updateData, resetData } = usePortfolioData();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSocialEditorOpen, setIsSocialEditorOpen] = useState(false);

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
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 md:gap-4 glass px-4 md:px-6 py-3 rounded-full border-neon-aqua/30 shadow-[0_0_30px_rgba(0,242,255,0.1)] scale-90 md:scale-100">
          <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4 border-r border-white/10">
            <div className={cn("w-2 h-2 rounded-full", isEditMode ? "bg-neon-aqua animate-pulse" : "bg-white/20")} />
            <span className="text-[7px] md:text-[9px] font-mono tracking-widest uppercase">
              {isEditMode ? "Edit" : "Rel"}
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
            <Settings size={14} />
          </button>
          {isEditMode && (
            <div className="flex items-center gap-2">
              {/* Profile Image Upload */}
              <button 
                onClick={() => document.getElementById('profile-upload')?.click()}
                className="p-2 rounded-lg hover:bg-neon-aqua/20 text-neon-aqua transition-colors"
                title="Upload Profile Photo"
              >
                <ImageIcon size={14} />
              </button>
              <input 
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      updateData(prev => ({ ...prev, about: { ...prev.about, profileImage: base64String } }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              {/* Cinematic Divider Upload */}
              <button 
                onClick={() => document.getElementById('divider-upload')?.click()}
                className="p-2 rounded-lg hover:bg-neon-violet/20 text-neon-violet transition-colors"
                title="Upload Cinematic Divider"
              >
                <Globe size={14} />
              </button>
              <input 
                id="divider-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      updateData(prev => ({ ...prev, about: { ...prev.about, dividerImage: base64String } }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
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
          {['Projects', 'Research', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.4em] font-medium hover:text-neon-aqua transition-colors opacity-60 hover:opacity-100"
            >
              {item}
            </a>
          ))}
          <SocialLink 
            isEditMode={isEditMode}
            href={data.social.github}
            label="GitHub"
            colorClass="hover:bg-neon-aqua/20"
            icon={<Github size={18} className="group-hover:text-neon-aqua" />}
            onEdit={() => setIsSocialEditorOpen(true)}
          />
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
          
          <div className="text-[12vw] md:text-[8vw] font-display font-black leading-[0.85] tracking-tighter uppercase">
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
          </div>

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
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden z-0">
        <motion.div 
          style={{ y: portraitY }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <img 
            src={data.about.dividerImage} 
            alt="Cinematic Battlestation" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale opacity-50 md:opacity-60 brightness-[0.4] md:brightness-50 active:grayscale-0 active:opacity-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center px-8"
          >
            <span className="font-mono text-[8px] md:text-[10px] tracking-[0.6em] md:tracking-[1em] text-neon-aqua uppercase mb-6 block opacity-50">SYNAPTIC_ENVIRONMENT</span>
            <h2 className="text-[12vw] md:text-[10vw] font-display font-black tracking-tighter uppercase opacity-20">ENGINE</h2>
          </motion.div>
        </div>
      </section>

      {/* Research / Blog Section */}
      <section id="research" className="py-40 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-neon-aqua/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div>
              <span className="font-mono text-[10px] tracking-[0.6em] text-neon-aqua uppercase mb-4 block">DATABASE_QUERY</span>
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase italic">RESEARCH</h2>
            </div>
            <div className="max-w-xs text-xs text-white/30 uppercase tracking-[0.3em] leading-loose text-right">
              SYSTEMATIC EXPLORATION OF NEURAL FRONTIERS AND ROBOTIC KINEMATICS.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.research.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-12 glass rounded-[32px] border-white/5 hover:border-neon-aqua/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8">
                  <span className="text-[10px] font-mono text-neon-aqua/40 tracking-widest">{item.date}</span>
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-[9px] font-mono tracking-widest text-white/40 mb-8 border border-white/10">
                  <EditableText 
                    value={item.category} 
                    onChange={(val) => updateData(prev => {
                      const newResearch = [...prev.research];
                      newResearch[i] = { ...newResearch[i], category: val };
                      return { ...prev, research: newResearch };
                    })}
                  />
                </div>

                <div className="text-2xl md:text-3xl font-display font-bold leading-tight mb-6 group-hover:text-neon-aqua transition-colors">
                  <EditableText 
                    value={item.title} 
                    onChange={(val) => updateData(prev => {
                      const newResearch = [...prev.research];
                      newResearch[i] = { ...newResearch[i], title: val };
                      return { ...prev, research: newResearch };
                    })}
                  />
                </div>

                <div className="text-sm text-white/40 font-light italic leading-relaxed mb-10">
                  <EditableText 
                    multiline
                    value={item.excerpt} 
                    onChange={(val) => updateData(prev => {
                      const newResearch = [...prev.research];
                      newResearch[i] = { ...newResearch[i], excerpt: val };
                      return { ...prev, research: newResearch };
                    })}
                  />
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.3em] text-white/20 group-hover:text-neon-aqua transition-colors cursor-pointer">
                  <span>READ_FULL_LOG</span>
                  <div className="w-12 h-[1px] bg-white/10 group-hover:bg-neon-aqua transition-all group-hover:w-20" />
                </div>
              </motion.div>
            ))}
          </div>

          {isEditMode && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => updateData(prev => ({
                  ...prev,
                  research: [...prev.research, {
                    title: "NEW RESEARCH LOG",
                    category: "DATA_CORE",
                    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
                    excerpt: "Initiating new research protocol documentation..."
                  }]
                }))}
                className="px-8 py-4 glass rounded-full border-neon-aqua/20 text-neon-aqua font-mono text-xs tracking-widest hover:bg-neon-aqua/10 transition-all"
              >
                + ADD_RESEARCH_ENTRY
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About / Status Section */}
      <section id="about" className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div>
            <div className="font-mono text-xs text-neon-aqua tracking-[0.4em] uppercase mb-8 block">
              <EditableText 
                value={data.about.profileTag} 
                onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, profileTag: val } }))}
              />
            </div>
            <div className="text-4xl md:text-6xl font-display font-bold leading-tight mb-12">
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
            </div>
            <div className="text-lg text-white/50 leading-relaxed max-w-xl font-light italic mb-16">
              <EditableText 
                multiline
                value={data.about.description} 
                onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, description: val } }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
              <div className="space-y-4">
                <div className="text-[10px] font-mono text-neon-aqua tracking-widest uppercase opacity-60">Identity_Core</div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white/80">
                    <EditableText 
                      value={data.about.identity.fullName} 
                      onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, identity: { ...prev.about.identity, fullName: val } } }))}
                    />
                  </div>
                  <div className="text-[10px] text-white/30 font-mono">BLOOD: {data.about.identity.bloodGroup}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-mono text-neon-violet tracking-widest uppercase opacity-60">Education_Node</div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white/80">
                    <EditableText 
                      value={data.about.education.current} 
                      onChange={(val) => updateData(prev => ({ ...prev, about: { ...prev.about, education: { ...prev.about.education, current: val } } }))}
                    />
                  </div>
                  <div className="text-[10px] text-neon-aqua font-mono uppercase tracking-widest">AIM: {data.about.education.goal}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12 pt-12 border-t border-white/5">
              {data.about.stats.map((stat, i) => (
                <div key={i} className="group">
                  <div className="text-2xl font-display font-bold mb-1 group-hover:text-neon-aqua transition-colors">
                    <EditableText 
                      value={stat.val} 
                      onChange={(val) => updateData(prev => {
                        const newStats = [...prev.about.stats];
                        newStats[i] = { ...newStats[i], val: val };
                        return { ...prev, about: { ...prev.about, stats: newStats } };
                      })}
                    />
                  </div>
                  <div className="text-[8px] uppercase tracking-[0.2em] text-white/30">
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
            {/* Holographic ID Border */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-neon-aqua/20 via-transparent to-neon-violet/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="aspect-[3/4] glass rounded-[40px] overflow-hidden border-neon-violet/20 group-active:border-neon-aqua md:hover:border-neon-aqua transition-all duration-700 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Vertical Scanner Line Animation */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[3px] bg-neon-aqua shadow-[0_0_20px_rgba(0,242,255,1)] z-10 opacity-40 md:opacity-70"
              />
              
              <img 
                src={data.about.profileImage} 
                alt="Riachat Tanjim Omar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale opacity-40 md:opacity-40 group-active:scale-105 group-active:opacity-100 group-active:grayscale-0 md:group-hover:scale-105 md:group-hover:opacity-100 md:group-hover:grayscale-0 transition-all duration-[1.2s] ease-out"
              />
              
              {/* Overlay HUD elements - Fixed for mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent">
                <div className="flex justify-between items-end">
                  <div className="group-active:text-neon-aqua transition-colors">
                    <div className="font-mono text-[7px] md:text-[8px] text-neon-aqua tracking-widest mb-1 uppercase opacity-60">Identity_Scan</div>
                    <div className="font-display font-bold text-base md:text-lg tracking-tight uppercase">R. TANJIM OMAR</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[7px] md:text-[8px] text-white/30 tracking-widest mb-1 uppercase">Class</div>
                    <div className="font-mono text-[9px] md:text-[10px] text-neon-violet font-bold">ALPHA_CREATOR</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-12 -right-8 glass p-6 rounded-2xl border-white/5 backdrop-blur-3xl hidden md:block group-hover:scale-110 transition-transform duration-500">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-aqua animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/60">LIVE_DATA_FEED</span>
                </div>
                <div className="h-[1px] w-full bg-white/10" />
                <div className="space-y-1">
                  <div className="text-[8px] font-mono text-white/30 tracking-widest uppercase">Encryption</div>
                  <div className="text-[9px] font-mono text-neon-aqua">TRIVONIX_v4.2</div>
                </div>
              </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <a href={`mailto:${data.social.email}`} className="group">
                <div className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-neon-aqua transition-colors italic leading-none">EMAIL_PROTOCOL</div>
                <div className="text-white/40 font-light hover:text-white transition-colors text-sm">
                  <EditableText 
                    value={data.social.email} 
                    onChange={(val) => updateData(prev => ({ ...prev, social: { ...prev.social, email: val } }))}
                  />
                </div>
              </a>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl md:text-2xl font-display font-bold mb-4 text-white/20 italic tracking-tighter">NEURAL_LINKS</div>
              <div className="flex flex-wrap justify-center gap-6">
                <SocialLink 
                  isEditMode={isEditMode}
                  href={data.social.github}
                  label="GitHub"
                  colorClass="hover:bg-neon-aqua/20"
                  icon={<Github size={20} className="group-hover:text-neon-aqua text-white/60" />}
                  onEdit={() => setIsSocialEditorOpen(true)}
                />
                <SocialLink 
                  isEditMode={isEditMode}
                  href={data.social.facebook}
                  label="Facebook"
                  colorClass="hover:bg-blue-500/20"
                  icon={<Facebook size={20} className="group-hover:text-blue-400 text-white/60" />}
                  onEdit={() => setIsSocialEditorOpen(true)}
                />
                <SocialLink 
                  isEditMode={isEditMode}
                  href={data.social.whatsapp === '#' ? '#' : `https://wa.me/${data.social.whatsapp.replace(/\D/g,'')}`}
                  label="WhatsApp"
                  colorClass="hover:bg-green-500/20"
                  icon={<MessageCircle size={20} className="group-hover:text-green-400 text-white/60" />}
                  onEdit={() => setIsSocialEditorOpen(true)}
                />
                <SocialLink 
                  isEditMode={isEditMode}
                  href={data.social.youtube || '#'}
                  label="YouTube"
                  colorClass="hover:bg-red-500/20"
                  icon={<Youtube size={20} className="group-hover:text-red-500 text-white/60" />}
                  onEdit={() => setIsSocialEditorOpen(true)}
                />
              </div>

              {isEditMode && (
                <div className="mt-8">
                  <button 
                    onClick={() => setIsSocialEditorOpen(true)}
                    className="text-[9px] font-mono text-neon-aqua/60 hover:text-neon-aqua underline tracking-[0.2em] transition-colors"
                  >
                    CONFIGURE_ALL_LINKS
                  </button>
                </div>
              )}
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
      <SocialLinksEditor 
        isOpen={isSocialEditorOpen}
        onClose={() => setIsSocialEditorOpen(false)}
        data={data.social}
        onSave={(newSocial) => updateData(prev => ({ ...prev, social: newSocial }))}
      />
    </div>
  );
}
