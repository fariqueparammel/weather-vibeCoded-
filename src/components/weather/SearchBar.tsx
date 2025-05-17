import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useLocalStorage from "../../hooks/useLocalStorage";
import { FaSearch, FaHistory, FaMapMarkerAlt } from "react-icons/fa";
import {
  getLocationSuggestions,
  formatLocationSuggestion,
  LocationSuggestion,
} from "../../services/locationService";

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    "recentSearches",
    []
  );
  const [showRecent, setShowRecent] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch location suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        // Add a small delay to avoid too many API calls while typing
        const timeoutId = setTimeout(async () => {
          const results = await getLocationSuggestions(query);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          setIsLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);

      // Add to recent searches
      const updatedSearches = [
        query,
        ...recentSearches.filter((search) => search !== query),
      ].slice(0, 5); // Keep only the 5 most recent

      setRecentSearches(updatedSearches);
      // Don't clear the query so users can see what they searched for
      setShowSuggestions(false);
      setShowRecent(false);
    }
  };

  const handleRecentSearch = (city: string) => {
    setQuery(city); // Update the input field with the selected city
    onSearch(city);
    setShowRecent(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const locationName = suggestion.name;
    setQuery(locationName);
    onSearch(locationName);

    // Add to recent searches
    const updatedSearches = [
      locationName,
      ...recentSearches.filter((search) => search !== locationName),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    setShowSuggestions(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="search-container position-relative mb-4"
      ref={searchContainerRef}
    >
      <form onSubmit={handleSubmit} className="d-flex">
        <div className="input-group">
          <span className="input-group-text futuristic-input-icon">
            <FaMapMarkerAlt />
          </span>
          <input
            type="text"
            className="form-control futuristic-input"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              if (recentSearches.length > 0 && !showSuggestions) {
                setShowRecent(true);
              }
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          <button className="btn btn-primary futuristic-button" type="submit">
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Location Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className="location-suggestions position-absolute w-100 bg-glass shadow-lg rounded-lg mt-1 p-3 z-3 futuristic-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h6 className="text-primary mb-3 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" />
              <span>Location Suggestions</span>
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
            </h6>
            <div className="suggestions-list custom-scrollbar">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="suggestion-item"
                  whileHover={{
                    backgroundColor: "rgba(74, 111, 165, 0.1)",
                    scale: 1.02,
                    transition: { duration: 0.1 },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSuggestionClick(suggestion);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="suggestion-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="suggestion-details">
                      <div className="suggestion-name">{suggestion.name}</div>
                      <div className="suggestion-country">
                        {suggestion.state ? `${suggestion.state}, ` : ""}
                        {suggestion.country}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches */}
      <AnimatePresence>
        {showRecent && recentSearches.length > 0 && !showSuggestions && (
          <motion.div
            className="recent-searches position-absolute w-100 bg-glass shadow-lg rounded-lg mt-1 p-3 z-3 futuristic-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h6 className="text-primary mb-3 d-flex align-items-center">
              <FaHistory className="me-2" />
              <span>Recent Searches</span>
            </h6>
            <div className="suggestions-list custom-scrollbar">
              {recentSearches.map((city, index) => (
                <motion.div
                  key={index}
                  className="suggestion-item"
                  whileHover={{
                    backgroundColor: "rgba(74, 111, 165, 0.1)",
                    scale: 1.02,
                    transition: { duration: 0.1 },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecentSearch(city);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="suggestion-icon">
                      <FaHistory />
                    </div>
                    <div className="suggestion-details">
                      <div className="suggestion-name">{city}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
