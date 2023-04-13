//
import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "my token";

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
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${
            longitude + "," + latitude
          }.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const { place_name } = data.features[0];
        const [state, country] = place_name.split(",").reverse();
        setState(state);
        setCountry(country);
        setClicksByLocation({
          ...clicksByLocation,
          [place_name]: increasedCount,
        });
      },
      (error) => {
        console.error(error);
      }
    );
    setCount(increasedCount);
  };

  return (
    <div>
      <h1>Click Counter</h1>
      <p>
        You have clicked the button <strong>{count}</strong> times.
      </p>
      <p>
        Your last click was in <strong>{state}</strong>, <strong>{country}</strong>
      </p>
      <button onClick={handleButtonClick}>Click Me</button>
      <div id="map" style={{ width: "100%", height: "300px" }}></div>
      <h2>Clicks by Location</h2>
      <ul>
        {Object.entries(clicksByLocation).map(([location, clicks]) => (
          <li key={location}>
            {location}: {clicks}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClickCounter;