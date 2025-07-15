'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  RefreshCcw,
  ChevronsRight,
  ChevronLeft,
  Sparkles,
  BoxSelect
} from 'lucide-react';
import type { Node, NodeType } from './types';
import { GuidanceTool } from './guidance-tool';
import { NODE_TYPE_ICONS } from './node-config';

interface SidebarProps {
  nodes: Node[];
  addNode: (type: NodeType, name: string) => void;
  groupNodes: () => void;
  selectedNodeIds: string[];
  updateNodeValue: (nodeId: string, value: any) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onReset: () => void;
  isGenerating: boolean;
  generationStep: number;
}

const nodeTools = [
  { type: 'text-prompt', name: 'Text Prompt' },
  { type: 'camera-input', name: 'Camera Input' },
  { type: 'pixel-noise', name: 'Noise' },
  { type: 'pixel-brightness', name: 'Brightness' },
  { type: 'pixel-color', name: 'Color' },
  { type: 'setting-diffusion', name: 'Diffusion' },
  { type: 'setting-seed', name: 'Seed' },
];

const stepActions = [
    { text: 'Generate Input Image', icon: Sparkles },
    { text: 'Apply Pixel Manipulations', icon: ChevronsRight },
    { text: 'Generate Final Image', icon: ChevronsRight },
    { text: 'Reset Pipeline', icon: RefreshCcw }
];


export function Sidebar({ nodes, addNode, groupNodes, selectedNodeIds, updateNodeValue, onNextStep, onPreviousStep, onReset, isGenerating, generationStep }: SidebarProps) {
  
  const handleActionClick = () => {
    if (generationStep < 3) {
      onNextStep();
    } else {
      onReset();
    }
  }

  const currentAction = stepActions[generationStep];
  const ActionIcon = currentAction.icon;

  return (
    <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-card border-r border-border z-40 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex gap-2">
            {generationStep > 0 && generationStep < 4 && (
                 <Button onClick={onPreviousStep} disabled={isGenerating} variant="outline" size="icon" className="h-12 w-12 flex-shrink-0">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}
            <Button onClick={handleActionClick} disabled={isGenerating} className="w-full h-12 text-base">
                {isGenerating ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <ActionIcon className="mr-2 h-5 w-5" />
                )}
                {isGenerating ? 'Generating...' : currentAction.text}
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Add Nodes</h3>
            <div className="grid grid-cols-2 gap-2">
              {nodeTools.map((tool) => {
                  const ToolIcon = NODE_TYPE_ICONS[tool.type as NodeType]?.default;
                  return (
                    <Button
                      key={tool.type}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => addNode(tool.type as NodeType, tool.name)}
                    >
                      {ToolIcon && <ToolIcon className="w-6 h-6 text-primary" />}
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  )
              })}
            </div>
          </div>

          <div className="p-4">
              <Button onClick={groupNodes} disabled={selectedNodeIds.length < 2} className="w-full">
                  <BoxSelect className="mr-2 h-4 w-4" />
                  Group Selected ({selectedNodeIds.length})
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">Select 2 or more nodes to group them.</p>
          </div>
      </ScrollArea>
      <div className="flex-shrink-0 border-t">
         <GuidanceTool nodes={nodes} updateNodeValue={updateNodeValue} />
      </div>
    </aside>
  );
}
