'use client';
import { X, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Node } from './types';

interface ParameterNodeProps {
  node: Node;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onValueChange: (nodeId: string, value: any) => void;
  isSelected: boolean;
  influence: number;
}

export function ParameterNode({
  node,
  onMouseDown,
  onDelete,
  onValueChange,
  isSelected,
  influence,
}: ParameterNodeProps) {
  const renderNodeContent = () => {
    switch (node.type) {
      case 'text-prompt':
        return (
          <Textarea
            value={node.value}
            onChange={(e) => onValueChange(node.id, e.target.value)}
            placeholder="Enter your prompt..."
            className="text-sm h-32"
          />
        );
      case 'pixel-noise':
      case 'pixel-brightness':
      case 'setting-diffusion':
        return (
          <div className="flex items-center gap-4">
            <Slider
              value={[node.value]}
              onValueChange={([val]) => onValueChange(node.id, val)}
              max={100}
              step={1}
            />
            <span className="text-sm font-mono w-12 text-right">{node.value}%</span>
          </div>
        );
      case 'setting-seed':
        return (
          <Input
            type="number"
            value={node.value}
            onChange={(e) => onValueChange(node.id, parseInt(e.target.value, 10) || 0)}
            className="text-sm"
          />
        );
       case 'pixel-color':
        return (
          <div className="space-y-2">
            {['r', 'g', 'b'].map((color) => (
              <div key={color} className="space-y-1">
                <Label className="text-xs uppercase">{color}</Label>
                <div className="flex items-center gap-2">
                   <Slider
                    value={[node.value[color]]}
                    onValueChange={([val]) => onValueChange(node.id, {...node.value, [color]: val})}
                    max={255}
                    step={1}
                  />
                  <span className="text-xs font-mono w-10 text-right">{node.value[color]}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'meta-node':
        return (
            <div className="p-2 border-t">
                <p className="text-xs text-muted-foreground">Contains {node.nodes?.length || 0} nodes.</p>
                <div className="flex flex-wrap gap-1 mt-2">
                    {node.nodes?.map(n => (
                        <div key={n.id} className="text-xs bg-primary/20 text-primary-foreground/80 px-2 py-1 rounded-full">{n.name}</div>
                    ))}
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        'absolute shadow-xl w-72 bg-card/80 backdrop-blur-sm transition-all duration-100',
        isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : 'ring-1 ring-border',
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.width,
        height: node.height,
      }}
    >
      <CardHeader
        className="p-3 flex-row items-center justify-between cursor-grab"
        onMouseDown={(e) => onMouseDown(e, node.id)}
      >
        <div className="flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">{node.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => onDelete(node.id)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
          {renderNodeContent()}
      </CardContent>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="w-10 border-t border-dashed border-accent"></div>
        <div className="text-xs font-mono bg-accent text-accent-foreground rounded-full px-2 py-0.5">
          {influence.toFixed(0)}%
        </div>
      </div>
    </Card>
  );
}
