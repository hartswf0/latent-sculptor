'use client';
import React from 'react';
import Image from 'next/image';
import { ChevronRight, Download, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ImageGenerationOutput } from '@/ai/flows/image-generation-flow';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

const AnimatedChevron = ({ className }: { className?: string }) => (
    <ChevronRight className={cn("text-muted-foreground/50 animate-pulse-slow", className)} size={24} />
);

const PipelineStage = ({ title, imageUrl, hint, isFinal = false, isLoading = false, isActive = false }: { title: string, imageUrl: string | null, hint: string, isFinal?: boolean, isLoading?: boolean, isActive?: boolean }) => {
    const { toast } = useToast();

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `latent-sculptor-${title.toLowerCase().replace(' ', '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!imageUrl) return;
        try {
            // Convert data URL to Blob for sharing
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `latent-sculptor-output.png`, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Created with Latent Sculptor',
                    text: 'Check out this image I created with Latent Sculptor!',
                    files: [file],
                });
            } else {
                 toast({ variant: 'destructive', title: 'Sharing Not Supported', description: 'Your browser does not support sharing files.' });
            }
        } catch (error) {
            console.error('Share error:', error);
            toast({ variant: 'destructive', title: 'Sharing Failed', description: 'Could not share the image.' });
        }
    };
    
    return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <Card className={cn("w-32 h-20 md:w-48 md:h-32 overflow-hidden group", (isFinal || isActive) && "border-accent shadow-lg shadow-accent/20")}>
            <CardContent className="p-0 relative h-full">
                <Image
                    src={imageUrl || 'https://placehold.co/192x128.png'}
                    alt={title}
                    width={192}
                    height={128}
                    className="object-cover w-full h-full"
                    data-ai-hint={hint}
                />
                {isLoading && (
                     <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                    </div>
                )}
                 {isFinal && imageUrl && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" onClick={handleDownload} title="Download Image">
                            <Download className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="secondary" onClick={handleShare} title="Share Image">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
)};

export function PipelineVisualizer({ pipelineState, isGenerating, generationStep }: { pipelineState: Partial<ImageGenerationOutput>, isGenerating: boolean, generationStep: number }) {
    const stages = [
        { title: 'Input Image', imageUrl: pipelineState?.inputImage || null, hint: 'abstract pattern', isLoading: isGenerating && generationStep === 1, isActive: generationStep >= 1 },
        { title: 'Manipulated Image', imageUrl: pipelineState?.manipulatedImage || null, hint: 'glitch art', isLoading: isGenerating && generationStep === 2, isActive: generationStep >= 2 },
        { title: 'Generative Model Input', imageUrl: pipelineState?.generativeModelInputImage || null, hint: 'noisy image', isLoading: false, isActive: generationStep >= 2 },
        { title: 'Final Output', imageUrl: pipelineState?.finalImage || null, hint: 'futuristic city', isFinal: true, isLoading: isGenerating && generationStep === 3, isActive: generationStep >= 3 },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-t border-border">
            <div className="flex items-center justify-center p-4 space-x-2 md:space-x-4 overflow-x-auto">
                {stages.map((stage, index) => (
                    <React.Fragment key={stage.title}>
                        <PipelineStage {...stage} />
                        {index < stages.length - 1 && (
                            <div className="flex-shrink-0">
                                <AnimatedChevron />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite ease-in-out;
                }
            `}</style>
        </footer>
    );
}
