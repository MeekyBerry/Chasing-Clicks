// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// const ClickCounter = () => {
//   const [clickCount, setClickCount] = useState(
//     parseInt(localStorage.getItem("clickCount")) || 0
//   );

//   useEffect(() => {
//     localStorage.setItem("clickCount", clickCount);
//   }, [clickCount]);

//   const handleClick = () => {
//     setClickCount(clickCount + 1);
//   };

//   useEffect(() => {
//     Mapboxgl.accessToken =
//       "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";
//     const map = new Mapboxgl.Map({
//       container: "map",
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [6.2, 6.2],
//       zoom: 9,
//     });

//     // Get the location data of the clicks
//     // Replace 'your-geolocation-api-here' with the URL of your geolocation API
//     fetch(
//       "https://api.mapbox.com/geocoding/v5/mapbox.places/Asaba%20nigeria.json?proximity=ip&access_token=pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA")
//       .then((response) => response.json())
//       .then((data) => {
//         if (!Array.isArray(data)) {
//           data = [data];
//         }
//         // Create a marker for each location
//         data.forEach((location) => {
//           if (location.lat && location.lng) {
//             new Mapboxgl.Marker().setLngLat([location.lng, location.lat]).addTo(map);
//           } else {
//             console.log("Invalid location data:", location);
//           }
//         });
//       });
//   }, []);

//   return (
//     <>
//       <h1>Chasing the Clicks</h1>
//       <button onClick={handleClick}>Click me!</button>
//       <p>Click count: {clickCount}</p>
//       <div id="map" style={{ width: "300px", height: "200px" }}></div>
//     </>
//   );
// };

// export default ClickCounter;

mapboxgl.accessToken = "your-mapbox-access-token-here";

const Clicks = () => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });

    map.on("click", function (event) {
      // Retrieve the click location data from the event object
      const { lng, lat } = event.lngLat;

      // Create a new marker at the click location
      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

      // Update the click count state
      setClickCount(clickCount + 1);
    });
  }, [clickCount]);

  return (
    <div>
      <button onClick={() => setClickCount(clickCount + 1)}>Click me</button>
      <p>Click count: {clickCount}</p>
      <div id="map" style={{ height: "400px" }}></div>
    </div>
  );
};

export default Clicks;

