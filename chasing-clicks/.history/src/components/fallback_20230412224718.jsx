// Error Boundary fall component

import React from "react";
import { Link } from "react-router-dom";

const Fallback = ({ error }) => {
  return (
    <div role="alert">
      <h1>Something went wrong</h1>
      <pre><code>{error.message}</code></pre>
      <Link to="/">Go to home page</Link>
    </div>
  );
}

export default Fallback;