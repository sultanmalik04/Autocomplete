package com.example.autocomplete.repository;

import com.example.autocomplete.model.Suggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    
    /**
     * Optimized prefix search with frequency-based ranking
     * Uses database indexes for better performance (< 100ms)
     */
    @Query("SELECT s FROM Suggestion s WHERE LOWER(s.text) LIKE LOWER(CONCAT(:query, '%')) " +
           "ORDER BY s.frequency DESC, s.lastUsed DESC, s.text ASC")
    List<Suggestion> findByTextStartingWithIgnoreCaseOrderByFrequencyDescLastUsedDescTextAsc(@Param("query") String query);
    
    /**
     * Category-based search with optimized ranking
     */
    @Query("SELECT s FROM Suggestion s WHERE s.category = :category AND LOWER(s.text) LIKE LOWER(CONCAT(:query, '%')) " +
           "ORDER BY s.frequency DESC, s.lastUsed DESC, s.text ASC")
    List<Suggestion> findByCategoryAndTextStartingWithIgnoreCaseOrderByFrequencyDescLastUsedDescTextAsc(
            @Param("category") String category, 
            @Param("query") String query);
    
    /**
     * Check if a suggestion with the given text exists
     */
    boolean existsByTextIgnoreCase(String text);
    
    /**
     * Find a suggestion by text (case-insensitive)
     */
    Suggestion findByTextIgnoreCase(String text);
    
    /**
     * Update frequency and last used time when suggestion is selected
     */
    @Modifying
    @Query("UPDATE Suggestion s SET s.frequency = s.frequency + 1, s.lastUsed = CURRENT_TIMESTAMP WHERE s.id = :id")
    void incrementFrequencyAndUpdateLastUsed(@Param("id") Long id);
    
    /**
     * Get suggestions by frequency range (for admin dashboard)
     */
    @Query("SELECT s FROM Suggestion s WHERE s.frequency BETWEEN :minFreq AND :maxFreq ORDER BY s.frequency DESC")
    List<Suggestion> findByFrequencyRange(@Param("minFreq") Integer minFreq, @Param("maxFreq") Integer maxFreq);
    
    /**
     * Get recently used suggestions (for learning capability)
     */
    @Query("SELECT s FROM Suggestion s ORDER BY s.lastUsed DESC LIMIT :limit")
    List<Suggestion> findRecentlyUsed(@Param("limit") int limit);
    
    /**
     * Get suggestions by category (for admin dashboard)
     */
    List<Suggestion> findByCategoryOrderByFrequencyDesc(String category);
    
    /**
     * Count suggestions by category
     */
    long countByCategory(String category);
    
    /**
     * Test method to check if repository is working
     */
    @Query("SELECT COUNT(s) FROM Suggestion s")
    long getTotalCount();
} 