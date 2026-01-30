import React, { useState } from 'react';
import { TripItinerary, DayItinerary, Activity } from '../types';
import { Sun, Sunset, Moon, MapPin, Clock, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: TripItinerary;
  onReset: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onReset, onRegenerate, isRegenerating }) => {
  // Generate a seed based on destination to keep header image consistent but unique to the trip
  const headerSeed = itinerary.tripTitle.length + itinerary.destination.length;
  // Using flux model for header as well for high quality
  const headerImage = `https://image.pollinations.ai/prompt/scenic travel photography of ${encodeURIComponent(itinerary.destination)}?width=1200&height=600&nologo=true&seed=${headerSeed}&model=flux`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Trip Header */}
      <div className="relative h-72 md:h-96 rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-900/20 bg-slate-900 group">
        <img
          src={headerImage}
          alt={itinerary.destination}
          className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12 text-white">
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold tracking-wider uppercase mb-4">
            <span className="bg-indigo-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400 shadow-lg">{itinerary.duration} Days</span>
            <span className="bg-pink-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-400 shadow-lg">{itinerary.travelStyle} Pace</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-3 shadow-black drop-shadow-lg leading-tight tracking-tight">
            {itinerary.tripTitle}
          </h1>
          <div className="flex items-center gap-2 text-indigo-200">
            <MapPin className="h-5 w-5" />
            <span className="text-lg font-medium">{itinerary.destination}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4 border-b border-indigo-100 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Your Itinerary</h2>
          <p className="text-slate-500 mt-1">Ready for your adventure?</p>
        </div>
        <div className="flex gap-3">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
          <button
            onClick={onReset}
            className="group flex items-center justify-center gap-2 bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Plan Another Trip
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-20 pb-16">
        {itinerary.dailyPlan.map((day) => (
          <DayCard key={day.dayNumber} day={day} />
        ))}
      </div>
    </div>
  );
};

const DayCard: React.FC<{ day: DayItinerary }> = ({ day }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full">
      {/* Day Header - Centered & Clickable */}
      <div
        className="flex flex-col items-center text-center mb-10 relative cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent -z-10"></div>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold px-8 py-2 rounded-full shadow-lg shadow-indigo-500/30 mb-5 transform group-hover:scale-105 transition-transform flex items-center gap-2">
          Day {day.dayNumber}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 mb-3">{day.theme}</h3>
        <p className="text-slate-600 text-lg max-w-2xl leading-relaxed font-light">{day.description}</p>
      </div>

      {/* Activities Vertical Stack - Collapsible */}
      <div
        className={`space-y-8 max-w-4xl mx-auto px-2 transition-all duration-500 overflow-hidden ${isExpanded ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'
          }`}
      >
        {day.activities.map((activity, idx) => (
          <ActivityRow key={idx} activity={activity} />
        ))}
      </div>
    </div>
  );
};

const ActivityRow: React.FC<{ activity: Activity }> = ({ activity }) => {
  const getIcon = (time: string) => {
    switch (time) {
      case 'Morning': return <Sun className="h-4 w-4 text-amber-500" />;
      case 'Afternoon': return <Sunset className="h-4 w-4 text-orange-500" />;
      case 'Evening': return <Moon className="h-4 w-4 text-indigo-500" />;
      default: return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  // Calculate a stable seed based on the activity content
  const seed = activity.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + activity.description.length;

  // Construct the image URL
  const promptParts = [
    activity.title,
    activity.locationHint,
    activity.imagePrompt,
    "photorealistic, 4k, cinematic lighting, travel photography, vibrant colors"
  ].filter(Boolean).join(", ");

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptParts)}?width=800&height=500&nologo=true&seed=${seed}&model=flux`;

  return (
    <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row h-full">

        {/* Image Section - Left (Desktop) / Top (Mobile) */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={imageUrl}
            alt={activity.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>

          {/* Mobile Badge */}
          <div className="absolute bottom-4 left-4 md:hidden text-white font-bold text-lg drop-shadow-md">
            {activity.suggestedTime}
          </div>
        </div>

        {/* Details Section - Right */}
        <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative bg-white/80 backdrop-blur-sm">
          {/* Desktop Timing Badge */}
          <div className="hidden md:inline-flex items-center gap-2 bg-slate-50 w-fit px-4 py-1.5 rounded-full border border-slate-200 mb-4 shadow-sm group-hover:border-indigo-200 transition-colors">
            {getIcon(activity.timeOfDay)}
            <span className="font-bold text-slate-700 text-sm">{activity.suggestedTime}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 text-sm font-medium">{activity.timeOfDay}</span>
          </div>

          <h4 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
            {activity.title}
          </h4>

          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            {activity.description}
          </p>

          {activity.locationHint && (
            <div className="flex items-center text-sm text-slate-500 font-medium mt-auto">
              <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
              {activity.locationHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItineraryDisplay;