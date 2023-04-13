// // // Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

// import React, { useState, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

// const Clicks = () => {
//   const [count, setCount] = useState(0);
//   const [map, setMap] = useState(null);
//   const [country, setCountry] = useState(null);
//   const [state, setState] = useState(null);
//   const [clicksByLocation, setClicksByLocation] = useState({});
//   const mapContainerRef = useRef(null);

//   const handleClick = () => {
//     const increasedCount = count + 1;
//     let country = "";
//     let state = "";
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const lngLat = [longitude, latitude];
//         // Save the user's location and click count to local storage
//         const location = JSON.stringify({
//           lngLat,
//           count: increasedCount,
//         });
//         localStorage.setItem("location", location);
//         // Center the map on the user's location
//         map.flyTo({
//           center: lngLat,
//           zoom: 15,
//         });
//         // Create a new marker at the user's location
//         new mapboxgl.Marker().setLngLat(lngLat).addTo(map);
//         // Reverse geo-code the user's location to get the country and state
//         const response = await fetch(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?proximity=ip&access_token=${mapboxgl.accessToken}`
//         );
//         const data = await response.json();
//         const features = data.features;
//         // Loop through the features to find the country and state
//         if (features && features.length > 0) {
//           for (let i = 0; i < features.length; i++) {
//             const feature = features[i];
//             const placeType = feature.place_type;
//             if (placeType.includes("country")) {
//               country = feature.text;
//             }
//             if (placeType.includes("region")) {
//               state = feature.text;
//             }
//           }
//         }
//         // Update the country and state elements
//         setCountry(country);
//         setState(state);
//         // Save the country and state to local storage
//         localStorage.setItem("country", country);
//         localStorage.setItem("state", state);
//         // Update the clicks by location object
//         // setClicksByLocation((prevState) => {
//         //   const newClicksByLocation = { ...prevState };
//         //   const key = `${country}-${state}`;
//         //   if (newClicksByLocation[key]) {
//         //     newClicksByLocation[key] = newClicksByLocation[key] + 1;
//         //   } else {
//         //     newClicksByLocation[key] = 1;
//         //   }
//         //   return newClicksByLocation;
//         // });
//         setClicksByLocation((prevClicks) => {
//           const key = `${country}, ${state}`;
//           const value = (prevClicks[key] || 0) + 1;
//           localStorage.setItem("clicksByLocation", JSON.stringify({
//             ...prevClicks,
//             [key]: value
//           }));
//           return {
//             ...prevClicks,
//             [key]: value
//           };
//         });
//       },
//       (error) => {
//         console.error(error);
//       }
//     );
//     setCount(increasedCount);
//   };

//   useEffect(() => {
//     // Retrieve the saved location and click count from local storage
//     const location = localStorage.getItem("location");
//     const storedCountry = localStorage.getItem("country");
//     const storedState = localStorage.getItem("state");
//     const clicksByLocation =
//       JSON.parse(localStorage.getItem("clicksByLocation")) || {};
//     setClicksByLocation(clicksByLocation);
//     if (location) {
//       const { lngLat, count } = JSON.parse(location);
//       setCount(count);
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v11",
//         center: lngLat,
//         zoom: 15,
//       });
//       new mapboxgl.Marker().setLngLat(lngLat).addTo(map);
//       setMap(map);
//     }
//     if (
//       storedCountry &&
//       storedState &&
//       storedCountry !== "undefined" &&
//       storedState !== "undefined"
//     ) {
//       setCountry(storedCountry);
//       setState(storedState);
//     } else {
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v11",
//         center: [-74.5, 40],
//         zoom: 9,
//       });
//       map.on("load", () => {
//         setMap(map);
//       });
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Clicks</h1>
//       <button onClick={handleClick}>Click Me</button>
//       {country && state && (
//         <p>
//           You clicked me from {state}, {country}.
//         </p>
//       )}
//       <div
//         ref={mapContainerRef}
//         className="map-container"
//         style={{ width: "200px", height: "200px" }}
//       />
//       <h2>Clicks By Location</h2>
//       <ul>
//         {Object.keys(clicksByLocation).map((key) => {
//           return (
//             <li key={key}>
//               {key}: {clicksByLocation[key]}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default Clicks;
// import { useState, useEffect } from "react";

// function ClickCounter() {
//   const [count, setCount] = useState(0);
//   const [location, setLocation] = useState("");
//   const [clicksByLocation, setClicksByLocation] = useState([]);

//   useEffect(() => {
//     const storedCount = localStorage.getItem("count");
//     if (storedCount) {
//       setCount(parseInt(storedCount));
//     }
//     const storedLocation = localStorage.getItem("location");
//     if (storedLocation) {
//       setLocation(storedLocation);
//     }
//     const storedClicksByLocation = localStorage.getItem("clicksByLocation");
//     if (storedClicksByLocation) {
//       setClicksByLocation(JSON.parse(storedClicksByLocation));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("count", count);
//   }, [count]);

//   useEffect(() => {
//     localStorage.setItem("location", location);
//   }, [location]);

//   useEffect(() => {
//     localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));
//   }, [clicksByLocation]);

//   const handleClick = async () => {
//     try {
//       const response = await fetch("https://geolocation-db.com/json/");
//       const data = await response.json();
//       const newLocation = `${data.city}, ${data.country_name}`;
//       if (newLocation === location) {
//         setCount((prevCount) => prevCount + 1);
//         const index = clicksByLocation.findIndex(
//           (item) => item.location === location
//         );
//         if (index !== -1) {
//           const newClicksByLocation = [...clicksByLocation];
//           newClicksByLocation[index].count += 1;
//           setClicksByLocation(newClicksByLocation);
//         } else {
//           setClicksByLocation((prevClicksByLocation) => [
//             ...prevClicksByLocation,
//             { location, count: 1 },
//           ]);
//         }
//       } else {
//         const index = clicksByLocation.findIndex(
//           (item) => item.location === newLocation
//         );
//         if (index !== -1) {
//           const newClicksByLocation = [...clicksByLocation];
//           newClicksByLocation[index].count += 1;
//           setClicksByLocation(newClicksByLocation);
//         } else {
//           setClicksByLocation((prevClicksByLocation) => [
//             ...prevClicksByLocation,
//             { location: newLocation, count: 1 },
//           ]);
//         }
//         setLocation(newLocation);
//         setCount(1);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <p>
//         Clicked {count} times
//       </p>
//       <button onClick={handleClick}>Click me</button>
//       <ul>
//         {clicksByLocation.map((item, index) => (
//           <li key={index}>
//             {item.location}: {item.count}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ClickCounter;

import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

const ClickCounter = () => {
  const [count, setCount] = useState(0);
  const [map, setMap] = useState(null);
  const [clicksByLocation, setClicksByLocation] = useState({});
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");


  useEffect(() => {
    const savedClicksByLocation = JSON.parse(localStorage.getItem("clicksByLocation"));
    if (savedClicksByLocation) {
      setClicksByLocation(savedClicksByLocation);
    }

    const initialLocation = { lng: -74.5, lat: 40 };
    // const savedLocation = JSON.parse(localStorage.getItem("location"));
    // if (savedLocation) {
    //   initialLocation.lng = savedLocation.lng;
    //   initialLocation.lat = savedLocation.lat;
    // }

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialLocation.lng, initialLocation.lat],
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
//     let country = "";
//     let state = "";
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const { place_name } = data.features[0];
        const [newState, newCountry] = place_name.split(", ");
        setState(newState);
        setCountry(newCountry);
        const newClicksByLocation = { ...clicksByLocation };
        const location = `${newState}, ${newCountry}`;
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

  //   try {
  //     const response = await fetch("https://api.ipify.org/?format=json");
  //     const data = await response.json();
  //     const ip = data.ip;
  //     const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
  //     const locationData = await locationResponse.json();

  //     const newClicksByLocation = { ...clicksByLocation };
  //     const location = `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
  //     if (newClicksByLocation[location]) {
  //       newClicksByLocation[location] += 1;
  //     } else {
  //       newClicksByLocation[location] = 1;
  //     }
  //     setClicksByLocation(newClicksByLocation);

  //     const popup = new mapboxgl.Popup().setHTML(location);

  //     new mapboxgl.Marker()
  //       .setLngLat([locationData.longitude, locationData.latitude])
  //       .setPopup(popup)
  //       .addTo(map);

  //     localStorage.setItem(
  //       "location",
  //       JSON.stringify({ lng: locationData.longitude, lat: locationData.latitude })
  //     );
  //   } catch (error) {
  //     console.error("There was an error fetching the location data. Please try again.")
  //   }
  // };

  return (
    <div>
      <p>Clicked {count} times</p>
      <button onClick={handleButtonClick}>Click me</button>
      {
        state && country && (
          <p>
            You are in {state}, {country}
          </p>
        )
      }
      <ul>
        {Object.keys(clicksByLocation).map((location) => (
          <li key={location}>
            {location}: {clicksByLocation[location]}
          </li>
        ))}
      </ul>
      <div id="map" style={{ width: "100%", height: "200px" }} />
    </div>
  );
};

export default ClickCounter;
