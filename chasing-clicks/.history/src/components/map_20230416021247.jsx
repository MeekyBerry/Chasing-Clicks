// A web page with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number. show on the web page the distribution of clicks by geography with a map.

import { React, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import db from "../config";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";

//  steps
// onMount {useEffect}
// - fetch all clicks and clicked locations from firebase database
// - render map from mapbox
// store the results to a state variables
// onButtonClick
// - increment the count by 1
// - get the lng & lat from navigator.geo.location
// - store the result in a new variable 'location'
// - create a copy by spreading the initial state(state is an array) into a new array
// - send the object to firebase database
// Render
// - display results in jsx by mapping the the state
// - display total clicks by using the state.length
// - display all the clicked locations from the data base in list

const ClickCounterMap = () => {
  const [clickCount, setClickCount] = useState(0);
  const [clickedLocations, setClickedLocations] = useState([]);

  const [locationCounts, setLocationCounts] = useState({});
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Fetch previous total counts from firebase database
    db.collection("clicks")
      .doc("total")
      .get()
      .then((doc) => {
        setClickCount(doc.data().count);
      });
    // Fetch previous clicked locations from Firebase database
    db.collection("clicks")
      .get()
      .then((querySnapshot) => {
        const locations = [];
        querySnapshot.forEach((doc) => {
          locations.push(doc.data());
        });
        setClickedLocations(locations);
      });
       // Fetch previous locationCount from firebase database
    db.collection("locationCounts")
      .get()
      .then((querySnapshot) => {
        const locationCounts = {};
        querySnapshot.forEach((doc) => {
          locationCounts[doc.id] = doc.data().count;
        });
        setLocationCounts(locationCounts);
      });

    // Render a map from Mapbox
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 2,
    });
    setMap(map);

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl());
  }, []);

  const handleButtonClick = () => {
    // Increment the count by 1
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    // send the count to firebase
    db.collection("clicks")
      .doc("total")
      .set({
        count: newClickCount,
      })
      .then(() => {
        console.log("Total count successfully written!");
      })
      .catch((error) => {
        console.error("Error writing Total count: ", error);
      });
    // Get the lng & lat from navigator.geo.location
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      // Store the result in a new variable 'location'
      const location = {
        lng: longitude,
        lat: latitude,
      };
      // Get the clicked location state and country
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
          const state = data.features.find(
            (feature) => feature.place_type[0] === "region"
          ).text;
          const country = data.features.find(
            (feature) => feature.place_type[0] === "country"
          ).text;
          setState(state);
          setCountry(country);
         // create a key that combines the state and country values
          const locationKey = `${state}-${country}`;
          // check if the location already exists in the locationCounts dictionary
          if (locationKey in locationCounts) {
            // if it does, increment the count by 1
            const newCount = locationCounts[locationKey] + 1;
            // update the locationCounts dictionary
            setLocationCounts({
              ...locationCounts,
              [locationKey]: newCount,
            });
          } else {
            // if it doesn't, set the count to 1
            setLocationCounts({
              ...locationCounts,
              [locationKey]: 1,
            });
          }
          // send the locationCounts dictionary to firebase
          db.collection("locationCounts")
            .doc(locationKey)
            .set({
              count: locationCounts[locationKey],
            })
            .then(() => {
              console.log("Location Count successfully written!");
            })
            .catch((error) => {
              console.error("Error writing Location Count: ", error);
            });
          // Create a copy by spreading the initial state(state is an array) into a new array
          const newClickedLocations = [...clickedLocations];
          // Send the object to firebase database
          db.collection("clicks")
            .add({
              location,
              state,
              country,
            })
            .then((docRef) => {
              // Add the new location to the state
              newClickedLocations.push({
                id: docRef.id,
                ...location,
                state,
                country,
              });
              setClickedLocations(newClickedLocations);
            })
            .catch((error) => {
              console.error("Error adding clicked location: ", error);
            });

          // Add a marker to the map at the clicked location

        });
    });
  };

  return (
    <div>
      <h1>Click Counter</h1>
      <button onClick={handleButtonClick}>Click Me</button>
      <p>You have clicked {clickCount} times</p>
      <p>
        I have clicked in {Object.keys(locationCounts).length} different
        locations
      </p>
      <p>
        You clicked in {state} {country}
      </p>
      <h2>Clicked locations:</h2>
    <ul>
      {Object.keys(locationCounts).map((key) => {
        const [state, country] = key.split('-');
        const count = locationCounts[key];
        return (
          <li key={key}>
            {state}, {country} ({count})
          </li>
        );
      })}
    </ul>
      <div id="map" style={{ width: "250px", height: "300px" }}></div></div>
  );
}

export default ClickCounterMap;
