# React Autocomplete Frontend

A modern, responsive autocomplete interface built with React and TypeScript.

## Features

- **Real-time Search**: Debounced API calls for smooth user experience
- **Keyboard Navigation**: Full keyboard support with arrow keys, Enter, and Escape
- **Mouse Interaction**: Click to select suggestions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error display
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **TypeScript**: Full type safety throughout the application

## Components

### AutocompleteInput
The main autocomplete component that handles:
- Input field with real-time search
- Suggestion dropdown with keyboard navigation
- Loading and error states
- Mouse and keyboard interactions

### App
The main application component that:
- Renders the autocomplete interface
- Displays selected suggestions
- Shows feature information and keyboard shortcuts

## Custom Hooks

### useAutocomplete
A custom hook that manages:
- Search state and debouncing
- API calls to the backend
- Keyboard navigation logic
- Error handling

## API Integration

The frontend communicates with the Spring Boot backend through:
- RESTful API calls using fetch
- Proper error handling and loading states
- Debounced search to prevent excessive API calls

## Keyboard Shortcuts

- **↑/↓ Arrow Keys**: Navigate through suggestions
- **Enter**: Select the highlighted suggestion
- **Escape**: Close the suggestions dropdown
- **Mouse**: Click any suggestion to select it

## Styling

The application uses CSS modules with:
- Modern gradient backgrounds
- Smooth transitions and animations
- Responsive design principles
- Clean, accessible color scheme
- Box shadows and backdrop filters for depth

## Running the Application

1. **Prerequisites:**
   - Node.js 16 or higher
   - npm or yarn

2. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm start
   ```

4. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend should be running on http://localhost:8080

## Development

### Project Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── AutocompleteInput.tsx
│   ├── hooks/
│   │   └── useAutocomplete.ts
│   ├── api/
│   │   └── autocompleteApi.ts
│   ├── types.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
└── package.json
```

### Key Technologies
- React 18
- TypeScript
- CSS3 with modern features
- Fetch API for HTTP requests

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Configuration

The application is configured to:
- Proxy API calls to `http://localhost:8080` during development
- Use TypeScript for type safety
- Support modern browser features
- Include proper error boundaries and loading states 