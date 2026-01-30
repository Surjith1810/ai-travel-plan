import React, { useState } from 'react';
import { TripInput, TravelStyle } from '../types';
import { MapPin, Calendar, Compass, Loader2 } from 'lucide-react';

interface TripFormProps {
  onSubmit: (input: TripInput) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number>(3);
  const [style, setStyle] = useState<TravelStyle>(TravelStyle.MODERATE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSubmit({ destination, days, style });
    }
  };

  const getStyleClasses = (s: TravelStyle) => {
    const base = "flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all duration-200";
    if (style !== s) {
        return `${base} bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:text-slate-700`;
    }
    
    // Colorful active states
    switch (s) {
        case TravelStyle.RELAXED:
            return `${base} bg-teal-500 border-teal-600 text-white ring-2 ring-teal-200 shadow-lg shadow-teal-500/30 transform scale-[1.02]`;
        case TravelStyle.MODERATE:
            return `${base} bg-indigo-500 border-indigo-600 text-white ring-2 ring-indigo-200 shadow-lg shadow-indigo-500/30 transform scale-[1.02]`;
        case TravelStyle.ADVENTUROUS:
            return `${base} bg-orange-500 border-orange-600 text-white ring-2 ring-orange-200 shadow-lg shadow-orange-500/30 transform scale-[1.02]`;
        default:
            return base;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-900/10 p-8 border border-white/50 sticky top-24 z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Plan Your Trip</h2>
        <p className="text-slate-500 text-sm mt-1">Get a custom itinerary in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <div className="space-y-2">
          <label htmlFor="destination" className="block text-sm font-medium text-slate-700">
            Where to?
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              id="destination"
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50 focus:bg-white shadow-sm"
              placeholder="Paris, Tokyo, New York..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label htmlFor="days" className="block text-sm font-medium text-slate-700">
            How long? (Days)
          </label>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="number"
              id="days"
              min="1"
              max="14"
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50 focus:bg-white shadow-sm"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-slate-400 text-right">Max 14 days for demo</p>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Travel Style</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(TravelStyle).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                disabled={isLoading}
                className={getStyleClasses(s)}
              >
                {/* Icons based on style */}
                {s === TravelStyle.RELAXED && <span className="text-2xl mb-1">☕️</span>}
                {s === TravelStyle.MODERATE && <span className="text-2xl mb-1">📷</span>}
                {s === TravelStyle.ADVENTUROUS && <span className="text-2xl mb-1">🧗</span>}
                <span className="text-xs font-semibold">{s}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !destination}
          className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Planning Trip...
            </>
          ) : (
            <>
              Generate Itinerary
              <Compass className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;