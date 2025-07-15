import {
  TextCursorInput,
  Waves,
  Sun,
  Palette,
  Combine,
  Hash,
  Camera,
  Zap,
  BoxSelect,
  Pencil,
} from 'lucide-react';
import type { NodeType } from './types';

export const NODE_TYPE_ICONS: Record<NodeType, { default: React.ElementType, [key: string]: React.ElementType }> = {
    'text-prompt': { default: TextCursorInput },
    'camera-input': { default: Camera, Zap: Zap },
    'pixel-noise': { default: Waves },
    'pixel-brightness': { default: Sun },
    'pixel-color': { default: Palette },
    'setting-diffusion': { default: Combine },
    'setting-seed': { default: Hash },
    'meta-node': { default: BoxSelect },
    'canny-edge': { default: Pencil },
};

export const NODE_TYPE_COLORS: Record<NodeType, string> = {
    'text-prompt': '210 40% 56%', // Blue
    'camera-input': '262 82% 62%', // Violet
    'pixel-noise': '168 76% 42%', // Teal
    'pixel-brightness': '48 96% 58%', // Yellow
    'pixel-color': '340 82% 57%', // Pink
    'setting-diffusion': '24 94% 50%', // Orange
    'setting-seed': '122 39% 49%', // Green
    'meta-node': '0 0% 63%', // Gray
    'canny-edge': '300 100% 50%', // Magenta
};
