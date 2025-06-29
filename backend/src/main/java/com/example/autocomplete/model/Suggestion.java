package com.example.autocomplete.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suggestions")
public class Suggestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String text;
    
    @Column
    private String category;
    
    @Column
    private Integer frequency;
    
    @Column
    private LocalDateTime lastUsed;
    
    @Column
    private LocalDateTime createdAt;
    
    // Default constructor
    public Suggestion() {
        this.frequency = 1;
        this.createdAt = LocalDateTime.now();
        this.lastUsed = LocalDateTime.now();
    }
    
    // Constructor with text
    public Suggestion(String text) {
        this();
        this.text = text;
    }
    
    // Constructor with text and category
    public Suggestion(String text, String category) {
        this();
        this.text = text;
        this.category = category;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Integer getFrequency() {
        return frequency;
    }
    
    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }
    
    public LocalDateTime getLastUsed() {
        return lastUsed;
    }
    
    public void setLastUsed(LocalDateTime lastUsed) {
        this.lastUsed = lastUsed;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Method to increment frequency and update last used
    public void incrementFrequency() {
        this.frequency++;
        this.lastUsed = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Suggestion{" +
                "id=" + id +
                ", text='" + text + '\'' +
                ", category='" + category + '\'' +
                ", frequency=" + frequency +
                ", lastUsed=" + lastUsed +
                ", createdAt=" + createdAt +
                '}';
    }
} 