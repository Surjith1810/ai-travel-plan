import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoginPage from './components/LoginPage';
import Logo from './components/Logo';
import { TripInput, TripItinerary } from './types';
import { generateItinerary } from './services/geminiService';
import { Sparkles, AlertCircle, LogOut } from 'lucide-react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './services/firebase';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // handled by onAuthStateChanged
  };

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setItinerary(null);
      setError(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleTripSubmit = async (input: TripInput) => {
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const result = await generateItinerary(input);
      setItinerary(result);
    } catch (err) {
      console.error(err);
      setError("We couldn't generate your trip plan. Please verify your API Key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  // If not authenticated, show Login Page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Authenticated Application
  return (
    <div className="min-h-screen">
      {/* Navbar - Glassmorphism */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30 shadow-sm animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Logo className="h-10 w-10" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                TripAI<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Planner</span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        {/* Background decorative elements */}
        {!itinerary && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
            <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-4 shadow-lg shadow-red-500/10">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Planning Error</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {!itinerary ? (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center min-h-[80vh] lg:min-h-[70vh]">

            {/* Left Column: Hero Text */}
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-sm font-semibold shadow-sm backdrop-blur-md animate-fade-in-up">
                <Sparkles className="h-4 w-4" />
                <span>Powered by Gemini 2.5</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] animate-fade-in-up delay-100">
                Your next adventure, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  planned instantly.
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-light animate-fade-in-up delay-200">
                Stop spending hours researching. Tell us where you want to go, and our AI will build a personalized, day-by-day itinerary just for you.
              </p>

              {/* Feature grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left animate-fade-in-up delay-300">
                {[
                  { label: 'Instant', desc: 'Detailed plans in seconds', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                  { label: 'Personalized', desc: 'Tailored to your pace', color: 'bg-purple-50 text-purple-700 border-purple-100' },
                  { label: 'Free', desc: 'No signup required', color: 'bg-pink-50 text-pink-700 border-pink-100' }
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${item.color.replace('text-', 'border-opacity-50 ')} bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-300`}>
                    <div className={`font-bold text-lg mb-1 ${item.color.split(' ')[1]}`}>{item.label}</div>
                    <div className="text-sm text-slate-600 leading-tight">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 w-full max-w-md animate-fade-in-up delay-500">
              <TripForm onSubmit={handleTripSubmit} isLoading={loading} />
            </div>

          </div>
        ) : (
          <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/40 backdrop-blur-md py-8 mt-auto animate-fade-in-up delay-500">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} Trip AI Planner. Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">Google Gemini</span>.
        </div>
      </footer>
    </div>
  );
};

export default App;