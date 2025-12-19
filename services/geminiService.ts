
import { GoogleGenAI, Type } from "@google/genai";
import { BabyName, SearchMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeAndGenerateNames = async (
  query: string,
  mode: SearchMode,
  surname?: string
): Promise<BabyName[]> => {
  const model = 'gemini-3-flash-preview';
  
  const historicalInstruction = `
    ACT AS A HISTORICAL BABY NAMES DATABASE ANALYST (1980-2024).
    The user is looking for real names that were popular or trended in the 1980-2024 era.
    Match the style/preference: "${query}".
    Provide 10 accurate matches based on historical US and global name data for those decades.
  `;

  const aiInstruction = `
    ACT AS A CREATIVE AI NAME GENERATOR.
    The user wants newly generated, unique, or creative modern names.
    Focus on unique, modern, and high-compatibility names that go beyond standard historical databases.
    Match the style: "${query}".
  `;

  const systemInstruction = `
    You are the "Babygo AI" engine. 
    ${mode === 'historical' ? historicalInstruction : aiInstruction}
    ${surname ? `Surname context: "${surname}"` : ''}
    
    Return a list of exactly 10 names.
    
    For each name, provide:
    - name: The name string.
    - origin: Country/Culture of origin.
    - meaning: Brief meaning.
    - phoneticScore: A score from 0-100 based on how well it flows ${surname ? `with "${surname}"` : 'harmoniously'}.
    - popularityEra: Specific era/year range (e.g. 'Mid 90s', 'Early 2010s', 'AI Gen').
    - culturalSignificance: Short note on its cultural importance.
    - gender: 'boy', 'girl', or 'unisex'.
    - historicalTrend: 'rising', 'falling', or 'stable'.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Perform scientific analysis and selection for: ${query}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              origin: { type: Type.STRING },
              meaning: { type: Type.STRING },
              phoneticScore: { type: Type.NUMBER },
              popularityEra: { type: Type.STRING },
              culturalSignificance: { type: Type.STRING },
              gender: { type: Type.STRING },
              historicalTrend: { type: Type.STRING }
            },
            required: ["name", "origin", "meaning", "phoneticScore", "popularityEra", "gender", "historicalTrend"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error analyzing names:", error);
    return [];
  }
};
