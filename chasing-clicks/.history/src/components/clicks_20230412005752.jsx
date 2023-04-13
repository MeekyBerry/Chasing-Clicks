// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useEffect, useState } from "react";
import ClickMap from "./map";

const ClickCounter = () => {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const storedClicks = JSON.parse(localStorage.getItem("clicks"));
    if (storedClicks) setClicks(storedClicks);
  }

  const handleClick = () => {
    const newClick = {
      latitude: 37.78,
      longitude: -122.40,
      
}

export default ClickCounter;
