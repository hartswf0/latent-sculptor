'use client';

import React from 'react';
import type { Node } from './types';
import { ParameterNode } from './parameter-node';
import { cn } from '@/lib/utils';

interface NodeCanvasProps {
  nodes: Node[];
  selectedNodeIds: string[];
  onNodeMouseDown: (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeValueChange: (nodeId: string, value: any) => void;
  onNodeSelect: (e: React.MouseEvent, nodeId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function NodeCanvas({
  nodes,
  selectedNodeIds,
  onNodeMouseDown,
  onNodeDelete,
  onNodeValueChange,
  onNodeSelect,
  canvasRef,
}: NodeCanvasProps) {

  const getInfluence = (y: number) => {
    if (!canvasRef.current) return 0;
    const canvasHeight = canvasRef.current.offsetHeight;
    const influence = 100 - (y / canvasHeight) * 100;
    return Math.max(0, Math.min(100, influence));
  };
  
  return (
    <div ref={canvasRef} className="w-full h-full relative overflow-hidden" onClick={(e) => {
        if (e.target === e.currentTarget) {
            onNodeSelect(e, ''); // Deselect all
        }
    }}>
      {/* Background Grid */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
        <defs>
          <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="hsl(var(--border) / 0.2)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="url(#smallGrid)" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border) / 0.4)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Influence Axis */}
      <div className="absolute top-0 right-4 h-full flex flex-col justify-between py-10">
        <span className="text-xs text-muted-foreground">100% Influence</span>
        <div className="h-full w-px bg-border/50 mx-auto"></div>
        <span className="text-xs text-muted-foreground">0% Influence</span>
      </div>


      {nodes.map((node) => (
        <div key={node.id} onClick={(e) => onNodeSelect(e, node.id)}>
          <ParameterNode
            node={node}
            onMouseDown={onNodeMouseDown}
            onDelete={onNodeDelete}
            onValueChange={onNodeValueChange}
            isSelected={selectedNodeIds.includes(node.id)}
            influence={getInfluence(node.position.y)}
          />
        </div>
      ))}
    </div>
  );
}
