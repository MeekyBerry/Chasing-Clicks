// Error Boundary fall component
import React from "react";

const Fallback = ({ error }) => {
  return (
    <div role="alert" style={{ margin: "auto auto" }}>
      <h1 style={{ color: "red" }}>Something went wrong</h1>
      <pre>
        <code>{error.message}</code>
      </pre>
    </div>
  );
};

export default Fallback;
