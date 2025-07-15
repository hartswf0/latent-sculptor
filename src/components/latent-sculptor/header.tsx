'use client';

import React from 'react';
import type { Node } from './types';
import { NODE_TYPE_COLORS } from './node-config';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const LatentSculptorIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <path
        d="M12 4C10.1281 5.48532 8.60532 7.28582 7.5 9.3C6.39468 11.3142 5.75 13.5011 5.75 15.75C5.75 17.9989 6.39468 20.1858 7.5 22.2C8.60532 20.1858 10.1281 18.3853 12 16.9C13.8719 15.4147 15.3947 13.6142 16.5 11.6C17.6053 9.58582 18.25 7.39891 18.25 5.15C18.25 2.90109 17.6053 0.71418 16.5 -1.3C15.3947 0.71418 13.8719 2.51468 12 4Z"
        fill="url(#gradient)"
      />
      <defs>
        <linearGradient id="gradient" x1="5.75" y1="15.75" x2="18.25" y2="5.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );

const GenerationGenome = ({ nodes, getInfluence }: { nodes: Node[], getInfluence: (y: number) => number }) => {
    const totalInfluence = nodes.reduce((sum, node) => sum + getInfluence(node.position.y), 0);
    
    if (totalInfluence === 0) {
        return <div className="h-2 flex-1 rounded-full bg-muted"></div>;
    }

    return (
        <div className="flex flex-1 h-2 rounded-full overflow-hidden bg-muted">
            {nodes.map(node => {
                const influence = getInfluence(node.position.y);
                const width = (influence / totalInfluence) * 100;
                const color = NODE_TYPE_COLORS[node.type];
                return (
                    <div 
                        key={node.id} 
                        style={{ width: `${width}%`, backgroundColor: `hsl(${color})` }}
                        className="h-full transition-all duration-300"
                        title={`${node.name}: ${influence.toFixed(0)}% influence`}
                    />
                )
            })}
        </div>
    )
}

export function Header({ nodes, getInfluence, onHelpClick }: { nodes: Node[], getInfluence: (y: number) => number, onHelpClick: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-6 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-3 w-72">
        <LatentSculptorIcon />
        <h1 className="text-xl font-semibold text-foreground">Latent Sculptor</h1>
      </div>
      <div className="flex-1 px-8 flex items-center gap-4">
        <GenerationGenome nodes={nodes} getInfluence={getInfluence} />
      </div>
       <div className="w-72 flex justify-end">
        <Button variant="ghost" size="icon" onClick={onHelpClick}>
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </div>
    </header>
  );
}
