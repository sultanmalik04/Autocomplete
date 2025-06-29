import React from 'react';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { Suggestion } from '../types';

interface AutocompleteInputProps {
  placeholder?: string;
  className?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder = "Start typing to see suggestions...",
  className = ""
}) => {
  const {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    selectedIndex,
    handleSuggestionClick,
    clearSuggestions
  } = useAutocomplete({ debounceMs: 300, limit: 10 });

  return (
    <div className={`autocomplete-container ${className}`}>
      <div className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              // Suggestions will show automatically
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(clearSuggestions, 200);
          }}
          placeholder={placeholder}
          className="autocomplete-input"
          autoComplete="off"
        />
        
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => {
                  // Optional: Update selected index on hover
                }}
              >
                <span className="suggestion-text">{suggestion.text}</span>
                {suggestion.category && (
                  <span className="suggestion-category">{suggestion.category}</span>
                )}
                <span className="suggestion-frequency">({suggestion.frequency})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Debug information */}
      <div style={{ 
        background: '#fff3cd', 
        padding: '10px', 
        margin: '10px 0', 
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace'
      }}>
        <div>Query: "{query}"</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Suggestions count: {suggestions.length}</div>
        <div>Selected index: {selectedIndex}</div>
        {suggestions.length > 0 && (
          <div>First suggestion: {suggestions[0]?.text}</div>
        )}
      </div>

      <div className="info-section">
        <h3>Features</h3>
        <ul>
          <li>✅ Real-time search with debouncing</li>
          <li>✅ Keyboard navigation (Arrow keys, Enter, Escape)</li>
          <li>✅ Learning capability (tracks usage frequency)</li>
          <li>✅ Optimized performance (&lt;100ms response)</li>
          <li>✅ Category-based filtering</li>
          <li>✅ Frequency-based ranking</li>
        </ul>
      </div>

      <div className="keyboard-hint">
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li><strong>↑/↓</strong> Navigate through suggestions</li>
          <li><strong>Enter</strong> Select highlighted suggestion</li>
          <li><strong>Escape</strong> Close suggestions</li>
          <li><strong>Mouse</strong> Click to select any suggestion</li>
        </ul>
      </div>

      <style>{`
        .autocomplete-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 20px;
        }

        .autocomplete-input {
          width: 100%;
          padding: 15px 20px;
          font-size: 18px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
          background: white;
        }

        .autocomplete-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .loading-indicator {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          max-height: 300px;
          overflow-y: auto;
          z-index: 9999;
          margin-top: 5px;
        }

        .suggestion-item {
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f8f9fa;
          transition: background-color 0.2s ease;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
          background-color: #f8f9fa;
        }

        .suggestion-text {
          font-weight: 500;
          color: #333;
          flex: 1;
        }

        .suggestion-category {
          background: #e9ecef;
          color: #6c757d;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin: 0 8px;
        }

        .suggestion-frequency {
          color: #6c757d;
          font-size: 14px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }

        .info-section {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .info-section h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.3rem;
        }

        .info-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-section li {
          color: #666;
          margin: 8px 0;
          padding: 5px 0;
          line-height: 1.6;
        }

        .keyboard-hint {
          margin-top: 30px;
          padding: 20px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
        }

        .keyboard-hint h4 {
          color: #856404;
          margin-bottom: 15px;
        }

        .keyboard-hint ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .keyboard-hint li {
          color: #856404;
          margin: 8px 0;
          padding: 5px 0;
        }

        .keyboard-hint strong {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .autocomplete-input {
            font-size: 16px;
            padding: 12px 16px;
          }

          .suggestion-item {
            padding: 10px 16px;
          }

          .suggestion-category {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}; 