// import "./App.css";
import React, { useState } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import ErrorFallback from "./components/fallback";
// import ClickCounter from "./components/clicks";
import "../src/styles/main.css";

// function App() {
//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <div className="app">
//         <ClickCounter />
//       </div>
//     </ErrorBoundary>
//   );
// }

// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.


function App() {
  const [count, setCount] = useState(() => {
  const value = localStorage.getItem("count");
  return value !== null ? JSON.parse(value) : 0;
});

const [clicksByLocation, setClicksByLocation] = useState(() => {
  const value = localStorage.getItem("clicksByLocation");
  return value !== null ? JSON.parse(value) : {};
});



}

export default App;
