import { GoogleGenAI, Modality, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiModel = (modelName: string = "gemini-3-flash-preview") => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export interface Plan {
  provider: string;
  speed: string;
  speedMbps: number;
  price: string;
  priceValue: number;
  technology: string;
  type: 'residencial' | 'empresarial';
  benefits: string[];
}

export const searchInternetPlans = async (location: string = "Pelotas, RS") => {
  const ai = getGeminiModel("gemini-3-flash-preview");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Pesquise os melhores planos de internet residencial e empresarial disponíveis em ${location}. 
    Retorne uma lista estruturada com o nome do provedor, velocidade (ex: "500 Mega"), velocidade em Mbps (número), preço mensal (ex: "R$ 99,90"), valor numérico do preço, tecnologia (fibra, rádio, etc), tipo (residencial ou empresarial) e principais benefícios.
    Foque em provedores locais e nacionais que atuam na região.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            provider: { type: Type.STRING },
            speed: { type: Type.STRING },
            speedMbps: { type: Type.NUMBER },
            price: { type: Type.STRING },
            priceValue: { type: Type.NUMBER },
            technology: { type: Type.STRING },
            type: { 
              type: Type.STRING,
              enum: ["residencial", "empresarial"]
            },
            benefits: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["provider", "speed", "speedMbps", "price", "priceValue", "technology", "type", "benefits"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]") as Plan[];
  } catch (e) {
    console.error("Failed to parse plans", e);
    return [];
  }
};

export const getProviderLocations = async (location: string = "Pelotas, RS") => {
  const ai = getGeminiModel("gemini-2.5-flash");
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Encontre lojas físicas ou pontos de atendimento de provedores de internet em ${location}.`,
    config: {
      tools: [{ googleMaps: {} }]
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const generateVeoVideo = async (prompt: string, imageBase64?: string) => {
  const ai = getGeminiModel("veo-3.1-fast-generate-preview");
  
  // Note: Veo requires user-provided API key usually, but we'll follow the standard pattern
  // The platform handles the key selection if we trigger the right UI, 
  // but for this implementation we'll assume the key is available or will be prompted.
  
  const config: any = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio: '16:9'
  };

  const payload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: config
  };

  if (imageBase64) {
    payload.image = {
      imageBytes: imageBase64.split(',')[1],
      mimeType: 'image/png'
    };
  }

  let operation = await ai.models.generateVideos(payload);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  return operation.response?.generatedVideos?.[0]?.video?.uri;
};
