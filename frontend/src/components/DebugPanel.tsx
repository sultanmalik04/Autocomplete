import React, { useState } from 'react';
import { AutocompleteApi } from '../api/autocompleteApi';

export const DebugPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/test');
      const data = await response.text();
      setTestResult(`Backend Test: ${response.status} - ${data}`);
    } catch (error) {
      setTestResult(`Backend Test Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAutocompleteAPI = async () => {
    setLoading(true);
    try {
      const suggestions = await AutocompleteApi.getSuggestions('test', 5);
      setTestResult(`Autocomplete API Test: Found ${suggestions.length} suggestions for 'test'`);
    } catch (error) {
      setTestResult(`Autocomplete API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAllSuggestions = async () => {
    setLoading(true);
    try {
      const suggestions = await AutocompleteApi.getAllSuggestions();
      setTestResult(`All Suggestions Test: Found ${suggestions.length} total suggestions`);
    } catch (error) {
      setTestResult(`All Suggestions Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      border: '1px solid #dee2e6', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>Debug Panel</h3>
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={testBackendConnection}
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Backend Connection
        </button>
        <button 
          onClick={testAutocompleteAPI}
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Autocomplete API
        </button>
        <button 
          onClick={testAllSuggestions}
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          Test All Suggestions
        </button>
      </div>
      {loading && <p>Testing...</p>}
      {testResult && (
        <div style={{ 
          background: '#e9ecef', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
}; 