# Autocomplete Demo - Setup Guide

This guide will help you set up and run the complete autocomplete demonstration project.

## Prerequisites

### Backend Requirements
- **Java 17** or higher
- **Maven 3.6** or higher
- **Git** (for cloning the repository)

### Frontend Requirements
- **Node.js 16** or higher
- **npm** or **yarn**

## Quick Start

### Option 1: Using the provided scripts

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual setup

#### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The Spring Boot application will start on `http://localhost:8080`

#### 2. Start the Frontend

In a new terminal:
```bash
cd frontend
npm install
npm start
```

The React application will start on `http://localhost:3000`

## Verification

### Backend Verification

1. **Check if the application is running:**
   ```
   http://localhost:8080/api/suggestions
   ```
   This should return a JSON array of all suggestions.

2. **Test autocomplete API:**
   ```
   http://localhost:8080/api/autocomplete?query=java&limit=5
   ```
   This should return suggestions starting with "java".

3. **Access H2 Database Console:**
   ```
   http://localhost:8080/h2-console
   ```
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

### Frontend Verification

1. Open `http://localhost:3000` in your browser
2. You should see a modern autocomplete interface
3. Try typing in the search box:
   - Type "java" to see programming suggestions
   - Type "london" to see city suggestions
   - Type "france" to see country suggestions

## Sample Data

The application comes pre-populated with sample data in these categories:

### Programming Languages & Frameworks
- JavaScript, Python, Java, TypeScript
- React, Angular, Vue.js, Node.js
- Spring Boot, Django, Flask, Express.js

### Cities
- New York, London, Paris, Tokyo
- Berlin, Rome, Madrid, Amsterdam
- Vienna, Prague, Budapest, Barcelona

### Countries
- United States, United Kingdom, France
- Germany, Italy, Spain, Netherlands
- Austria, Switzerland, Belgium, Denmark, Sweden

### General Terms
- autocomplete, search, suggestion, input
- field, form, user, interface, experience
- design, development, application

## Features to Test

### 1. Basic Autocomplete
- Type in the search box and watch suggestions appear
- Suggestions are ranked by frequency and alphabetical order

### 2. Keyboard Navigation
- Use **↑/↓** arrow keys to navigate suggestions
- Press **Enter** to select the highlighted suggestion
- Press **Escape** to close the suggestions

### 3. Mouse Interaction
- Click on any suggestion to select it
- Hover over suggestions to highlight them

### 4. Responsive Design
- Resize your browser window to see responsive behavior
- Test on mobile devices if available

### 5. Loading States
- Watch for loading indicators during API calls
- Notice the debounced search (300ms delay)

### 6. Error Handling
- Try disconnecting the backend to see error states
- Reconnect to see recovery

## API Testing

You can test the API endpoints directly:

### Get All Suggestions
```bash
curl http://localhost:8080/api/suggestions
```

### Search Suggestions
```bash
curl "http://localhost:8080/api/autocomplete?query=react&limit=3"
```

### Search by Category
```bash
curl "http://localhost:8080/api/autocomplete/category/programming?query=java&limit=5"
```

### Add New Suggestion
```bash
curl -X POST "http://localhost:8080/api/suggestions?text=NewFramework&category=programming"
```

## Troubleshooting

### Backend Issues

1. **Port 8080 already in use:**
   - Change the port in `backend/src/main/resources/application.properties`
   - Update the frontend API URL accordingly

2. **Java version issues:**
   - Ensure you have Java 17+ installed
   - Check with `java -version`

3. **Maven issues:**
   - Ensure Maven is installed and in PATH
   - Check with `mvn -version`

### Frontend Issues

1. **Port 3000 already in use:**
   - React will automatically suggest an alternative port
   - Or kill the process using port 3000

2. **Node.js version issues:**
   - Ensure Node.js 16+ is installed
   - Check with `node --version`

3. **npm install fails:**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Connection Issues

1. **Frontend can't connect to backend:**
   - Ensure backend is running on port 8080
   - Check CORS configuration in backend
   - Verify network connectivity

2. **API calls failing:**
   - Check browser console for errors
   - Verify backend logs for errors
   - Test API endpoints directly with curl

## Development

### Backend Development
- The backend uses Spring Boot with JPA/Hibernate
- H2 in-memory database for simplicity
- CORS is configured for React frontend
- Sample data is loaded on startup

### Frontend Development
- React 18 with TypeScript
- Custom hooks for state management
- Debounced API calls for performance
- Modern CSS with responsive design

### Adding Features
- Backend: Add new endpoints in `AutocompleteController`
- Frontend: Add new components in `src/components/`
- Styling: Modify `src/index.css`
- API: Update `src/api/autocompleteApi.ts`

## Production Deployment

### Backend
- Build JAR: `mvn clean package`
- Run: `java -jar target/autocomplete-backend-1.0.0.jar`
- Configure production database in `application.properties`

### Frontend
- Build: `npm run build`
- Serve the `build` folder with a web server
- Update API URLs for production backend

## Support

If you encounter issues:
1. Check the console logs for both applications
2. Verify all prerequisites are installed
3. Test API endpoints directly
4. Check network connectivity between frontend and backend 