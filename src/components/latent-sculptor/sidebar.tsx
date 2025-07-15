'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  TextCursorInput,
  Waves,
  Sun,
  Palette,
  Combine,
  Hash,
  BoxSelect,
} from 'lucide-react';
import type { Node, NodeType } from './types';
import { GuidanceTool } from './guidance-tool';

interface SidebarProps {
  nodes: Node[];
  addNode: (type: NodeType, name: string) => void;
  groupNodes: () => void;
  selectedNodeIds: string[];
  updateNodeValue: (nodeId: string, value: any) => void;
}

const nodeTools = [
  { type: 'text-prompt', name: 'Text Prompt', icon: TextCursorInput },
  { type: 'pixel-noise', name: 'Noise', icon: Waves },
  { type: 'pixel-brightness', name: 'Brightness', icon: Sun },
  { type: 'pixel-color', name: 'Color', icon: Palette },
  { type: 'setting-diffusion', name: 'Diffusion', icon: Combine },
  { type: 'setting-seed', name: 'Seed', icon: Hash },
];

export function Sidebar({ nodes, addNode, groupNodes, selectedNodeIds, updateNodeValue }: SidebarProps) {
  return (
    <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-card border-r border-border z-40 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Add Nodes</h3>
          <div className="grid grid-cols-2 gap-2">
            {nodeTools.map((tool) => (
              <Button
                key={tool.type}
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => addNode(tool.type, tool.name)}
              >
                <tool.icon className="w-6 h-6 text-primary" />
                <span className="text-xs">{tool.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4">
            <Button onClick={groupNodes} disabled={selectedNodeIds.length < 2} className="w-full">
                <BoxSelect className="mr-2 h-4 w-4" />
                Group Selected ({selectedNodeIds.length})
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">Select 2 or more nodes to group them.</p>
        </div>

        <Separator className="my-2" />

        <GuidanceTool nodes={nodes} updateNodeValue={updateNodeValue} />
      </ScrollArea>
    </aside>
  );
}
