'use client';
import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Node } from './types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { NODE_TYPE_COLORS, NODE_TYPE_ICONS } from './node-config';


interface ParameterNodeProps {
  node: Node;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onValueChange: (nodeId: string, value: any) => void;
  isSelected: boolean;
  influence: number;
}

const CameraInputNode = ({ onValueChange, nodeId, value }: { onValueChange: (nodeId: string, value: any) => void, nodeId: string, value: string | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const { toast } = useToast();
    const { Zap, Camera } = NODE_TYPE_ICONS['camera-input'];

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setHasCameraPermission(true);
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings.',
                });
            }
        };
        getCameraPermission();
    }, [toast]);
    
    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                onValueChange(nodeId, dataUrl);
            }
        }
    }

    return (
        <div className="space-y-2">
            <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                <video ref={videoRef} className={cn("w-full h-full", value ? 'opacity-20' : 'opacity-100')} autoPlay muted playsInline />
                {value && <img src={value} alt="Captured frame" className="absolute inset-0 w-full h-full object-cover" />}
            </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>No Camera</AlertTitle>
                    <AlertDescription>Camera access is required.</AlertDescription>
                </Alert>
            )}
            <Button onClick={captureFrame} disabled={!hasCameraPermission} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                {value ? 'Recapture Frame' : 'Capture Frame'}
            </Button>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}

export function ParameterNode({
  node,
  onMouseDown,
  onDelete,
  onValueChange,
  isSelected,
  influence,
}: ParameterNodeProps) {
  
  const showInfluence = !['pixel-noise', 'pixel-brightness', 'pixel-color', 'setting-diffusion'].includes(node.type);

  const renderNodeContent = () => {
    switch (node.type) {
      case 'camera-input':
          return <CameraInputNode onValueChange={onValueChange} nodeId={node.id} value={node.value} />;
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
        const { r, g, b } = node.value;
        return (
          <div className="flex gap-4">
            <div 
                className="w-20 h-20 rounded-md flex-shrink-0 border"
                style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
            />
            <div className="space-y-2 w-full">
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

  const Icon = NODE_TYPE_ICONS[node.type]?.default || (() => null);
  const color = NODE_TYPE_COLORS[node.type];

  return (
    <Card
      className={cn(
        'absolute shadow-xl bg-card/80 backdrop-blur-sm transition-all duration-100',
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
        className="p-3 flex-row items-center justify-between cursor-grab relative"
        onMouseDown={(e) => onMouseDown(e, node.id)}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ backgroundColor: `hsl(${color})` }} />
        <div className="flex items-center gap-2 pt-1">
            <Icon className="w-5 h-5" style={{ color: `hsl(${color})` }} />
            <CardTitle className="text-base font-medium">{node.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => onDelete(node.id)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
          {renderNodeContent()}
      </CardContent>
       {showInfluence && (
         <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-10 border-t-2 border-dashed" style={{ borderColor: `hsl(${color})` }}></div>
            <div className="text-xs font-mono bg-accent text-accent-foreground rounded-full px-2 py-0.5" style={{ backgroundColor: `hsl(${color})`, color: 'hsl(var(--primary-foreground))' }}>
              {influence.toFixed(0)}%
            </div>
         </div>
       )}
    </Card>
  );
}
