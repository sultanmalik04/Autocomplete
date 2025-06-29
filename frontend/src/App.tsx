import React, { useState } from 'react';
import { AutocompleteInput } from './components/AutocompleteInput';
import { AdminDashboard } from './components/AdminDashboard';
import { DebugPanel } from './components/DebugPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'autocomplete' | 'admin'>('autocomplete');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autocomplete System</h1>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'autocomplete' ? 'active' : ''}`}
            onClick={() => setCurrentView('autocomplete')}
          >
            Autocomplete Demo
          </button>
          <button 
            className={`nav-tab ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            Admin Dashboard
          </button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'autocomplete' ? (
          <div className="autocomplete-demo">
            <h2>Real-Time Autocomplete Demo</h2>
            <p>Type to see suggestions with learning capability and optimized performance.</p>
            
            {/* Debug Panel for troubleshooting */}
            <DebugPanel />
            
            <AutocompleteInput />
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>

      <footer className="App-footer">
        <p>Autocomplete System - Built with Spring Boot & React</p>
        <p>Features: Real-time search, Learning capability, Admin dashboard, &lt;100ms performance</p>
      </footer>
    </div>
  );
}

export default App; 