import "./App.css";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/fallback";
import ClickCounter from "./components/clicks";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="App">
        <ClickCounter />
      </div>
    </ErrorBoundary>
  );
}

export default App;
