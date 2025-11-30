import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ImageStyle, AspectRatio } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY environment variable not set. Gemini API calls will fail.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || 'mock_api_key' });

export const generateImage = async (
  prompt: string,
  style: ImageStyle,
  aspectRatio: AspectRatio,
): Promise<string> => {
  console.log(`Generating image with prompt: "${prompt}", style: ${style}, aspect ratio: ${aspectRatio}`);

  try {
    const fullPrompt = `${prompt}, in the style of ${style}.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [fullPrompt],
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates in response");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data in response");

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
};

export const magicEdit = async (
  base64ImageData: string,
  prompt: string
): Promise<string> => {
    console.log(`Applying magic edit with prompt: "${prompt}"`);

  try {
      const base64Data = base64ImageData.includes(',')
        ? base64ImageData.split(',')[1]
        : base64ImageData;

      const mimeType = base64ImageData.startsWith('data:image/png')
        ? 'image/png'
        : base64ImageData.startsWith('data:image/jpeg') || base64ImageData.startsWith('data:image/jpg')
        ? 'image/jpeg'
        : 'image/png';

      const imagePart = {
          inlineData: {
              data: base64Data,
              mimeType: mimeType,
          },
      };

      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [imagePart, `Edit this image: ${prompt}`],
      });

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates in response");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:image/png;base64,${base64ImageBytes}`;
        }
      }
      throw new Error("No image data in response");

  } catch (error) {
      console.error("Error with magic edit:", error);
      throw error;
  }
};

export const upscaleImage = async (base64ImageData: string): Promise<string> => {
    console.log("Upscaling image");

    try {
        const base64Data = base64ImageData.includes(',')
          ? base64ImageData.split(',')[1]
          : base64ImageData;

        const mimeType = base64ImageData.startsWith('data:image/png')
          ? 'image/png'
          : base64ImageData.startsWith('data:image/jpeg') || base64ImageData.startsWith('data:image/jpg')
          ? 'image/jpeg'
          : 'image/png';

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [imagePart, "Upscale this image, enhance details, increase resolution, make it high quality."],
        });

        if (!response.candidates || response.candidates.length === 0) {
          throw new Error("No candidates in response");
        }

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
          }
        }
        throw new Error("No image data in response");

    } catch (error) {
        console.error("Error upscaling image:", error);
        throw error;
    }
};

export const removeBackground = async (base64ImageData: string): Promise<string> => {
    console.log("Removing background");
    try {
        const base64Data = base64ImageData.includes(',')
          ? base64ImageData.split(',')[1]
          : base64ImageData;

        const mimeType = base64ImageData.startsWith('data:image/png')
          ? 'image/png'
          : base64ImageData.startsWith('data:image/jpeg') || base64ImageData.startsWith('data:image/jpg')
          ? 'image/jpeg'
          : 'image/png';

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [imagePart, "Remove the background of this image. The subject should remain, and the background should be transparent."],
        });

        if (!response.candidates || response.candidates.length === 0) {
          throw new Error("No candidates in response");
        }

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
          }
        }
        throw new Error("No image data in response");

    } catch (error) {
        console.error("Error removing background:", error);
        throw error;
    }
};
