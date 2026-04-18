import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import EditableText from '@/src/components/EditableText';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  className?: string;
  index: number;
  onUpdate?: (data: Partial<{ title: string; description: string }>) => void;
}

export default function ProjectCard({ title, description, tags, image, className, index, onUpdate }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
      className={cn(
        "group relative flex flex-col glass-card overflow-hidden rounded-[32px] border-white/5 hover:border-white/10",
        className
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-all duration-[1.5s] group-hover:scale-110 group-hover:blur-sm group-active:scale-105 group-active:blur-sm opacity-50 group-hover:opacity-30 group-active:opacity-30 contrast-125 grayscale group-hover:grayscale-0 group-active:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
        
        {/* Hover/Active Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 translate-y-8 group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-700">
          <div className="font-mono text-[9px] text-neon-aqua tracking-[0.4em] mb-4 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">NODE_00{index + 1}</div>
          <h3 className="text-3xl md:text-5xl font-display font-bold leading-none mb-6">
            <EditableText 
              value={title} 
              onChange={(val) => onUpdate?.({ title: val })}
            />
          </h3>
          
          <div className="text-white/40 text-sm leading-relaxed mb-8 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-700 delay-100 font-light italic max-w-sm">
            <EditableText 
              multiline
              value={description} 
              onChange={(val) => onUpdate?.({ description: val })}
            />
          </div>
 
          <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-700 delay-200">
            <div className="flex gap-4">
              <a href="#" className="text-white/40 hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="text-white/40 hover:text-white transition-colors"><ExternalLink size={20} /></a>
            </div>
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group/btn relative overflow-hidden backdrop-blur-xl">
               <ArrowUpRight size={20} className="text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
