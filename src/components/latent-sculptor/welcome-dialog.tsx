'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NODE_TYPE_ICONS, NODE_TYPE_COLORS } from './node-config';

const nodeInfo = [
    { type: 'text-prompt', name: 'Text Prompt', description: 'Provides text descriptions to guide the AI. This is the primary way to define the subject and style of the image.' },
    { type: 'camera-input', name: 'Camera Input', description: 'Uses a live feed from your webcam as the initial input image for the pipeline.' },
    { type: 'pixel-noise', name: 'Noise', description: 'Adds random static to the image, which can create texture and complexity.' },
    { type: 'pixel-brightness', name: 'Brightness', description: 'Adjusts the overall lightness or darkness of the image.' },
    { type: 'pixel-color', name: 'Color', description: 'Applies a solid color tint to the image.' },
    { type: 'canny-edge', name: 'Canny Edge', description: 'Detects edges in the input and creates a line-drawing effect, useful for structural guidance.' },
    { type: 'setting-diffusion', name: 'Diffusion', description: "Controls the strength of the AI's creative input. Higher values give the AI more freedom." },
    { type: 'setting-seed', name: 'Seed', description: 'A number that initializes the random generation. Using the same seed with the same prompt will produce similar results.' },
    { type: 'meta-node', name: 'Group', description: 'Combines multiple selected nodes into a single, manageable unit.' },
];

const NodeHelpCard = ({ type, name, description }: { type: keyof typeof NODE_TYPE_ICONS, name: string, description: string }) => {
    const Icon = NODE_TYPE_ICONS[type].default;
    const color = NODE_TYPE_COLORS[type];

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full" style={{ backgroundColor: `hsl(${color} / 0.2)`}}>
                 <Icon className="w-6 h-6" style={{ color: `hsl(${color})`}} />
            </div>
            <div>
                <h4 className="font-semibold text-foreground">{name}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};


export function WelcomeDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to Latent Sculptor
          </DialogTitle>
          <DialogDescription>
            A tool for sculpting images with ideas.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="guide">Node Guide</TabsTrigger>
                <TabsTrigger value="inspiration">Inspiration & Credits</TabsTrigger>
            </TabsList>
            <TabsContent value="guide">
                <ScrollArea className="h-96 w-full p-1">
                    <div className="space-y-4 pr-4">
                        {nodeInfo.map(node => <NodeHelpCard key={node.type} {...node} type={node.type as keyof typeof NODE_TYPE_ICONS} />)}
                    </div>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="inspiration">
                <div className="h-96 w-full p-4 text-sm text-foreground">
                    <h3 className="font-semibold text-lg mb-2">Project Inspiration</h3>
                    <p className="text-muted-foreground mb-4">
                        This application is heavily inspired by the principles of "Holistic Prompt Craft" as explored in the academic paper by Joseph Lindley and Roger Whitham. Their work on the PromptJ and PromptTank user interfaces demonstrated novel ways of interacting with generative AI, moving beyond simple text boxes to a more tactile, spatial, and holistic approach.
                    </p>
                     <div className="p-4 border rounded-lg bg-muted/50">
                        <p className="font-semibold">Towards Holistic Prompt Craft</p>
                        <p className="text-muted-foreground text-xs">Joseph Lindley & Roger Whitham, Imagination Lancaster, Lancaster University, UK</p>
                        <a 
                            href="https://doi.org/10.1145/3715336.3735414" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs"
                        >
                            https://doi.org/10.1145/3715336.3735414
                        </a>
                     </div>
                     <p className="text-muted-foreground mt-4">
                        Latent Sculptor attempts to embody these ideas in a web-based tool, allowing users to experience a more fluid and intuitive way of crafting prompts and guiding AI image generation.
                    </p>
                </div>
            </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Start Sculpting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
