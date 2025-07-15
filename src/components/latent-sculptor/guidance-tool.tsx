'use client';
import { useState } from 'react';
import { Lightbulb, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getParameterGuidance, ParameterGuidanceOutput } from '@/ai/flows/parameter-guidance';
import type { Node } from './types';

interface GuidanceToolProps {
  nodes: Node[];
  updateNodeValue: (nodeId: string, value: any) => void;
}

export function GuidanceTool({ nodes, updateNodeValue }: GuidanceToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ParameterGuidanceOutput['suggestions']>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetGuidance = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const textPromptNode = nodes.find(node => node.type === 'text-prompt');
    if (!textPromptNode) {
      setError("Please add a text prompt to get guidance.");
      setIsLoading(false);
      return;
    }

    try {
      const input = {
        canvasState: JSON.stringify(nodes),
        userPrompt: textPromptNode.value,
      };
      const result = await getParameterGuidance(input);
      if (result.suggestions) {
        setSuggestions(result.suggestions);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to get suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: ParameterGuidanceOutput['suggestions'][0]) => {
    const targetNode = nodes.find(n => n.name === suggestion.nodeName);
    if (targetNode) {
      updateNodeValue(targetNode.id, suggestion.suggestedValue);
      setSuggestions(currentSuggestions => currentSuggestions.filter(s => s !== suggestion));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Lightbulb className="text-accent" />
        Parameter Guidance
      </h3>
      <Button onClick={handleGetGuidance} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Suggestions...
          </>
        ) : (
          'Get AI Suggestions'
        )}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {suggestions.length > 0 && (
        <div className="space-y-3">
            <h4 className="text-sm font-medium">Recommendations:</h4>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="bg-background/50">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Adjust '{suggestion.parameter}'</CardTitle>
                <CardDescription>on node '{suggestion.nodeName}'</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleAcceptSuggestion(suggestion)}>
                  <Check className="mr-2 h-4 w-4" />
                  Accept (Set to {String(suggestion.suggestedValue)})
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
