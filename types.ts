export enum TravelStyle {
  RELAXED = 'Relaxed',
  MODERATE = 'Moderate',
  ADVENTUROUS = 'Adventurous',
}

export interface TripInput {
  destination: string;
  days: number;
  style: TravelStyle;
}

export interface Activity {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  suggestedTime: string; // e.g., "9:00 AM"
  locationHint?: string;
  imagePrompt: string; // Short keyword description for image generation
}

export interface DayItinerary {
  dayNumber: number;
  theme: string; // e.g., "Cultural Deep Dive"
  description: string; // Short summary of the day
  activities: Activity[];
}

export interface TripItinerary {
  tripTitle: string; // e.g., "3 Days in Paris"
  destination: string;
  duration: number;
  travelStyle: string;
  dailyPlan: DayItinerary[];
}