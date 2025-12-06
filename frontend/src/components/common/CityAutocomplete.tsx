import React, { useState, useRef, useEffect } from "react";
import api from "../../api/client";

interface City {
  id: string;
  name: string;
  state: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  label,
  required = false,
}) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.get<{ cities: City[] }>(`/misc/cities?q=${encodeURIComponent(query)}`);
      setSuggestions(data.cities || []);
      setShowSuggestions(true);
    } catch (err: any) {
      console.error("Failed to fetch cities:", err);
      setError("Failed to load cities. Please try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Debounce API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelectCity = (city: City) => {
    onChange(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      const firstSuggestion = document.querySelector('[role="option"]') as HTMLElement;
      firstSuggestion?.focus();
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">
          📍
        </span>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="input-field pl-10"
          placeholder={placeholder}
          required={required}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          role="combobox"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-label="Loading">
            ⏳
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((city, index) => (
            <li
              key={city.id}
              onClick={() => handleSelectCity(city)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectCity(city);
                }
              }}
              tabIndex={0}
              className="px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer flex justify-between items-center focus:bg-primary-50 dark:focus:bg-primary-900 focus:outline-none"
              role="option"
              aria-selected={value === city.name}
            >
              <div>
                <span className="font-medium dark:text-gray-100">{city.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{city.state}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{city.id}</span>
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && !loading && suggestions.length === 0 && value.length >= 2 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
          role="listbox"
        >
          <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400" role="option">
            No cities found
          </li>
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;



