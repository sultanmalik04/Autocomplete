package com.example.autocomplete.controller;

import com.example.autocomplete.model.Suggestion;
import com.example.autocomplete.repository.SuggestionRepository;
import com.example.autocomplete.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AutocompleteController {
    
    @Autowired
    private SuggestionService suggestionService;
    
    @Autowired
    private SuggestionRepository suggestionRepository;
    
    /**
     * Test endpoint to check database status
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        try {
            long totalCount = suggestionRepository.count();
            return ResponseEntity.ok("Database is working. Total suggestions: " + totalCount);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Database error: " + e.getMessage());
        }
    }
    
    /**
     * Get autocomplete suggestions (Typeahead with debounce support)
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<List<Suggestion>> getSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        
        System.out.println("Backend: Received request for query: " + query + ", limit: " + limit); // Debug log
        
        try {
            List<Suggestion> suggestions = suggestionService.getSuggestions(query, limit);
            System.out.println("Backend: Found " + suggestions.size() + " suggestions"); // Debug log
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            System.err.println("Backend: Error getting suggestions: " + e.getMessage()); // Debug log
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get autocomplete suggestions by category
     */
    @GetMapping("/autocomplete/category/{category}")
    public ResponseEntity<List<Suggestion>> getSuggestionsByCategory(
            @RequestParam String query,
            @PathVariable String category,
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            List<Suggestion> suggestions = suggestionService.getSuggestionsByCategory(query, category, limit);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Record suggestion selection for learning capability
     */
    @PostMapping("/autocomplete/select/{id}")
    public ResponseEntity<Void> recordSelection(@PathVariable Long id) {
        try {
            suggestionService.recordSuggestionSelection(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== ADMIN DASHBOARD ENDPOINTS ==========
    
    /**
     * Add a new suggestion (Admin Dashboard)
     */
    @PostMapping("/admin/suggestions")
    public ResponseEntity<Suggestion> addSuggestion(
            @RequestParam String text,
            @RequestParam(required = false) String category) {
        
        try {
            Suggestion suggestion = suggestionService.addSuggestion(text, category);
            return ResponseEntity.ok(suggestion);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all suggestions (Admin Dashboard)
     */
    @GetMapping("/admin/suggestions")
    public ResponseEntity<List<Suggestion>> getAllSuggestions() {
        try {
            List<Suggestion> suggestions = suggestionService.getAllSuggestions();
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get suggestions by category (Admin Dashboard)
     */
    @GetMapping("/admin/suggestions/category/{category}")
    public ResponseEntity<List<Suggestion>> getSuggestionsByCategory(@PathVariable String category) {
        try {
            List<Suggestion> suggestions = suggestionService.getSuggestionsByCategory(category);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get recently used suggestions (Learning Capability)
     */
    @GetMapping("/admin/suggestions/recent")
    public ResponseEntity<List<Suggestion>> getRecentlyUsed(
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Suggestion> suggestions = suggestionService.getRecentlyUsedSuggestions(limit);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get suggestions by frequency range (Admin Dashboard)
     */
    @GetMapping("/admin/suggestions/frequency")
    public ResponseEntity<List<Suggestion>> getByFrequencyRange(
            @RequestParam int minFreq,
            @RequestParam int maxFreq) {
        try {
            List<Suggestion> suggestions = suggestionService.getSuggestionsByFrequencyRange(minFreq, maxFreq);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get statistics (Admin Dashboard)
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<SuggestionService.SuggestionStats> getStats() {
        try {
            SuggestionService.SuggestionStats stats = suggestionService.getStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Update suggestion (Admin Dashboard)
     */
    @PutMapping("/admin/suggestions/{id}")
    public ResponseEntity<Suggestion> updateSuggestion(
            @PathVariable Long id,
            @RequestParam String text,
            @RequestParam(required = false) String category) {
        try {
            Suggestion suggestion = suggestionService.updateSuggestion(id, text, category);
            return ResponseEntity.ok(suggestion);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Delete suggestion (Admin Dashboard)
     */
    @DeleteMapping("/admin/suggestions/{id}")
    public ResponseEntity<Void> deleteSuggestion(@PathVariable Long id) {
        try {
            suggestionService.deleteSuggestion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Bulk add suggestions (Admin Dashboard)
     */
    @PostMapping("/admin/suggestions/bulk")
    public ResponseEntity<Void> bulkAddSuggestions(
            @RequestBody List<String> texts,
            @RequestParam(required = false) String category) {
        try {
            suggestionService.bulkAddSuggestions(texts, category);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== LEGACY ENDPOINTS (for backward compatibility) ==========
    
    /**
     * Add a new suggestion (Legacy endpoint)
     */
    @PostMapping("/suggestions")
    public ResponseEntity<Suggestion> addSuggestionLegacy(
            @RequestParam String text,
            @RequestParam(required = false) String category) {
        return addSuggestion(text, category);
    }
    
    /**
     * Get all suggestions (Legacy endpoint)
     */
    @GetMapping("/suggestions")
    public ResponseEntity<List<Suggestion>> getAllSuggestionsLegacy() {
        return getAllSuggestions();
    }
    
    /**
     * Delete suggestion (Legacy endpoint)
     */
    @DeleteMapping("/suggestions/{id}")
    public ResponseEntity<Void> deleteSuggestionLegacy(@PathVariable Long id) {
        return deleteSuggestion(id);
    }
} 