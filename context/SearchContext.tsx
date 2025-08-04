"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface TripResult {
  trip_id: number;
  route_name: string;
  schedule_date: string;
  starting_point: string;
  ending_point: string;
}

interface SearchContextType {
  results: TripResult[];
  setResults: (data: TripResult[]) => void;
}

const SearchContext = createContext<SearchContextType>({
  results: [],
  setResults: () => {},
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [results, setResultsState] = useState<TripResult[]>([]);

  // Load from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("tripResults");
    if (saved) {
      setResultsState(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on changes
  const setResults = (data: TripResult[]) => {
    localStorage.setItem("tripResults", JSON.stringify(data));
    setResultsState(data);
  };

  return (
    <SearchContext.Provider value={{ results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};