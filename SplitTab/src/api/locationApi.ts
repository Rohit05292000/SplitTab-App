import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationSearchResult } from '../types';

const CACHE_KEY = 'location_search_cache';
const MAX_CACHE_SIZE = 5;
const DEBOUNCE_DELAY = 400;

interface LocationCache {
  query: string;
  results: LocationSearchResult[];
  timestamp: number;
}

let searchCache: LocationCache[] = [];
let abortController: AbortController | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Load cache from AsyncStorage on init
const loadCache = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      searchCache = JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error loading location cache:', error);
  }
};

const saveCache = async () => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(searchCache));
  } catch (error) {
    console.error('Error saving location cache:', error);
  }
};

loadCache();

export const searchLocation = (
  query: string,
  callback: (results: LocationSearchResult[]) => void
): void => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Cancel previous request
  if (abortController) {
    abortController.abort();
  }

  // Check cache
  const cached = searchCache.find(
    c => c.query.toLowerCase() === query.toLowerCase()
  );
  if (cached) {
    callback(cached.results);
    return;
  }

  // Debounce the search
  debounceTimer = setTimeout(async () => {
    abortController = new AbortController();

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=5`;

      const response = await axios.get(url, {
        signal: abortController.signal,
        headers: {
          'User-Agent': 'SplitTab-Assignment/YourName',
        },
      });

      const data = response.data;

      const results: LocationSearchResult[] = data.map((item: any) => ({
        displayName: item.display_name,
        lat: item.lat,
        lon: item.lon,
        placeId: item.place_id,
      }));

      // Add to cache
      searchCache.unshift({ query, results, timestamp: Date.now() });

      // Keep only last 5 searches
      if (searchCache.length > MAX_CACHE_SIZE) {
        searchCache = searchCache.slice(0, MAX_CACHE_SIZE);
      }

      saveCache();

      callback(results);
    } catch (error: any) {
      if (error.name !== 'CanceledError') {
        console.error('Location search error:', error);
        callback([]);
      }
    }
  }, DEBOUNCE_DELAY);
};

export const cancelSearch = (): void => {
  if (abortController) {
    abortController.abort();
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
};