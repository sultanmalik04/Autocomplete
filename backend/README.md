# Spring Boot Autocomplete Backend

A RESTful API backend for autocomplete functionality built with Spring Boot.

## Features

- **RESTful API**: Clean REST endpoints for autocomplete operations
- **Database Integration**: JPA/Hibernate with H2 in-memory database
- **Search Functionality**: Prefix-based search with case-insensitive matching
- **Category Filtering**: Filter suggestions by category
- **Frequency Tracking**: Track and rank suggestions by usage frequency
- **CORS Support**: Configured for React frontend integration
- **Sample Data**: Pre-populated with programming languages, cities, and countries

## API Endpoints

### Autocomplete Search
```
GET /api/autocomplete?query={searchTerm}&limit={maxResults}
```

**Parameters:**
- `query` (required): Search term for autocomplete
- `limit` (optional): Maximum number of results (default: 10)

**Example:**
```
GET /api/autocomplete?query=java&limit=5
```

### Category-based Search
```
GET /api/autocomplete/category/{category}?query={searchTerm}&limit={maxResults}
```

**Parameters:**
- `category` (path): Category to filter by (e.g., "programming", "city", "country")
- `query` (required): Search term for autocomplete
- `limit` (optional): Maximum number of results (default: 10)

**Example:**
```
GET /api/autocomplete/category/programming?query=react&limit=3
```

### Add Suggestion
```
POST /api/suggestions
```

**Parameters:**
- `text` (required): The suggestion text
- `category` (optional): Category for the suggestion

**Example:**
```
POST /api/suggestions?text=NewSuggestion&category=programming
```

### Get All Suggestions
```
GET /api/suggestions
```

### Delete Suggestion
```
DELETE /api/suggestions/{id}
```

## Database Schema

### Suggestion Entity
```java
@Entity
public class Suggestion {
    private Long id;           // Primary key
    private String text;       // Suggestion text (unique)
    private String category;   // Optional category
    private Integer frequency; // Usage frequency (for ranking)
}
```

## Sample Data Categories

- **Programming**: JavaScript, Python, Java, TypeScript, React, etc.
- **Cities**: New York, London, Paris, Tokyo, Berlin, etc.
- **Countries**: United States, United Kingdom, France, Germany, etc.
- **General**: autocomplete, search, suggestion, etc.

## Running the Application

1. **Prerequisites:**
   - Java 17 or higher
   - Maven 3.6 or higher

2. **Build and Run:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Access Points:**
   - Application: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
   - API Base: http://localhost:8080/api

## H2 Database Console

Access the H2 console at http://localhost:8080/h2-console with:
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Configuration

Key configuration in `application.properties`:
- Server port: 8080
- H2 in-memory database
- CORS enabled for React frontend
- JPA auto-create tables

## Development

The application uses:
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database
- Spring Web
- Spring Validation 