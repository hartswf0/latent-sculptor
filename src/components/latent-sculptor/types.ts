export type NodeType = 'text-prompt' | 'pixel-noise' | 'pixel-brightness' | 'pixel-color' | 'setting-diffusion' | 'setting-seed' | 'meta-node' | 'camera-input' | 'canny-edge';

export interface Node {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  value: any;
  width?: number;
  height?: number;
  nodes?: Node[]; // for meta-nodes
}
