import { useState, useEffect, useCallback } from 'react';
import { Suggestion } from '../types';
import { AutocompleteApi } from '../api/autocompleteApi';

interface UseAutocompleteOptions {
  debounceMs?: number;
  limit?: number;
  category?: string;
}

interface UseAutocompleteReturn {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  selectedIndex: number;
  handleSuggestionSelect: (suggestion: Suggestion) => void;
  handleSuggestionClick: (suggestion: Suggestion) => void;
  clearSuggestions: () => void;
}

export const useAutocomplete = (options: UseAutocompleteOptions = {}) => {
  const { debounceMs = 300, limit = 10, category } = options;
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      console.log('Searching for:', searchQuery); // Debug log
      
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let results: Suggestion[];
        
        if (category) {
          console.log('Searching by category:', category); // Debug log
          results = await AutocompleteApi.getSuggestionsByCategory(searchQuery, category, limit);
        } else {
          console.log('Searching all suggestions'); // Debug log
          results = await AutocompleteApi.getSuggestions(searchQuery, limit);
        }
        
        console.log('Search results:', results); // Debug log
        setSuggestions(results);
      } catch (err) {
        console.error('Search error:', err); // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [category, limit, debounceMs]
  );

  // Update suggestions when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  }, [suggestions, selectedIndex]);

  // Handle suggestion selection with learning capability
  const handleSuggestionSelect = useCallback(async (suggestion: Suggestion) => {
    try {
      // Record the selection for learning capability
      await AutocompleteApi.recordSuggestionSelection(suggestion.id);
      
      // Update the query with the selected suggestion
      setQuery(suggestion.text);
      setSuggestions([]);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Error recording suggestion selection:', err);
      // Still update the query even if recording fails
      setQuery(suggestion.text);
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, []);

  // Handle mouse selection
  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    handleSuggestionSelect(suggestion);
  }, [handleSuggestionSelect]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setSelectedIndex(-1);
    setError(null);
  }, []);

  // Add event listeners for keyboard navigation
  useEffect(() => {
    if (suggestions.length > 0) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [suggestions, handleKeyDown]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    selectedIndex,
    handleSuggestionSelect,
    handleSuggestionClick,
    clearSuggestions,
  };
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 