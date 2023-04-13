// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

  
mapboxgl.accessToken =
"pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

const Clicks = () => {
const [count, setCount] = useState(() => {
  const storedCount = localStorage.getItem("count");
  return storedCount ? JSON.parse(storedCount) : 0;
});

const handleClick = () => {
  const newCount = count + 1;
  setCount(newCount);
  localStorage.setItem("count", JSON.stringify(newCount));
};

const [map, setMap] = useState(null);
const [clicksByLocation, setClicksByLocation] = useState(() => {
  const storedClicksByLocation = localStorage.getItem("clicksByLocation");
  return storedClicksByLocation ? JSON.parse(storedClicksByLocation) : {};
});

const mapContainerRef = useRef(null);

useEffect(() => {
  // Set up the map and add a marker on the saved location
  const location = JSON.parse(localStorage.getItem("location"));
  if (location) {
    const { lngLat } = location;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: lngLat,
      zoom: 15,
    });
    new mapboxgl.Marker().setLngLat(lngLat).addTo(map);
    setMap(map);
  } else {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });
    map.on("load", () => {
      setMap(map);
    });
  }
}, []);

useEffect(() => {
  // Add a click event listener to the map and update the state and local storage
  if (map) {
    const onMapClick = async (e) => {
      const { lng, lat } = e.lngLat;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const features = data.features;
      // Find the country and state from the response
      let country = "";
      let state = "";
      if (features && features.length > 0) {
        features.forEach((feature) => {
          if (feature.place_type.includes("country")) {
            country = feature.text;
          }
          if (feature.place_type.includes("region")) {
            state = feature.text;
          }
        });
      }
      // Update the clicksByLocation object
      const newClicksByLocation = {
        ...clicksByLocation,
        [`${country}, ${state}`]: clicksByLocation[`${country}, ${state}`]
          ? clicksByLocation[`${country}, ${state}`] + 1
          : 1,
      };
      setClicksByLocation(newClicksByLocation);
      localStorage.setItem(
        "clicksByLocation",
        JSON.stringify(newClicksByLocation)
      );
    };

    map.on("click", onMapClick);
    return () => map.off("click", onMapClick);
  }
}, [map, clicksByLocation]);

useEffect(() => {
  // Update the local storage when the count state changes
  localStorage.setItem("count", JSON.stringify(count));
}
, [count]);

return (
  <div>
    <div>
      <button onClick={handleClick}>Click Me</button>
      <p>Click count: {count}</p>
    </div>
    <div>
      <p>Clicks by location:</p>
      <ul>
        {Object.keys(clicksByLocation).map((key) => (
          <li key={key}>
            {key}: {clicksByLocation[key]}
          </li>
        ))}
      </ul>
    </div>
    <div ref={mapContainerRef} className="map-container" />
  </div>
);
};

export default Clicks;
