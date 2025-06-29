# Autocomplete Demo Project

A simple autocomplete demonstration using Spring Boot backend and React frontend.

## Features

- **Backend (Spring Boot)**:
  - RESTful API endpoints for autocomplete functionality
  - In-memory data storage with sample data
  - Search by prefix matching
  - Configurable search results limit

- **Frontend (React)**:
  - Modern, responsive UI
  - Real-time search suggestions
  - Keyboard navigation support
  - Debounced search input
  - Loading states and error handling

## Project Structure

```
Autocomplete/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

3. The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will start on `http://localhost:3000`

## API Endpoints

- `GET /api/autocomplete?query={searchTerm}&limit={maxResults}` - Search for autocomplete suggestions

## Technologies Used

- **Backend**: Spring Boot 3.x, Java 17, Maven
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS 