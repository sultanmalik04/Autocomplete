import React, { useState, useEffect } from 'react';
import { AutocompleteApi } from '../api/autocompleteApi';
import { Suggestion } from '../types';

interface Stats {
  totalSuggestions: number;
  englishWords: number;
  sampleWords: number;
}

export const AdminDashboard: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newSuggestion, setNewSuggestion] = useState({ text: '', category: '' });
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');

  // Load initial data
  useEffect(() => {
    loadSuggestions();
    loadStats();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await AutocompleteApi.getAllSuggestions();
      setSuggestions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await AutocompleteApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadSuggestionsByCategory = async (category: string) => {
    setLoading(true);
    try {
      const data = await AutocompleteApi.getAdminSuggestionsByCategory(category);
      setSuggestions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load suggestions by category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.text.trim()) return;

    try {
      await AutocompleteApi.addSuggestion(newSuggestion.text, newSuggestion.category || undefined);
      setNewSuggestion({ text: '', category: '' });
      loadSuggestions();
      loadStats();
    } catch (err) {
      setError('Failed to add suggestion');
      console.error(err);
    }
  };

  const handleUpdateSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSuggestion) return;

    try {
      await AutocompleteApi.updateSuggestion(
        editingSuggestion.id,
        editingSuggestion.text,
        editingSuggestion.category || undefined
      );
      setEditingSuggestion(null);
      loadSuggestions();
    } catch (err) {
      setError('Failed to update suggestion');
      console.error(err);
    }
  };

  const handleDeleteSuggestion = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      await AutocompleteApi.deleteSuggestion(id);
      loadSuggestions();
      loadStats();
    } catch (err) {
      setError('Failed to delete suggestion');
      console.error(err);
    }
  };

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const texts = bulkText.split('\n').map(text => text.trim()).filter(text => text);
    if (texts.length === 0) return;

    try {
      await AutocompleteApi.bulkAddSuggestions(texts, bulkCategory || undefined);
      setBulkText('');
      setBulkCategory('');
      loadSuggestions();
      loadStats();
    } catch (err) {
      setError('Failed to bulk add suggestions');
      console.error(err);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      loadSuggestionsByCategory(category);
    } else {
      loadSuggestions();
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Suggestions</h3>
            <p>{stats.totalSuggestions}</p>
          </div>
          <div className="stat-card">
            <h3>English Words</h3>
            <p>{stats.englishWords}</p>
          </div>
          <div className="stat-card">
            <h3>Sample Words</h3>
            <p>{stats.sampleWords}</p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        <label>Filter by Category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="english">English</option>
          <option value="sample">Sample</option>
        </select>
      </div>

      {/* Add New Suggestion */}
      <div className="add-suggestion-section">
        <h2>Add New Suggestion</h2>
        <form onSubmit={handleAddSuggestion}>
          <input
            type="text"
            placeholder="Suggestion text"
            value={newSuggestion.text}
            onChange={(e) => setNewSuggestion(prev => ({ ...prev, text: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={newSuggestion.category}
            onChange={(e) => setNewSuggestion(prev => ({ ...prev, category: e.target.value }))}
          />
          <button type="submit">Add Suggestion</button>
        </form>
      </div>

      {/* Bulk Add Suggestions */}
      <div className="bulk-add-section">
        <h2>Bulk Add Suggestions</h2>
        <form onSubmit={handleBulkAdd}>
          <textarea
            placeholder="Enter suggestions (one per line)"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={5}
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
          />
          <button type="submit">Bulk Add</button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Suggestions List */}
      <div className="suggestions-list">
        <h2>Suggestions ({suggestions.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="suggestions-grid">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card">
                {editingSuggestion?.id === suggestion.id ? (
                  <form onSubmit={handleUpdateSuggestion}>
                    <input
                      type="text"
                      value={editingSuggestion.text}
                      onChange={(e) => setEditingSuggestion(prev => 
                        prev ? { ...prev, text: e.target.value } : null
                      )}
                      required
                    />
                    <input
                      type="text"
                      value={editingSuggestion.category || ''}
                      onChange={(e) => setEditingSuggestion(prev => 
                        prev ? { ...prev, category: e.target.value } : null
                      )}
                      placeholder="Category"
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingSuggestion(null)}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="suggestion-info">
                      <h4>{suggestion.text}</h4>
                      <p>Category: {suggestion.category || 'None'}</p>
                      <p>Frequency: {suggestion.frequency}</p>
                      {suggestion.lastUsed && (
                        <p>Last Used: {new Date(suggestion.lastUsed).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="suggestion-actions">
                      <button onClick={() => setEditingSuggestion(suggestion)}>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteSuggestion(suggestion.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e9ecef;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #495057;
        }

        .stat-card p {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          color: #007bff;
        }

        .category-filter {
          margin-bottom: 30px;
        }

        .category-filter label {
          margin-right: 10px;
          font-weight: bold;
        }

        .category-filter select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 16px;
        }

        .add-suggestion-section,
        .bulk-add-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
        }

        .add-suggestion-section h2,
        .bulk-add-section h2 {
          margin-top: 0;
          color: #495057;
        }

        form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: end;
        }

        input, textarea, select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 16px;
          flex: 1;
          min-width: 200px;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        button {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background: #0056b3;
        }

        .delete-btn {
          background: #dc3545;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-message button {
          background: none;
          border: none;
          color: #721c24;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .suggestion-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
        }

        .suggestion-info h4 {
          margin: 0 0 10px 0;
          color: #495057;
        }

        .suggestion-info p {
          margin: 5px 0;
          color: #6c757d;
          font-size: 14px;
        }

        .suggestion-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .suggestion-actions button {
          flex: 1;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}; 