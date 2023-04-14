// import "./App.css";
import React, { useEffect, useState } from "react";
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

    // Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number. show on the web page the distribution of clicks by geography with a map using ipapi


function App() {
  const [count, setCount] = useState(() => {
  const value = localStorage.getItem("count");
  return value !== null ? JSON.parse(value) : 0;
});

// const [clicksByLocation, setClicksByLocation] = useState(() => {
//   const value = localStorage.getItem("clicksByLocation");
//   return value !== null ? JSON.parse(value) : {};
// });

useEffect(() => {
  const savedCount = JSON.parse(localStorage.getItem("count"));

  if (savedCount) {
    setCount(savedCount);
  }

//   const savedClicksByLocation = JSON.parse(localStorage.getItem("clicksByLocation"));

//   if (savedClicksByLocation) {
//     setClicksByLocation(savedClicksByLocation);
//   }
}, []);

useEffect(() => {
  localStorage.setItem("count", JSON.stringify(count));

  // localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));
}, [count]);

const incrementCount = () => {
  setCount(count + 1);

  // fetch("https://ipapi.co/json/")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     const { country_name } = data;
  //     console.log(country_name);

      // setClicksByLocation({
      //   ...clicksByLocation,
      //   [country_name]: clicksByLocation[country_name] + 1 || 1,
      // });
    // }
  // );
};

return (
  <div className="app">
    <h1 className="click--text">Clicks: {count}</h1>
    <button onClick={incrementCount} className="click--btn">Click Me</button>
    {/* <h2>Clicks by Location</h2>
    <ul>
      {Object.keys(clicksByLocation).map((country) => (
        <li key={country}>
          {/* {country}: {clicksByLocation[country]} */}
        {/* </li> */}
      {/* // ))} */}
    {/* </ul>  */}
 </div>
);
}

export default App;
