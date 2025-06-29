import { Suggestion } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export class AutocompleteApi {
  // ========== AUTCOMPLETE ENDPOINTS ==========
  
  static async getSuggestions(query: string, limit: number = 10): Promise<Suggestion[]> {
    try {
      console.log('API: Fetching suggestions for query:', query, 'limit:', limit); // Debug log
      
      const response = await fetch(
        `${API_BASE_URL}/autocomplete?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      console.log('API: Response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API: Response data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  }

  static async getSuggestionsByCategory(
    query: string, 
    category: string, 
    limit: number = 10
  ): Promise<Suggestion[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/autocomplete/category/${encodeURIComponent(category)}?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggestions by category:', error);
      throw error;
    }
  }

  // ========== LEARNING CAPABILITY ==========
  
  static async recordSuggestionSelection(suggestionId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/autocomplete/select/${suggestionId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error recording suggestion selection:', error);
      throw error;
    }
  }

  // ========== ADMIN DASHBOARD ENDPOINTS ==========
  
  static async addSuggestion(text: string, category?: string): Promise<Suggestion> {
    try {
      const params = new URLSearchParams();
      params.append('text', text);
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${API_BASE_URL}/admin/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding suggestion:', error);
      throw error;
    }
  }

  static async getAllSuggestions(): Promise<Suggestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/suggestions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all suggestions:', error);
      throw error;
    }
  }

  static async getAdminSuggestionsByCategory(category: string): Promise<Suggestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/suggestions/category/${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggestions by category:', error);
      throw error;
    }
  }

  static async getRecentlyUsedSuggestions(limit: number = 20): Promise<Suggestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/suggestions/recent?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recently used suggestions:', error);
      throw error;
    }
  }

  static async getSuggestionsByFrequencyRange(minFreq: number, maxFreq: number): Promise<Suggestion[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/suggestions/frequency?minFreq=${minFreq}&maxFreq=${maxFreq}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggestions by frequency range:', error);
      throw error;
    }
  }

  static async getStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  static async updateSuggestion(id: number, text: string, category?: string): Promise<Suggestion> {
    try {
      const params = new URLSearchParams();
      params.append('text', text);
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${API_BASE_URL}/admin/suggestions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating suggestion:', error);
      throw error;
    }
  }

  static async deleteSuggestion(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/suggestions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      throw error;
    }
  }

  static async bulkAddSuggestions(texts: string[], category?: string): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${API_BASE_URL}/admin/suggestions/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(texts),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error bulk adding suggestions:', error);
      throw error;
    }
  }
} 