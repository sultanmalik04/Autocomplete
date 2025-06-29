package com.example.autocomplete.config;

import com.example.autocomplete.model.Suggestion;
import com.example.autocomplete.repository.SuggestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private SuggestionRepository suggestionRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("DataInitializer: Starting data initialization...");
        System.out.println("DataInitializer: Current count: " + suggestionRepository.count());
        
        // Only initialize if no data exists
        if (suggestionRepository.count() == 0) {
            System.out.println("DataInitializer: No data found, loading initial data...");
            loadGoogleWords();
        } else {
            System.out.println("DataInitializer: Data already exists, skipping initialization.");
        }
    }
    
    private void loadGoogleWords() {
        try {
            System.out.println("Loading Google 10000 English words...");
            
            // Try multiple possible file paths
            String[] possiblePaths = {
                "google-10000-english.txt",
                "../google-10000-english.txt",
                "../../google-10000-english.txt",
                "backend/google-10000-english.txt"
            };
            
            String filePath = null;
            for (String path : possiblePaths) {
                if (Files.exists(Paths.get(path))) {
                    filePath = path;
                    System.out.println("Found file at: " + path);
                    break;
                }
            }
            
            if (filePath == null) {
                System.err.println("Could not find google-10000-english.txt in any of the expected locations");
                System.err.println("Tried paths: " + String.join(", ", possiblePaths));
                loadSampleData();
                return;
            }
            
            // Read the file from the found path
            try (Stream<String> lines = Files.lines(Paths.get(filePath))) {
                lines.forEach(word -> {
                    if (!word.trim().isEmpty()) {
                        Suggestion suggestion = new Suggestion(word.trim().toLowerCase(), "english");
                        suggestionRepository.save(suggestion);
                    }
                });
            }
            
            System.out.println("Successfully loaded " + suggestionRepository.count() + " words from Google 10000 English list");
            
        } catch (IOException e) {
            System.err.println("Error loading Google words: " + e.getMessage());
            e.printStackTrace();
            System.err.println("Falling back to sample data...");
            loadSampleData();
        }
    }
    
    private void loadSampleData() {
        // Fallback to original sample data if file not found
        System.out.println("Loading sample data...");
        
        String[] sampleWords = {
            "javascript", "python", "java", "typescript", "react", "angular", "vue", "nodejs",
            "spring", "django", "flask", "express", "newyork", "london", "paris", "tokyo",
            "berlin", "rome", "madrid", "amsterdam", "vienna", "prague", "budapest", "barcelona",
            "unitedstates", "unitedkingdom", "france", "germany", "italy", "spain", "netherlands",
            "austria", "switzerland", "belgium", "denmark", "sweden", "autocomplete", "search",
            "suggestion", "input", "field", "form", "user", "interface", "experience", "design",
            "development", "application"
        };
        
        for (String word : sampleWords) {
            Suggestion suggestion = new Suggestion(word, "sample");
            suggestionRepository.save(suggestion);
        }
        
        System.out.println("Loaded " + sampleWords.length + " sample words");
    }
} 