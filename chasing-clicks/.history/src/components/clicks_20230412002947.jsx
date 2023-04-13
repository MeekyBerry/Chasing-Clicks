// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useEffect, useState } from "react";
import ClickMap from "./map";

const ClickCounter = () => {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    fetch("/api/clicks")
      .then((res) => res.json())
      .then((data) => setClicks(data));
  }, []);

  const handleClick = () => {
    fetch("/api/clicks", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setClicks(data));
  };

  return (
    <div>
      <h1>Clicks</h1>
      <button onClick={handleClick}>Click</button>
      <p>Clicks: {clicks.length}</p>
      {/* <ClickMap clicks={clicks} /> */}
    </div>
  );
}

export default ClickCounter;
