"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface TripResult {
  trip_id: number;
  route_name: string;
  schedule_date: string;
  starting_point: string;
  ending_point: string;
  // add more as needed
}

interface SearchContextType {
  results: TripResult[];
  setResults: (data: TripResult[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({
  children,
}: SearchProviderProps): JSX.Element => {
  const [results, setResults] = useState<TripResult[]>([]);

  const value = useMemo(() => ({ results, setResults }), [results]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};