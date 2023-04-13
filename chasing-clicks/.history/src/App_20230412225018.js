import "./App.css";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/fallback";
import { Routes, Route } from "react-router-dom";
import ClickCounter from "./components/clicks";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="App">
        <Routes>
          <Route path="/" element={<ClickCounter />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
