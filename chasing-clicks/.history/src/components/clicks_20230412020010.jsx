// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

const Clicks = () => {
  const [clickCount, setClickCount] = useState(0);
  const [map, setMap] = useState(null);

  const handleClick = (event) => {
    // Retrieve the click location data from the event object
    const { clientX, clientY } = event;
    const { offsetLeft, offsetTop } = event.target;
    const lngLat = map.unProject([clientX - offsetLeft, clientY - offsetTop]);

    // Create a new marker at the click location
    new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

    // Update the click count state
    setClickCount(clickCount + 1);
  };

  const handleMapLoad = () => {
    setMap(
      new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-74.5, 40],
        zoom: 9,
      })
    );
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <p>Click count: {clickCount}</p>
      <div id="map" style={{ height: "400px" }} onLoad={handleMapLoad}></div>
    </div>
  );
};

export default Clicks;
