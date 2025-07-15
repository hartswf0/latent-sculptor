'use server';
/**
 * @fileOverview A flow to generate an image based on a node graph.
 *
 * - generateImage - A function that takes the current state of the node canvas and returns a generated image.
 * - ImageGenerationInput - The input type for the generateImage function.
 * - ImageGenerationOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  value: z.any(),
  width: z.number().optional(),
  height: z.number().optional(),
  nodes: z.array(z.lazy(() => NodeSchema)).optional(),
});

const ImageGenerationInputSchema = z.object({
  nodes: z.array(NodeSchema),
  step: z.number().optional(),
  lastResult: z.any().optional(),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

const ImageGenerationOutputSchema = z.object({
  inputImage: z.string().describe("The input image as a data URI. This could be a camera capture or a generated noise pattern. Expected format: 'data:image/png;base64,<encoded_data>'.").optional(),
  pixelManipulationsImage: z.string().describe("An image representing the pixel manipulations stage. Expected format: 'data:image/png;base64,<encoded_data>'.").optional(),
  generativeModelInputImage: z.string().describe("An image representing the input to the generative model. Expected format: 'data:image/png;base64,<encoded_data>'.").optional(),
  finalImage: z.string().describe("The final generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'.").optional(),
});
export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;


export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  return imageGenerationFlow(input);
}

const generateImageWithPrompt = async (prompt: string, inputImage?: string): Promise<string> => {
    const promptConfig: any = {
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: { responseModalities: ['TEXT', 'IMAGE'] },
      prompt: []
    };
  
    if (inputImage) {
        promptConfig.prompt.push({ media: { url: inputImage } });
    }
    promptConfig.prompt.push({ text: prompt });

    const { media } = await ai.generate(promptConfig);
    if (!media?.url) {
      throw new Error('Image generation failed.');
    }
    return media.url;
  };

const imageGenerationFlow = ai.defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: z.any(),
  },
  async ({ nodes, step, lastResult }) => {
    const newResult = {...lastResult};

    if (step === 1) { // Generate Input Image
        const cameraNode = nodes.find(n => n.type === 'camera-input' && n.value);
        if (cameraNode) {
            newResult.inputImage = cameraNode.value;
        } else {
            newResult.inputImage = await generateImageWithPrompt("abstract gray and white noise pattern, 50% gray");
        }
    }

    if (step === 2) { // Apply Pixel Manipulations
        const pixelNodes = nodes.filter(n => ['pixel-noise', 'pixel-brightness', 'pixel-color'].includes(n.type));
        let pixelPromptParts: string[] = ["Apply the following manipulations to the image:"];
        if (pixelNodes.length > 0) {
            pixelNodes.forEach(node => {
                switch (node.type) {
                    case 'pixel-noise':
                        pixelPromptParts.push(`apply ${node.value}% pixel noise.`);
                        break;
                    case 'pixel-brightness':
                        pixelPromptParts.push(`adjust brightness by ${node.value}%.`);
                        break;
                    case 'pixel-color':
                        pixelPromptParts.push(`add a color tint of (${node.value.r}, ${node.value.g}, ${node.value.b}).`);
                        break;
                }
            });
        } else {
            pixelPromptParts.push("no manipulations, return the original image.");
        }
        const pixelManipulationsImage = await generateImageWithPrompt(pixelPromptParts.join(' '), newResult.inputImage);
        newResult.pixelManipulationsImage = pixelManipulationsImage;
        newResult.generativeModelInputImage = pixelManipulationsImage;
    }

    if (step === 3) { // Generate Final Image
        const finalPromptNodes = nodes.filter(n => ['text-prompt', 'setting-diffusion', 'setting-seed', 'meta-node'].includes(n.type));
        
        let finalPromptParts: string[] = [];
        if (finalPromptNodes.length === 0) {
            finalPromptParts.push("A stunningly beautiful mushroom, glowing with bioluminescence in a dark forest, cinematic, hyperrealistic.");
        } else {
            finalPromptNodes.forEach(node => {
                switch(node.type) {
                    case 'text-prompt':
                        if (node.value) finalPromptParts.push(`The main subject is: "${node.value}".`);
                        break;
                    case 'setting-diffusion':
                        finalPromptParts.push(`Use a diffusion strength of ${node.value}%.`);
                        break;
                    case 'setting-seed':
                        finalPromptParts.push(`Use a generation seed of ${node.value}.`);
                        break;
                     case 'meta-node':
                        finalPromptParts.push(`This is part of a group called "${node.name}".`);
                        break;
                }
            });
        }
        const finalImage = await generateImageWithPrompt(finalPromptParts.join(' '), newResult.generativeModelInputImage);
        newResult.finalImage = finalImage;
    }

    return newResult;
  }
);
