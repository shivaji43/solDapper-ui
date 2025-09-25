'use client';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6  md:flex md:items-center md:justify-center lg:px-8"> 
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm text-muted-foreground">
            Built with ❤️ for the Solana developer ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}