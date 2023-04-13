import './App.css';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/error-fallback';
import ClickCounter from './components/clicks';


function App() {
  return (
    <div className="App">
      <ClickCounter />
    </div>
  );
}

export default App;
