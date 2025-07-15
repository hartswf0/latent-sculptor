'use client';
import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AnimatedChevron = ({ className }: { className?: string }) => (
    <ChevronRight className={cn("text-muted-foreground/50 animate-pulse-slow", className)} size={24} />
);

const PipelineStage = ({ title, imageUrl, hint, isFinal = false }: { title: string, imageUrl: string, hint: string, isFinal?: boolean }) => (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <Card className={cn("w-32 h-20 md:w-48 md:h-32 overflow-hidden", isFinal && "border-accent shadow-lg shadow-accent/20")}>
            <CardContent className="p-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={192}
                    height={128}
                    className="object-cover w-full h-full"
                    data-ai-hint={hint}
                />
            </CardContent>
        </Card>
    </div>
);

export function PipelineVisualizer() {
    const stages = [
        { title: 'Input Image', imageUrl: 'https://placehold.co/192x128.png', hint: 'abstract pattern' },
        { title: 'Pixel Manipulations', imageUrl: 'https://placehold.co/192x128.png', hint: 'glitch art' },
        { title: 'Generative Model Input', imageUrl: 'https://placehold.co/192x128.png', hint: 'noisy image' },
        { title: 'Final Output', imageUrl: 'https://placehold.co/192x128.png', hint: 'futuristic city', isFinal: true },
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
