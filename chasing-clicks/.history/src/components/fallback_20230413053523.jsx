// Error Boundary fall component
import React from "react";

const Fallback = ({ error }) => {
  return (
    <div role="alert">
      <h1>Something went wrong</h1>
      <pre><code>{error.message}</code></pre>
    </div>
  );
}

export default Fallback;