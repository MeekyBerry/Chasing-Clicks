// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

const ClickCounter = () => {
  const [count, setCount] = useState(() => {
    const value = localStorage.getItem("count");
    return value !== null ? JSON.parse(value) : 0;
  });
  const [state, setState] = useState(() => {
    const value = localStorage.getItem("state");
    return value !== null ? JSON.parse(value) : "";
  });
  const [country, setCountry] = useState(() => {
    const value = localStorage.getItem("country");
    return value !== null ? JSON.parse(value) : "";
  });
  const [clicksByLocation, setClicksByLocation] = useState(() => {
    const value = localStorage.getItem("clicksByLocation");
    return value !== null ? JSON.parse(value) : {};
  });
  const [map, setMap] = useState(null);

  useEffect(() => {
    const savedCount = JSON.parse(localStorage.getItem("count"));

    if (savedCount) {
      setCount(savedCount);
    }

    const savedState = JSON.parse(localStorage.getItem("state"));

    if (savedState) {
      setState(savedState);
    }

    const savedCountry = JSON.parse(localStorage.getItem("country"));

    if (savedCountry) {
      setCountry(savedCountry);
    }

    const savedClicksByLocation = JSON.parse(
      localStorage.getItem("clicksByLocation")
    );

    if (savedClicksByLocation) {
      setClicksByLocation(savedClicksByLocation);
    }

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });
    // const initialLocation = { lng: -74.5, lat: 40 };
    // const map = new mapboxgl.Map({
    //   container: "map",
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [initialLocation.lng, initialLocation.lat],
    //   zoom: 9,
    // });
    setMap(map);

    return () => map.remove();
  }, []);

  useEffect(() => {
    localStorage.setItem("count", JSON.stringify(count));
  }, [count]);

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem("country", JSON.stringify(country));
  }, [country]);

  useEffect(() => {
    localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));
  }, [clicksByLocation]);

  const handleButtonClick = async () => {
    const increasedCount = count + 1;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const features = data.features;
        // Loop through the features to find the country and state
        for (let i = 0; i < features.length; i++) {
          const feature = features[i];
          if (feature.place_type.includes("country")) {
            // setCountry(feature.text);
            const country = feature.text;
          }
          if (feature.place_type.includes("region")) {
            // setState(feature.text);
            const state = feature.text;
          }
        }
        setCountry(country);
        setState(state);

       const newClicksByLocation = { ...clicksByLocation };
        const location = `${state}, ${country}`;
        if (newClicksByLocation[location]) {
          newClicksByLocation[location] += 1;
        } else {
          newClicksByLocation[location] = 1;
        }
        setClicksByLocation(newClicksByLocation);

        const popup = new mapboxgl.Popup().setHTML(location);
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map);
        map.flyTo({
          center: [longitude, latitude],
          essential: true,
        });
      },
      () => {
        console.log("Error getting location");
      }
    );
    setCount(increasedCount);
  };

  return (
    <div>
      <p>Clicked {count} times</p>
      <button onClick={handleButtonClick}>Click me</button>
      {state && country && (
        <p>
          You are in {state}, {country}
        </p>
      )}
      <ul>
        {Object.keys(clicksByLocation).map((location) => (
          <li key={location}>
            {location}: {clicksByLocation[location]}
          </li>
        ))}
      </ul>
      <div id="map" style={{ width: "300px", height: "200px", margin: "0 auto" }} />
    </div>
  );
};

export default ClickCounter;
