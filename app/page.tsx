'use client'

import { HeroSection } from "@/components/hero-section-1";
import { LayoutGrid, Bot, Code, Palette, ArrowRight } from 'lucide-react';
import { CategoryList, Category } from "@/components/category-list";
import { Footer } from "@/components/footer";

const sampleCategories: Category[] = [
  {
    id: 1,
    title: 'AI-Powered Generation',
    subtitle: 'Create complete Solana dApps from natural language prompts.',
    onClick: () => alert('Exploring AI-Powered Generation...'),
    icon: <Bot className="w-8 h-8" />,
    featured: true,
  },
  {
    id: 2,
    title: 'Instant Preview',
    subtitle: 'Run generated apps in-browser with WebContainer—no deploys.',
    onClick: () => alert('Exploring Instant Preview...'),
    icon: <ArrowRight className="w-8 h-8" />,
  },
  {
    id: 3,
    title: 'Privy Authentication',
    subtitle: 'Seamless wallet auth with Solana and Ethereum support.',
    onClick: () => alert('Exploring Privy Authentication...'),
    icon: <Palette className="w-8 h-8" />,
  },
  {
    id: 4,
    title: 'Project Management',
    subtitle: 'Save, organize, and iterate on generated projects.',
    onClick: () => alert('Exploring Project Management...'),
    icon: <Code className="w-8 h-8" />,
  },
  {
    id: 5,
    title: 'Real-time Streaming',
    subtitle: 'Watch code generate live with status updates.',
    onClick: () => alert('Exploring Real-time Streaming...'),
    icon: <Code className="w-8 h-8" />,
  },
  {
    id: 6,
    title: 'File Management',
    subtitle: 'Interactive file tree with syntax highlighting and editing.',
    onClick: () => alert('Exploring File Management...'),
    icon: <Code className="w-8 h-8" />,
  },
  {
    id: 7,
    title: 'Responsive Design',
    subtitle: 'Modern UI with TailwindCSS and Shadcn/UI.',
    onClick: () => alert('Exploring Responsive Design...'),
    icon: <Code className="w-8 h-8" />,
  },
];

export default function Home() {
  return (

    <div className="min-h-screen w-full relative bg-black">
      {/* Indigo Cosmos Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%)",
        }}
      />

      <div className=" text-white">
        <HeroSection />
        <div id="features" className="w-full min-h-screen ">
          <CategoryList
            title="Sol-Dapper"
            subtitle="A v0-like platform to generate and run Solana apps in-browser"
            categories={sampleCategories}
            headerIcon={<LayoutGrid className="w-8 h-8" />}
          />
        </div>

        <div id="about">
        
        </div>

        <Footer />
      </div>
    </div>
  );
}
