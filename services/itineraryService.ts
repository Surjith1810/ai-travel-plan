import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { TripItinerary, TripInput } from '../types';

export interface SavedItinerary {
    id: string;
    userId: string;
    itinerary: TripItinerary;
    input: TripInput;
    createdAt: Timestamp;
    name?: string;
}

/**
 * Save an itinerary to Firestore
 */
export const saveItinerary = async (
    userId: string,
    itinerary: TripItinerary,
    input: TripInput,
    name?: string
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'itineraries'), {
            userId,
            itinerary,
            input,
            name: name || itinerary.tripTitle,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving itinerary:', error);
        throw error;
    }
};

/**
 * Get all itineraries for a user
 */
export const getUserItineraries = async (userId: string): Promise<SavedItinerary[]> => {
    try {
        const q = query(
            collection(db, 'itineraries'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SavedItinerary));
    } catch (error) {
        console.error('Error getting itineraries:', error);
        throw error;
    }
};

/**
 * Get a single itinerary by ID
 */
export const getItinerary = async (itineraryId: string): Promise<SavedItinerary | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'itineraries', itineraryId));
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as SavedItinerary;
        }
        return null;
    } catch (error) {
        console.error('Error getting itinerary:', error);
        throw error;
    }
};

/**
 * Delete an itinerary
 */
export const deleteItinerary = async (itineraryId: string, userId: string): Promise<void> => {
    try {
        // Verify ownership before deletion
        const itinerary = await getItinerary(itineraryId);
        if (!itinerary || itinerary.userId !== userId) {
            throw new Error('Unauthorized: Cannot delete this itinerary');
        }

        await deleteDoc(doc(db, 'itineraries', itineraryId));
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        throw error;
    }
};
