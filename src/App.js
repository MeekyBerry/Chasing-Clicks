import { React, lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/fallback";

const ClickCounterMap = lazy(() => import("./components/clickMap"));

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <div className="suspense">
            <div className="suspense--blob">{""}</div>
          </div>
        }
      >
        <div className="app">
          <ClickCounterMap />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
