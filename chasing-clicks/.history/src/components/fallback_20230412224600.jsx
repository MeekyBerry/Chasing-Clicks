// Error Boundary fall component

import React from "react";


const Fallback = ({ error }) => {
  return (
    <div role="alert">
      <h1>Something went wrong</h1>
      <pre><code>{error.message}</code></pre>
      <p>
        <a href="/">Go back to the home page</a>
      </p>
    </div>
  );
}

export default Fallback;