
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Smart features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getMaintenanceSuggestions = async (productName: string, problemDescription: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Unable to provide suggestions.";
  }
  
  const prompt = `I am a warehouse technician. A piece of equipment, a "${productName}", has an issue. The problem is: "${problemDescription}". Provide a concise, bulleted list of 3-5 practical troubleshooting steps I can take right now. Focus on common issues and safety. Do not add any introductory or concluding text, just the bullet points.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.5,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching maintenance suggestions:", error);
    return "Could not get suggestions from AI. Please check the connection and API key.";
  }
};
