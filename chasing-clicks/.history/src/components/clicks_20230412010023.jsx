// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useEffect, useState } from "react";
import ClickMap from "./map";

const ClickCounter = () => {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const storedClicks = JSON.parse(localStorage.getItem("clicks"));
    if (storedClicks) setClicks(storedClicks);
  },[])

  const handleClick = (e) => {
    const newClick = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      timestamp: Date.now()
    };
    setClicks([...clicks, newClick]);
    localStorage.setItem("clicks", JSON.stringify([...clicks, newClick]));
  };

  return (
    <div>
      <h1>Click Counter</h1>
      <button onClick={handleClick}>Click Me</button>
      <p>Clicks: {clicks.length}</p>
      <ClickMap clicks={clicks} />
    </div>
  );
}

export default ClickCounter;
