package com.example.autocomplete.service;

import com.example.autocomplete.model.Suggestion;
import com.example.autocomplete.repository.SuggestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class SuggestionService {
    
    @Autowired
    private SuggestionRepository suggestionRepository;
    
    /**
     * Get autocomplete suggestions with optimized performance (< 100ms)
     * Implements Trie-like prefix search using database indexes
     */
    @Cacheable(value = "suggestions", key = "#query + '_' + #limit")
    public List<Suggestion> getSuggestions(String query, int limit) {
        System.out.println("Service: getSuggestions called with query: '" + query + "', limit: " + limit); // Debug log
        
        if (query == null || query.trim().isEmpty()) {
            System.out.println("Service: Empty query, returning empty list"); // Debug log
            return List.of();
        }
        
        String trimmedQuery = query.trim();
        System.out.println("Service: Searching for trimmed query: '" + trimmedQuery + "'"); // Debug log
        
        List<Suggestion> suggestions = suggestionRepository
                .findByTextStartingWithIgnoreCaseOrderByFrequencyDescLastUsedDescTextAsc(trimmedQuery);
        
        System.out.println("Service: Repository returned " + suggestions.size() + " suggestions"); // Debug log
        
        List<Suggestion> limitedSuggestions = suggestions.stream()
                .limit(limit)
                .toList();
        
        System.out.println("Service: Returning " + limitedSuggestions.size() + " suggestions after limiting"); // Debug log
        return limitedSuggestions;
    }
    
    /**
     * Get autocomplete suggestions by category
     */
    @Cacheable(value = "suggestionsByCategory", key = "#query + '_' + #category + '_' + #limit")
    public List<Suggestion> getSuggestionsByCategory(String query, String category, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        String trimmedQuery = query.trim();
        List<Suggestion> suggestions = suggestionRepository
                .findByCategoryAndTextStartingWithIgnoreCaseOrderByFrequencyDescLastUsedDescTextAsc(category, trimmedQuery);
        
        return suggestions.stream()
                .limit(limit)
                .toList();
    }
    
    /**
     * Add a new suggestion or increment frequency if it exists (Learning Capability)
     */
    @Transactional
    public Suggestion addSuggestion(String text, String category) {
        Suggestion existingSuggestion = suggestionRepository.findByTextIgnoreCase(text);
        
        if (existingSuggestion != null) {
            // Learning: Increment frequency and update last used
            existingSuggestion.incrementFrequency();
            return suggestionRepository.save(existingSuggestion);
        } else {
            // Create new suggestion
            Suggestion newSuggestion = new Suggestion(text, category);
            return suggestionRepository.save(newSuggestion);
        }
    }
    
    /**
     * Record suggestion selection for learning (Learning Capability)
     */
    @Transactional
    public void recordSuggestionSelection(Long suggestionId) {
        suggestionRepository.incrementFrequencyAndUpdateLastUsed(suggestionId);
    }
    
    /**
     * Get all suggestions (for admin dashboard)
     */
    public List<Suggestion> getAllSuggestions() {
        return suggestionRepository.findAll();
    }
    
    /**
     * Get suggestions by category (for admin dashboard)
     */
    public List<Suggestion> getSuggestionsByCategory(String category) {
        return suggestionRepository.findByCategoryOrderByFrequencyDesc(category);
    }
    
    /**
     * Get recently used suggestions (Learning Capability)
     */
    public List<Suggestion> getRecentlyUsedSuggestions(int limit) {
        return suggestionRepository.findRecentlyUsed(limit);
    }
    
    /**
     * Get suggestions by frequency range (for admin dashboard)
     */
    public List<Suggestion> getSuggestionsByFrequencyRange(int minFreq, int maxFreq) {
        return suggestionRepository.findByFrequencyRange(minFreq, maxFreq);
    }
    
    /**
     * Get statistics for admin dashboard
     */
    public SuggestionStats getStats() {
        long totalSuggestions = suggestionRepository.count();
        long englishWords = suggestionRepository.countByCategory("english");
        long sampleWords = suggestionRepository.countByCategory("sample");
        
        return new SuggestionStats(totalSuggestions, englishWords, sampleWords);
    }
    
    /**
     * Delete a suggestion by ID
     */
    @Transactional
    public void deleteSuggestion(Long id) {
        suggestionRepository.deleteById(id);
    }
    
    /**
     * Update suggestion (for admin dashboard)
     */
    @Transactional
    public Suggestion updateSuggestion(Long id, String text, String category) {
        Suggestion suggestion = suggestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suggestion not found"));
        
        suggestion.setText(text);
        suggestion.setCategory(category);
        return suggestionRepository.save(suggestion);
    }
    
    /**
     * Bulk add suggestions (for admin dashboard)
     */
    @Transactional
    public void bulkAddSuggestions(List<String> texts, String category) {
        texts.parallelStream().forEach(text -> addSuggestion(text, category));
    }
    
    // Statistics class for admin dashboard
    public static class SuggestionStats {
        private final long totalSuggestions;
        private final long englishWords;
        private final long sampleWords;
        
        public SuggestionStats(long totalSuggestions, long englishWords, long sampleWords) {
            this.totalSuggestions = totalSuggestions;
            this.englishWords = englishWords;
            this.sampleWords = sampleWords;
        }
        
        public long getTotalSuggestions() { return totalSuggestions; }
        public long getEnglishWords() { return englishWords; }
        public long getSampleWords() { return sampleWords; }
    }
} 