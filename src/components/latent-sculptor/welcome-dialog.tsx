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
import { Lightbulb, MousePointer2, Workflow, MoveVertical } from 'lucide-react';

const FeatureHighlight = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


export function WelcomeDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="w-7 h-7 text-primary"/>
            Welcome to Latent Sculptor
          </DialogTitle>
          <DialogDescription className="pt-2">
            A tool for sculpting images with ideas. Here's a quick guide to get you started:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <FeatureHighlight 
                icon={MousePointer2}
                title="Node-Based Canvas"
                description="Add and move nodes on the canvas. Each node represents a parameter or an instruction for the AI."
            />
            <FeatureHighlight 
                icon={MoveVertical}
                title="Positional Influence"
                description="The vertical position of a node determines its influence on the final image. Higher nodes have more weight."
            />
             <FeatureHighlight 
                icon={Workflow}
                title="Step-by-Step Pipeline"
                description="Use the buttons in the sidebar to step through the image generation process, from input to final output."
            />
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Start Sculpting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
