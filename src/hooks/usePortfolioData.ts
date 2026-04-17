import { useState, useEffect } from 'react';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  large?: boolean;
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
  };
  projects: Project[];
}

const DEFAULT_DATA: PortfolioData = {
  hero: {
    protocol: "NEURAL ARCHITECTURE PROTOCOL",
    titleTop: "TRIVONIX",
    titleMid: "X-LEVEL",
    titleBottom: "SENTIENCE",
    description: "A synthesis of futuristic engineering and cinematic visual logic. Architecting digital ecosystems that breathe with intelligence."
  },
  about: {
    profileTag: "DEVELOPER_PROFILE",
    profileImage: "https://picsum.photos/seed/developer/1920/1080?grayscale",
    titleTop: "ENGINEERING",
    titleBottom: "TOMORROW",
    description: "HSC 2026 Candidate. Future BUET Resident. Passionate about AI research, advanced robotics, and building digital worlds that challenge the status quo.",
    stats: [
      { label: 'Neural Sync', val: '99.9%' },
      { label: 'Uptime', val: '24/7' },
      { label: 'Active Nodes', val: '12' },
      { label: 'Target Host', val: 'BUET' },
    ]
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
  ]
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('trivonix_data');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  const updateData = (newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => {
    setData(prev => {
      const merged = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      localStorage.setItem('trivonix_data', JSON.stringify(merged));
      return merged;
    });
  };

  const resetData = () => {
    setData(DEFAULT_DATA);
    localStorage.removeItem('trivonix_data');
  };

  return { data, updateData, resetData };
}
