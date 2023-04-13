// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

const Clicks = () => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });

    map.on("click", function (e) {
      // Retrieve the click location data from the event object
      const { lng, lat } = e.lngLat;

      // Create a new marker at the click location
      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

      // Update the click count state
      setClickCount(clickCount + 1);
      console.log(e.lngLat)
    });
  }, [clickCount]);

  // reset count and map button function
  const reset = () => {
    setClickCount(0);
    window.location.reload();
  };

  return (
    <div>
      <button onClick={() => setClickCount(clickCount + 1)}>Click me</button>
      <p>Click count: {clickCount}</p>
      <button onClick={reset}>Reset</button>
      <div id="map" style={{ height: "300px", width: "300" }}></div>
    </div>
  );
};

export default Clicks;
