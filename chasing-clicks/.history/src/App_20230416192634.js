import { React } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/fallback";
import ClickCounterMap from "./components/clickMap";
import "../src/styles/main.css";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="app">
        <ClickCounterMap />
      </div>
    </ErrorBoundary>
  );
}

export default App;
