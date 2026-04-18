import { useState, useEffect } from 'react';
import { db, doc, onSnapshot, setDoc } from '../lib/firebase';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  large?: boolean;
}

export interface ResearchItem {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  link?: string;
}

export interface PortfolioData {
  hero: {
    protocol: string;
    titleTop: string;
    titleMid: string;
    titleBottom: string;
    description: string;
  };
  about: {
    profileTag: string;
    profileImage: string;
    titleTop: string;
    titleBottom: string;
    description: string;
    stats: { label: string; val: string }[];
    dividerImage: string;
    identity: {
      fullName: string;
      bloodGroup: string;
      location: string;
      philosophy: string;
    };
    education: {
      current: string;
      goal: string;
    };
  };
  projects: Project[];
  research: ResearchItem[];
  social: {
    facebook: string;
    whatsapp: string;
    email: string;
    youtube?: string;
    github?: string;
  };
}

const DEFAULT_DATA: PortfolioData = {
  hero: {
    protocol: "CYBER SHIELD PROTOCOL",
    titleTop: "TANJIM",
    titleMid: "OMAR",
    titleBottom: "TRIVONIX",
    description: "HSC 2026 Science Candidate at Lakshmipur Govt College. Cyber Security Enthusiast & Anonymous Shield Agent."
  },
  social: {
    facebook: "https://facebook.com/riachattanjim",
    whatsapp: "01874816789",
    email: "tanjimriachat@gmail.com",
    youtube: "#",
    github: "#"
  },
  about: {
    profileTag: "IDENTITY_SCAN_v4.0",
    profileImage: "https://storage.googleapis.com/static-files-prod/ais/ais-shared-prod-at-634/tanjimriachat_at_gmail_com/input_file_0.png",
    titleTop: "ARCHITECTING",
    titleBottom: "THE_FUTURE",
    description: "Born Nov 27, 2007. Passionate about Kali Linux, defensive cyber security, and autonomous AI systems. A proactive leader serving as Institute Representative and a committed Rover Scout.",
    stats: [
      { label: 'Neural Sync', val: 'SSC_2024' },
      { label: 'Uptime', val: 'HSC_2026' },
      { label: 'Active Nodes', val: 'VBD_LKP' },
      { label: 'Target Host', val: 'BUET' },
    ],
    dividerImage: "https://storage.googleapis.com/static-files-prod/ais/ais-shared-prod-at-634/tanjimriachat_at_gmail_com/input_file_1.png",
    identity: {
      fullName: "Riachat Tanjim Omar",
      bloodGroup: "A (Negative)",
      location: "Lakshmipur, Bangladesh",
      philosophy: "Career First, Sentience Second."
    },
    education: {
      current: "Lakshmipur Govt College",
      goal: "BUET (CSE)"
    }
  },
  projects: [
    {
      title: "TJ AI Assistant",
      description: "An advanced neural-link assistant built with Google Gemini, featuring context-aware reasoning and adaptive personality modeling.",
      tags: ["Google Gemini", "React", "TypeScript", "Node.js"],
      image: "https://picsum.photos/seed/ai-agent/1200/800",
      large: true
    },
    {
      title: "Rover Scout Ops",
      description: "Multi-operational platform for Rover Scout management. Real-time logging, team coordination, and geo-spatial data tracking.",
      tags: ["Next.js", "Firebase", "Leaflet", "Tailwind"],
      image: "https://picsum.photos/seed/scouting/800/600",
    },
    {
      title: "Dark Matter UI",
      description: "A neo-brutalist design system designed for futuristic sci-fi applications. High contrast, low latency, 8K ready.",
      tags: ["Framer Motion", "Three.js", "CSS Grid"],
      image: "https://picsum.photos/seed/uidesign/800/600",
    },
  ],
  research: [
    {
      title: "Neural Pathways in Robotic Sentience",
      category: "ROBOTICS",
      date: "APR 2026",
      excerpt: "Exploring the intersection of LLMs and physical robotics, focusing on low-latency neural feedback loops."
    },
    {
      title: "The Architecture of Tomorrow",
      category: "AI_RESEARCH",
      date: "MAR 2026",
      excerpt: "A deep dive into decentralised intelligence and the role of Bangladesh in the global AI landscape."
    }
  ]
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA);

  useEffect(() => {
    // Local fallback for initial load speed
    try {
      const saved = localStorage.getItem('trivonix_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({
          ...DEFAULT_DATA,
          ...parsed,
          hero: { ...DEFAULT_DATA.hero, ...parsed.hero },
          about: { ...DEFAULT_DATA.about, ...parsed.about },
          social: { ...DEFAULT_DATA.social, ...parsed.social },
          projects: parsed.projects || DEFAULT_DATA.projects,
          research: parsed.research || DEFAULT_DATA.research
        });
      }
    } catch (e) {}

    // Cloud Real-time Synchronization
    const unsub = onSnapshot(doc(db, 'configs', 'portfolio'), (snap) => {
      if (snap.exists()) {
        const cloudData = snap.data() as PortfolioData;
        setData(prev => {
          const merged = {
            ...DEFAULT_DATA,
            ...cloudData,
            hero: { ...DEFAULT_DATA.hero, ...cloudData.hero },
            about: { 
              ...DEFAULT_DATA.about, 
              ...cloudData.about,
              stats: cloudData.about?.stats || DEFAULT_DATA.about.stats 
            },
            social: { ...DEFAULT_DATA.social, ...cloudData.social },
            projects: cloudData.projects || DEFAULT_DATA.projects,
            research: cloudData.research || DEFAULT_DATA.research
          };
          localStorage.setItem('trivonix_data', JSON.stringify(merged));
          return merged;
        });
      }
    });

    return unsub;
  }, []);

  const updateData = async (newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => {
    setData(prev => {
      const merged = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      
      // Update local storage
      localStorage.setItem('trivonix_data', JSON.stringify(merged));
      
      // Persist to Cloud
      setDoc(doc(db, 'configs', 'portfolio'), {
        ...merged,
        updatedAt: new Date().toISOString()
      }).catch(err => console.error("Cloud Sync Failed:", err));

      return merged;
    });
  };

  const resetData = async () => {
    setData(DEFAULT_DATA);
    localStorage.removeItem('trivonix_data');
    await setDoc(doc(db, 'configs', 'portfolio'), DEFAULT_DATA);
  };

  return { data, updateData, resetData };
}
