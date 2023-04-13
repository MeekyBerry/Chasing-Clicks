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
    setCount(
      Object.values(clicksByLocation).reduce((acc, val) => acc + val, 0)
    );
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
        const [country, state] = place_name.split(",").reverse();
        setState(state);
        setCountry(country);
        setClicksByLocation({
          ...clicksByLocation,
          [place_name]: increasedCount,
        });
        if (map) {
          const popup = new mapboxgl.Popup().setHTML(place_name);
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map);
          map.flyTo({
            center: [longitude, latitude],
            essential: true,
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
    setCount(increasedCount);
  };

  return (
    <div className="click">
      <h1 className="click--title">Chasing D clicks</h1>
      {/* Conditionally render count */}
      {count > 0 && (
        <p className="click--text">
          I have been clicked{" "}
          <strong className="click--text__count">{count}</strong> times in
          total.
        </p>
      )}
      {/* Conditionally render state and country */}
      {state && country && (
        <p className="click--text">
          You clicked me from{" "}
          <strong className="click--text__location">{state},</strong>{" "}
          <strong className="click--text__location">{country}</strong>
          <span className="click--text__location__mark">!</span>
        </p>
      )}
      <button type="button" onClick={handleButtonClick} className="click--btn">
        Click Me
      </button>
      <div className="click--map">
        <div
          id="map"
          style={{ width: "100%", height: "100%", borderRadius: ".5rem" }}
        ></div>
      </div>
      {/* Conditionally render clicks by location */}
      {Object.keys(clicksByLocation).length > 0 && (
        <div className="click--locationCount">
          <h2 className="click--locationCount__head">Clicked Locations</h2>
          <ul className="click--locationCount__list">
            <li className="click--locationCount__list--container">
              <h2 className="click--locationCount__list--container__title">
                Locations
              </h2>
              <h2 className="click--locationCount__list--container__title">
                Clicks #
              </h2>
            </li>
            {Object.keys(clicksByLocation).map((location) => (
              <li key={location} className="click--locationCount__list__item">
                <p className="click--locationCount__list__item__location">
                  {location}
                </p>
                <p className="click--locationCount__list__item__count">
                  {clicksByLocation[location]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClickCounter;
