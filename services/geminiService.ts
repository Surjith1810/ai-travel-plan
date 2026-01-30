import { GoogleGenAI, Type } from "@google/genai";
import { TripInput, TripItinerary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (input: TripInput): Promise<TripItinerary> => {
  const prompt = `
    Create a detailed ${input.days}-day trip itinerary for ${input.destination} with a ${input.style} pace.
    
    The itinerary should be realistic, grouping nearby activities to minimize travel time. 
    Each day should have a specific theme.
    Divide each day into Morning, Afternoon, and Evening activities.
    Provide specific practical times.
    
    For each activity, provide a short "imagePrompt" (2-5 words) that describes the scene visually (e.g., "Eiffel Tower sunny day", "Eating sushi in Tokyo", "Central Park autumn path").
    
    Return pure JSON matching the specified schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tripTitle: { type: Type.STRING, description: "A catchy title for the trip" },
          destination: { type: Type.STRING },
          duration: { type: Type.INTEGER },
          travelStyle: { type: Type.STRING },
          dailyPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                theme: { type: Type.STRING, description: "Main theme of the day, e.g., 'Art & History'" },
                description: { type: Type.STRING, description: "A brief 1-sentence summary of the day's vibe" },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeOfDay: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
                      title: { type: Type.STRING, description: "Name of the activity or place" },
                      description: { type: Type.STRING, description: "2-3 sentences describing what to do there" },
                      suggestedTime: { type: Type.STRING, description: "Suggested start time, e.g. 9:00 AM" },
                      locationHint: { type: Type.STRING, description: "Neighborhood or area name" },
                      imagePrompt: { type: Type.STRING, description: "Visual keyword phrase for the activity image" }
                    },
                    required: ["timeOfDay", "title", "description", "suggestedTime", "imagePrompt"]
                  }
                }
              },
              required: ["dayNumber", "theme", "description", "activities"]
            }
          }
        },
        required: ["tripTitle", "destination", "duration", "travelStyle", "dailyPlan"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response received from Gemini.");
  }

  try {
    const data = JSON.parse(response.text) as TripItinerary;
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate a valid itinerary format.");
  }
};