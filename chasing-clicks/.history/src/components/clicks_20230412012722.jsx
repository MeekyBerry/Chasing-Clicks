// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const ClickCounter = () => {
  const [clickCount, setClickCount] = useState(
    parseInt(localStorage.getItem("clickCount")) || 0
  );

  useEffect(() => {
    localStorage.setItem("clickCount", clickCount);
  }, [clickCount]);

  const handleClick = () => {
    setClickCount(clickCount + 1);
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 9,
    });

    // Get the location data of the clicks
    // Replace 'your-geolocation-api-here' with the URL of your geolocation API
    fetch(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/30%20Rockefeller%20Plaza.json?proximity=ip&access_token=pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA")
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          data = [data];
        }
        // Create a marker for each location
        data.forEach((location) => {
          if (location.lat && location.lng) {
            new mapboxgl.Marker().setLngLat([location.lng, location.lat]).addTo(map);
          } else {
            console.log("Invalid location data:", location);
          }
        });
      });
  }, []);

  return (
    <>
      <h1>Chasing the Clicks</h1>
      <button onClick={handleClick}>Click me!</button>
      <p>Click count: {clickCount}</p>
      <div id="map" style={{ width: "300px", height: "200px" }}></div>
    </>
  );
};

export default ClickCounter;
