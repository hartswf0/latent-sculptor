'use client';
import React from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { NodeCanvas } from './node-canvas';
import { PipelineVisualizer } from './pipeline-visualizer';
import type { Node, NodeType } from './types';
import { nanoid } from 'nanoid';
import { generateImage, ImageGenerationOutput } from '@/ai/flows/image-generation-flow';
import { useToast } from '@/hooks/use-toast';

const initialNodes: Node[] = [
  {
    id: 'prompt-1',
    type: 'text-prompt',
    name: 'Primary Prompt',
    position: { x: 100, y: 80 },
    value: 'A stunningly beautiful mushroom, glowing with bioluminescence in a dark forest, cinematic, hyperrealistic.',
    width: 300,
  },
  {
    id: 'noise-1',
    type: 'pixel-noise',
    name: 'Image Noise',
    position: { x: 500, y: 250 },
    value: 20,
    width: 280,
  },
  {
    id: 'diffusion-1',
    type: 'setting-diffusion',
    name: 'Diffusion Strength',
    position: { x: 200, y: 400 },
    value: 75,
    width: 280,
  },
];

export function LatentSculptorPage() {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [selectedNodeIds, setSelectedNodeIds] = React.useState<string[]>([]);
  const [draggingNode, setDraggingNode] = React.useState<{ id: string; offset: { x: number; y: number } } | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [pipelineState, setPipelineState] = React.useState<Partial<ImageGenerationOutput>>({});
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationStep, setGenerationStep] = React.useState(0); // 0: idle, 1: input, 2: pixel, 3: final
  const { toast } = useToast();
  
  React.useEffect(() => {
    const handleMouseUp = () => setDraggingNode(null);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);
  
  const getInfluence = React.useCallback((y: number) => {
    if (!canvasRef.current) return 0;
    const canvasHeight = canvasRef.current.offsetHeight;
    // Ensure influence is 100 at the top (y=0) and 0 at the bottom.
    const influence = 100 - (y / canvasHeight) * 100;
    return Math.max(0, Math.min(100, influence));
  }, []);

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (draggingNode && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - draggingNode.offset.x;
      const newY = e.clientY - canvasRect.top - draggingNode.offset.y;

      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === draggingNode.id
            ? { ...node, position: { x: newX, y: newY } }
            : node
        )
      );
    }
  }, [draggingNode]);

  const handleNodeMouseDown = React.useCallback((e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    e.stopPropagation();
    const nodeElement = e.currentTarget.parentElement;
    if (nodeElement) {
        const nodeRect = nodeElement.getBoundingClientRect();
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        setDraggingNode({
          id: nodeId,
          offset: {
            x: e.clientX - nodeRect.left,
            y: e.clientY - nodeRect.top,
          },
        });
    }
  }, []);

  const handleNodeSelect = React.useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (nodeId === '') { // Deselect all if clicking canvas
        setSelectedNodeIds([]);
        return;
    }
    if (e.shiftKey) {
      setSelectedNodeIds(prev => 
        prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
      );
    } else {
      setSelectedNodeIds(prev => prev.includes(nodeId) && prev.length === 1 ? [] : [nodeId]);
    }
  }, []);

  const addNode = React.useCallback((type: NodeType, name: string) => {
    const newNode: Node = {
      id: nanoid(),
      type,
      name: `${name} ${nodes.filter(n => n.type === type).length + 1}`,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      value: type === 'text-prompt' ? '' : (type === 'pixel-color' ? {r: 128, g: 128, b: 128} : (type === 'camera-input' ? null : 50)),
      width: type === 'text-prompt' || type === 'camera-input' ? 300 : 280,
    };
    setNodes(prev => [...prev, newNode]);
  }, [nodes]);

  const deleteNode = React.useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
  }, []);

  const updateNodeValue = React.useCallback((nodeId: string, value: any) => {
    setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, value } : node));
  }, []);
  
  const groupNodes = React.useCallback(() => {
    if (selectedNodeIds.length < 2) return;
    const nodesToGroup = nodes.filter(n => selectedNodeIds.includes(n.id));
    const remainingNodes = nodes.filter(n => !selectedNodeIds.includes(n.id));

    const totalX = nodesToGroup.reduce((sum, n) => sum + n.position.x, 0);
    const totalY = nodesToGroup.reduce((sum, n) => sum + n.position.y, 0);

    const metaNode: Node = {
      id: nanoid(),
      type: 'meta-node',
      name: `Group ${nodes.filter(n => n.type === 'meta-node').length + 1}`,
      position: { x: totalX / nodesToGroup.length, y: totalY / nodesToGroup.length },
      value: null,
      nodes: nodesToGroup,
      width: 300
    };

    setNodes([...remainingNodes, metaNode]);
    setSelectedNodeIds([metaNode.id]);
  }, [selectedNodeIds, nodes]);

  const handleNextStep = React.useCallback(async () => {
    setIsGenerating(true);
    try {
        const result = await generateImage({ nodes, step: generationStep + 1, lastResult: pipelineState });
        setPipelineState(result);
        setGenerationStep(prev => prev + 1);
    } catch (error) {
        console.error("Failed to generate image:", error);
        toast({
            variant: 'destructive',
            title: 'Image Generation Failed',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    } finally {
        setIsGenerating(false);
    }
  }, [nodes, toast, generationStep, pipelineState]);
  
  const handlePreviousStep = React.useCallback(() => {
    if (generationStep > 0) {
      setGenerationStep(prev => prev - 1);
      
      setPipelineState(current => {
          const newState = {...current};
          if (generationStep === 1) { // going from 1 to 0
            delete newState.inputImage;
          }
          if (generationStep === 2) { // going from 2 to 1
             delete newState.pixelManipulationsImage;
             delete newState.generativeModelInputImage;
          }
           if (generationStep === 3) { // going from 3 to 2
            delete newState.finalImage;
          }
          return newState;
      });
    }
  }, [generationStep]);

  const handleReset = React.useCallback(() => {
    setPipelineState({});
    setGenerationStep(0);
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground" onMouseMove={handleMouseMove}>
      <Header nodes={nodes} getInfluence={getInfluence} />
      <Sidebar 
        nodes={nodes}
        addNode={addNode} 
        groupNodes={groupNodes}
        selectedNodeIds={selectedNodeIds}
        updateNodeValue={updateNodeValue}
        onNextStep={handleNextStep}
        onPreviousStep={handlePreviousStep}
        onReset={handleReset}
        isGenerating={isGenerating}
        generationStep={generationStep}
      />
      <main className="pt-16 pl-72 pb-44">
        <div className="h-[calc(100vh-16rem)] w-full">
            <NodeCanvas
                nodes={nodes}
                selectedNodeIds={selectedNodeIds}
                onNodeMouseDown={handleNodeMouseDown}
                onNodeDelete={deleteNode}
                onNodeValueChange={updateNodeValue}
                onNodeSelect={handleNodeSelect}
                canvasRef={canvasRef}
                getInfluence={getInfluence}
            />
        </div>
      </main>
      <PipelineVisualizer pipelineState={pipelineState} isGenerating={isGenerating} generationStep={generationStep} />
    </div>
  );
}
