// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [clicksByLocation, setClicksByLocation] = useState({});
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Reverse geo-code the user's location to get the country and state
    if (map) {
      map.on("click", async (e) => {
        const { lng, lat } = e.lngLat;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const features = data.features;
        // Loop through the features to find the country and state
        let newCountry = null;
        let newState = null;
        if (features && features.length > 0) {
          features.forEach((feature) => {
            if (feature.place_type.includes("country")) {
              newCountry = feature.text;
            }
            if (feature.place_type.includes("region")) {
              newState = feature.text;
            }
          });
        }
        // Save the location and click count to local storage
        localStorage.setItem(
          "location",
          JSON.stringify({ lngLat: [lng, lat], count })
        );
        localStorage.setItem("country", newCountry);
        localStorage.setItem("state", newState);
        // Update the state
        setCountry(newCountry);
        setState(newState);
        // Update the click count for the location
        const newClicksByLocation = {
          ...clicksByLocation,
          [`${newCountry}, ${newState}`]: count,
        };
        setClicksByLocation(newClicksByLocation);
        localStorage.setItem(
          "clicksByLocation",
          JSON.stringify(newClicksByLocation)
        );
      });
    }
  }, [map, count, clicksByLocation]);

  useEffect(() => {
    // Retrieve the saved location and click count from local storage
    const location = localStorage.getItem("location");
    const storedCountry = localStorage.getItem("country");
    const storedState = localStorage.getItem("state");
    const clicksByLocation =
      JSON.parse(localStorage.getItem("clicksByLocation")) || {};
    setClicksByLocation(clicksByLocation);
    if (location) {
      const { lngLat } = JSON.parse(location);
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
    if (
      storedCountry &&
      storedState &&
      storedCountry !== "undefined" &&
      storedState !== "undefined"
    ) {
      setCountry(storedCountry);
      setState(storedState);
    }
  }, []);

  return (
    <div>
      <h1>Clicks</h1>
      <h2>
        I have been clicked {count} times.
      </h2>
      <button onClick={handleClick}>Click Me</button>
      {country && state && (
        <p>
          You clicked me from {state}, {country}.
        </p>
      )}
      <div
        ref={mapContainerRef}
        className="map-container"
        style={{ width: "200px", height: "200px" }}
      />
      <h2>Clicks By Location</h2>
      <ul>
        {Object.keys(clicksByLocation).map((key) => {
          return (
            <li key={key}>
              {key}: {clicksByLocation[key]}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Clicks;
