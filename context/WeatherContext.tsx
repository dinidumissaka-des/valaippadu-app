'use client';
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { WeatherData, ForecastDay } from '../services/cssCalculator';
import { fetchCurrentWeather, fetchForecast } from '../services/api';
import { Lang } from '../constants/strings';

interface WeatherState {
  current:     WeatherData | null;
  forecast:    ForecastDay[];
  loading:     boolean;
  refreshing:  boolean;
  error:       string | null;
  lang:        Lang;
  lastUpdated: Date | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'REFRESH_START' }
  | { type: 'FETCH_SUCCESS'; current: WeatherData; forecast: ForecastDay[] }
  | { type: 'FETCH_ERROR';   error: string }
  | { type: 'SET_LANG';      lang: Lang }
  | { type: 'CLEAR_NOTE' };

const initial: WeatherState = {
  current:     null,
  forecast:    [],
  loading:     true,
  refreshing:  false,
  error:       null,
  lang:        'ta',
  lastUpdated: null,
};

function reducer(state: WeatherState, action: Action): WeatherState {
  switch (action.type) {
    case 'FETCH_START':   return { ...state, loading: true,  error: null };
    case 'REFRESH_START': return { ...state, refreshing: true, error: null };
    case 'FETCH_SUCCESS': return {
      ...state,
      current:     action.current,
      forecast:    action.forecast,
      loading:     false,
      refreshing:  false,
      error:       null,
      lastUpdated: new Date(),
    };
    case 'FETCH_ERROR':   return { ...state, loading: false, refreshing: false, error: action.error };
    case 'SET_LANG':      return { ...state, lang: action.lang };
    case 'CLEAR_NOTE':    return {
      ...state,
      current: state.current ? { ...state.current, coordinator_note: null } : null,
    };
    default: return state;
  }
}

interface WeatherContextValue extends WeatherState {
  refresh:   () => Promise<void>;
  refetch:   () => Promise<void>;
  setLang:   (lang: Lang) => void;
  clearNote: () => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const loadData = useCallback(async (type: 'FETCH_START' | 'REFRESH_START') => {
    dispatch({ type });
    try {
      const [current, { forecast }] = await Promise.all([fetchCurrentWeather(), fetchForecast()]);
      dispatch({ type: 'FETCH_SUCCESS', current, forecast });
    } catch (err: any) {
      dispatch({ type: 'FETCH_ERROR', error: err.message ?? 'Failed to load data' });
    }
  }, []);

  const refresh  = useCallback(() => loadData('REFRESH_START'), [loadData]);
  const refetch  = useCallback(() => loadData('FETCH_START'),   [loadData]);

  const setLang = useCallback((lang: Lang) => {
    dispatch({ type: 'SET_LANG', lang });
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
  }, []);

  const clearNote = useCallback(() => dispatch({ type: 'CLEAR_NOTE' }), []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (saved === 'en' || saved === 'ta') dispatch({ type: 'SET_LANG', lang: saved });
  }, []);

  useEffect(() => {
    loadData('FETCH_START');
    const interval = setInterval(() => loadData('FETCH_START'), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <WeatherContext.Provider value={{ ...state, refresh, refetch, setLang, clearNote }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
}
