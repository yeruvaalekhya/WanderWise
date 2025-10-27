import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { TravelGuide } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const travelSchema = {
  type: Type.OBJECT,
  properties: {
    placesToVisit: {
      type: Type.ARRAY,
      description: "Tourist attractions, historical sites, adventure spots.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          address: { type: Type.STRING },
        },
        required: ["name", "description"]
      },
    },
    hotels: {
      type: Type.ARRAY,
      description: "Nearby hotels with ratings and prices.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          priceRange: { type: Type.STRING },
          address: { type: Type.STRING },
        },
        required: ["name", "description", "rating", "priceRange"]
      },
    },
    restaurants: {
      type: Type.ARRAY,
      description: "Restaurants and cafés, categorized by cuisine and budget.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          budget: { type: Type.STRING },
          address: { type: Type.STRING },
        },
        required: ["name", "description", "cuisine", "budget"]
      },
    },
    treks: {
      type: Type.ARRAY,
      description: "Trekking and adventure places.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          distance: { type: Type.STRING },
          safetyInfo: { type: Type.STRING },
          address: { type: Type.STRING },
        },
        required: ["name", "description", "difficulty", "distance", "safetyInfo"]
      },
    },
    shoppingMalls: {
      type: Type.ARRAY,
      description: "Malls and shopping areas.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          openingHours: { type: Type.STRING },
          transportInfo: { type: Type.STRING },
          address: { type: Type.STRING },
        },
        required: ["name", "description", "openingHours", "transportInfo"]
      },
    },
  },
};

// FIX: Removed googleMaps tool to comply with API guidelines that prohibit its use with `responseMimeType: "application/json"` and `responseSchema`. The UI requires structured JSON, so this is prioritized. User location is now added to the prompt for "nearby" searches.
export const getTravelRecommendations = async (destination: string, userLocation?: { latitude: number; longitude: number; }): Promise<TravelGuide> => {
  try {
    let prompt = `You are WanderWise, an expert travel assistant. Provide a comprehensive travel guide for a user visiting "${destination}". If the query is about "nearby", use the user's current location as the primary reference. The guide should include the best places to visit, hotels, restaurants, trekking spots, and shopping areas. Return the information in a structured JSON format.`;
    
    if (userLocation) {
      prompt += ` The user's current location is latitude ${userLocation.latitude} and longitude ${userLocation.longitude}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as TravelGuide;
  } catch (error) {
    console.error("Error fetching travel recommendations:", error);
    throw new Error("Failed to fetch travel recommendations from Gemini.");
  }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image with Gemini.");
  }
};