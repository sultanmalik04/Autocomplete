export interface Suggestion {
  id: number;
  text: string;
  category?: string;
  frequency: number;
  lastUsed?: string;
  createdAt?: string;
}

export interface AutocompleteResponse {
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
} 