import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserItineraries, deleteItinerary, SavedItinerary } from '../services/itineraryService';
import Logo from '../components/Logo';
import { MapPin, Calendar, Trash2, Eye, Loader2, ArrowLeft, Compass } from 'lucide-react';

const SavedTrips: React.FC = () => {
    const [trips, setTrips] = useState<SavedItinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            if (!user) return;

            try {
                const userTrips = await getUserItineraries(user.uid);
                setTrips(userTrips);
            } catch (err) {
                console.error('Error fetching trips:', err);
                setError('Failed to load saved trips. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [user]);

    const handleDelete = async (tripId: string) => {
        if (!user || !window.confirm('Are you sure you want to delete this trip?')) return;

        setDeleting(tripId);
        try {
            await deleteItinerary(tripId, user.uid);
            setTrips(trips.filter(t => t.id !== tripId));
        } catch (err) {
            console.error('Error deleting trip:', err);
            alert('Failed to delete trip. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const handleView = (trip: SavedItinerary) => {
        navigate('/', { state: { viewItinerary: trip } });
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Unknown date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Navbar */}
            <nav className="bg-white/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="transform group-hover:scale-110 transition-transform duration-300">
                                <Logo className="h-10 w-10" />
                            </div>
                            <span className="font-bold text-xl text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                TripAI<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Planner</span>
                            </span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Planner
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Your Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Adventures</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        View and manage your saved trip itineraries
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-20">
                        <Compass className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-700 mb-3">No saved trips yet</h2>
                        <p className="text-slate-500 mb-6">
                            Start planning your next adventure and save it for later!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
                        >
                            Plan a Trip
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <div
                                key={trip.id}
                                className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group"
                            >
                                {/* Trip Image */}
                                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                                    <img
                                        src={`https://image.pollinations.ai/prompt/scenic travel photography of ${encodeURIComponent(trip.itinerary.destination)}?width=600&height=400&nologo=true&seed=${trip.itinerary.tripTitle.length}&model=flux`}
                                        alt={trip.itinerary.destination}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white truncate">
                                            {trip.itinerary.tripTitle}
                                        </h3>
                                    </div>
                                </div>

                                {/* Trip Info */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                                        <MapPin className="h-4 w-4 text-indigo-500" />
                                        <span className="text-sm font-medium">{trip.itinerary.destination}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>{trip.itinerary.duration} days • {trip.itinerary.travelStyle}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mb-4">
                                        Saved on {formatDate(trip.createdAt)}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(trip)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-4 rounded-xl font-medium transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trip.id)}
                                            disabled={deleting === trip.id}
                                            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl font-medium transition-colors disabled:opacity-50"
                                        >
                                            {deleting === trip.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedTrips;
