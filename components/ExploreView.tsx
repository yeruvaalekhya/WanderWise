import React, { useState, useCallback } from 'react';
import { getTravelRecommendations } from '../services/geminiService';
import type { TravelGuide, Recommendation } from '../types';
import { Hotel, Restaurant, Trek, Shopping, Place } from '../types';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { MapPinIcon } from './icons/MapPinIcon';
import { HotelIcon } from './icons/HotelIcon';
import { RestaurantIcon } from './icons/RestaurantIcon';
import { TrekkingIcon } from './icons/TrekkingIcon';
import { ShoppingIcon } from './icons/ShoppingIcon';
import useGeolocation from '../hooks/useGeolocation';


const isHotel = (item: Recommendation): item is Hotel => 'rating' in item;
const isRestaurant = (item: Recommendation): item is Restaurant => 'cuisine' in item;
// FIX: Corrected the syntax for the type guard function parameter.
const isTrek = (item: Recommendation): item is Trek => 'difficulty' in item;
const isShopping = (item: Recommendation): item is Shopping => 'openingHours' in item;

const RecommendationCard: React.FC<{ item: Recommendation }> = ({ item }) => {
    const renderCardContent = () => {
        if (isHotel(item)) {
            return <>
                <p className="text-sm text-yellow-500">{'⭐'.repeat(Math.round(item.rating))} ({item.rating})</p>
                <p className="text-sm text-gray-500">{item.priceRange}</p>
            </>;
        }
        if (isRestaurant(item)) {
            return <>
                <p className="text-sm text-gray-500"><span className="font-semibold">Cuisine:</span> {item.cuisine}</p>
                <p className="text-sm text-gray-500"><span className="font-semibold">Budget:</span> {item.budget}</p>
            </>;
        }
        if (isTrek(item)) {
            return <>
                <p className="text-sm text-gray-500"><span className="font-semibold">Difficulty:</span> {item.difficulty}</p>
                <p className="text-sm text-gray-500"><span className="font-semibold">Distance:</span> {item.distance}</p>
                <p className="text-xs text-red-500 mt-2"><span className="font-semibold">Safety:</span> {item.safetyInfo}</p>
            </>;
        }
        if (isShopping(item)) {
            return <>
                <p className="text-sm text-gray-500"><span className="font-semibold">Hours:</span> {item.openingHours}</p>
                <p className="text-sm text-gray-500 mt-1"><span className="font-semibold">Transport:</span> {item.transportInfo}</p>
            </>;
        }
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200">
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-2 mb-3">{item.description}</p>
                {renderCardContent()}
                {item.address && <p className="text-xs text-gray-400 mt-3">{item.address}</p>}
            </div>
        </div>
    );
};


const ExploreView: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<TravelGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { coordinates, error: geoError } = useGeolocation();

  const handleSearch = useCallback(async () => {
    if (!destination.trim()) {
      setError('Please enter a destination.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const isNearbyQuery = destination.toLowerCase().includes('nearby');
      const location = isNearbyQuery ? coordinates : undefined;
      if (isNearbyQuery && !coordinates) {
        throw new Error(geoError ? geoError.message : "Could not get your location for a 'nearby' search. Please enable location services.");
      }
      const data = await getTravelRecommendations(destination, location ?? undefined);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [destination, coordinates, geoError]);

  const renderSection = (title: string, items: Recommendation[] | undefined, icon: React.ReactNode) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => <RecommendationCard key={`${title}-${index}`} item={item} />)}
        </div>
      </section>
    );
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight sm:text-5xl">Discover Your Next Adventure</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Enter a destination or ask for places "nearby" to get AI-powered travel recommendations.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-4 rounded-full shadow-lg flex items-center gap-2">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g., 'Best beaches in Bali' or 'Restaurants nearby'"
          className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none px-4 py-2"
          disabled={loading}
        />
        <Button onClick={handleSearch} disabled={loading} className="shrink-0">
          {loading ? <Spinner /> : 'Search'}
        </Button>
      </div>
      
      {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md max-w-2xl mx-auto">{error}</p>}

      <div className="mt-8">
        {loading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}
        
        {results && (
          <div className="space-y-8">
            {renderSection('Places to Visit', results.placesToVisit, <MapPinIcon className="w-8 h-8 text-blue-500" />)}
            {renderSection('Hotels', results.hotels, <HotelIcon className="w-8 h-8 text-indigo-500" />)}
            {renderSection('Restaurants & Cafés', results.restaurants, <RestaurantIcon className="w-8 h-8 text-amber-500" />)}
            {renderSection('Trekking & Adventure', results.treks, <TrekkingIcon className="w-8 h-8 text-green-500" />)}
            {renderSection('Shopping Areas', results.shoppingMalls, <ShoppingIcon className="w-8 h-8 text-pink-500" />)}
          </div>
        )}

        {!loading && !results && !error && (
           <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Let's find something amazing</h3>
            <p className="mt-1 text-sm text-gray-500">Your travel recommendations will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreView;