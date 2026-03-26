import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency, CurrencyRate } from '../types';

const CACHE_KEY = 'currency_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedRates {
  data: CurrencyRate;
  timestamp: number;
}

export const fetchCurrencyRates = async (
  baseCurrency: Currency = 'USD'
): Promise<CurrencyRate> => {
  // Check cache first
  const cached = await getCachedRates();
  if (cached && cached.data.base === baseCurrency) {
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_DURATION) {
      return cached.data;
    }
  }

  try {
    const response = await axios.get(
      `https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`
    );

    const data = response.data;

    const rates: CurrencyRate = {
      base: baseCurrency,
      rates: {
        INR: data.rates.INR || 1,
        USD: data.rates.USD || 1,
        EUR: data.rates.EUR || 1,
      },
      timestamp: new Date().toISOString(),
    };

    // Cache the rates
    await setCachedRates(rates);

    return rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);

    // Return cached rates if available, even if old
    if (cached) {
      return cached.data;
    }

    // Fallback to default rates
    return {
      base: baseCurrency,
      rates: {
        INR: 83.0,
        USD: 1.0,
        EUR: 0.92,
      },
      timestamp: new Date().toISOString(),
    };
  }
};

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: CurrencyRate | null
): number => {
  if (!rates || fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to base currency first, then to target currency
  const baseAmount =
    fromCurrency === rates.base
      ? amount
      : amount / (rates.rates[fromCurrency] || 1);

  const converted =
    toCurrency === rates.base
      ? baseAmount
      : baseAmount * (rates.rates[toCurrency] || 1);

  return Math.round(converted * 100) / 100;
};

const getCachedRates = async (): Promise<CachedRates | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error reading cached rates:', error);
  }
  return null;
};

const setCachedRates = async (rates: CurrencyRate): Promise<void> => {
  try {
    const cacheData: CachedRates = {
      data: rates,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching rates:', error);
  }
};

export const isCacheOld = async (): Promise<boolean> => {
  const cached = await getCachedRates();
  if (!cached) return true;
  return Date.now() - cached.timestamp > CACHE_DURATION;
};