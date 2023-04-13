// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

const Clicks = () => {
  const [clickCount, setClickCount] = useState(0);
  const [map, setMap] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const mapContainerRef = useRef(null);

  // const handleClick = () => {
  //   if (!map) {
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       const lngLat = [longitude, latitude];

  //       // Center the map on the user's location
  //       map.flyTo({
  //         center: lngLat,
  //         zoom: 15,
  //       });

  //       // Create a new marker at the user's location
  //       new mapboxgl.Marker().setLngLat(lngLat).addTo(map);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );

  //   setClickCount(clickCount + 1);
  // };
  const handleClick = () => {
    if (!map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const lngLat = [longitude, latitude];

        // Center the map on the user's location
        map.flyTo({
          center: lngLat,
          zoom: 15,
        });

        // Create a new marker at the user's location
        new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

        // Reverse geocode the user's location to get the country and state
    // const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl}`);
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?proximity=ip&access_token=${mapboxgl.accessToken}`);
        const data = await response.json();

        const features = data.features;
        let country = '';
        let state = '';

        // Loop through the features to find the country and state
        if (features && features.length > 0) {
          

        // Update the country and state elements
        setCountry(country);
        setState(state);
      },
      (error) => {
        console.error(error);
      }
    );

    setClickCount(clickCount + 1);
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });

    map.on("load", () => {
      setMap(map);
    });

    return () => map.remove();
  }, []);

  // useEffect(() => {
  //   // Initialize the map
  //   const newMap = new mapboxgl.Map({
  //     container: "map",
  //     style: "mapbox://styles/mapbox/streets-v11",
  //     center: [-74.5, 40],
  //     zoom: 9,
  //   });
  //   // Set the map state variable
  //   setMap(newMap);
  //   console.log(newMap);
  //   // Clean up the map when the component unmounts
  //   return () => {
  //     newMap.remove();
  //   };
  // }, []);

  return (
    <div>
      {/* <button onClick={handleClick}>Click me</button>
      <p>Click count: {clickCount}</p>
      <div
        id="map"
        style={{ height: "300px", width: "300px", margin: "0 auto" }}
      ></div> */}
  <div>
    <button onClick={handleClick}>Click me!</button>
    <p>Click count: {clickCount}</p>
    {country && state && (
      <p>
        You are in {state}, {country}.
      </p>
    )}
    <div ref={mapContainerRef} className="map-container" />
  </div>
    </div>
  );
};

export default Clicks;
