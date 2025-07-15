'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { NodeCanvas } from './node-canvas';
import { PipelineVisualizer } from './pipeline-visualizer';
import type { Node, NodeType } from './types';
import { nanoid } from 'nanoid';

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
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [draggingNode, setDraggingNode] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseUp = () => setDraggingNode(null);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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

  const handleNodeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
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

  const handleNodeSelect = useCallback((e: React.MouseEvent, nodeId: string) => {
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

  const addNode = useCallback((type: NodeType, name: string) => {
    const newNode: Node = {
      id: nanoid(),
      type,
      name: `${name} ${nodes.filter(n => n.type === type).length + 1}`,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      value: type === 'text-prompt' ? '' : (type === 'pixel-color' ? {r: 128, g: 128, b: 128} : 50),
      width: type === 'text-prompt' ? 300 : 280,
    };
    setNodes(prev => [...prev, newNode]);
  }, [nodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
  }, []);

  const updateNodeValue = useCallback((nodeId: string, value: any) => {
    setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, value } : node));
  }, []);
  
  const groupNodes = useCallback(() => {
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

  return (
    <div className="min-h-screen bg-background text-foreground" onMouseMove={handleMouseMove}>
      <Header />
      <Sidebar 
        nodes={nodes}
        addNode={addNode} 
        groupNodes={groupNodes}
        selectedNodeIds={selectedNodeIds}
        updateNodeValue={updateNodeValue}
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
            />
        </div>
      </main>
      <PipelineVisualizer />
    </div>
  );
}
