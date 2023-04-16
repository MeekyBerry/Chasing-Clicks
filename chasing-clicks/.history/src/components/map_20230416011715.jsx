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

  useEffect(() => {
    // Fetch total counts and previous clicked locations from Firebase database
    db.collection('clicks').get().then((querySnapshot) => {
      const locations = [];
      querySnapshot.forEach((doc) => {
        locations.push(doc.data());
      });
      setClickedLocations(locations);
    });
     // Render a map from Mapbox
     const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    });
  }, []);

  const handleButtonClick = () => {
    // Increment the count by 1
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Get the lng & lat from navigator.geo.location
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;

      // Store the result in a new variable 'location'
      const location = {
        lng: longitude,
        lat: latitude
      };
      // Get the clicked location state and country
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
        //   const { place_name } = data.features[0];
        //   const location = {
        //     lng: longitude,
        //     lat: latitude,
        //     place_name
        //   };
        const state = data.features.find((feature) => feature.place_type[0] === 'region').text;
        const country = data.features.find((feature) => feature.place_type[0] === 'country').text;

        // Create a copy by spreading the initial state(state is an array) into a new array
        const newClickedLocations = [...clickedLocations];
        //   const newClickedLocations = [...clickedLocations, location];
        //   // Send the object to firebase database
        db.collection('clicks').add({
          location,
          state,
          country
        })
        .then((docRef) => {
          // Add the new location to the state
          newClickedLocations.push({
            id: docRef.id,
            ...location,
            state,
            country
          });
          setClickedLocations(newClickedLocations);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      }).catch((error) => {
        console.error('Error fetching location: ', error);
      });
    });
  };

  return (
    <div>
      <h1>Click Counter Map</h1>
      <button onClick={handleButtonClick}>Click Me</button>
      <p>You have clicked {clickCount} times</p>
      <p>Clicked location: {clickedLocations.length > 0 && `${clickedLocations[clickedLocations.length - 1].state}, ${clickedLocations[clickedLocations.length - 1].country}`}</p>
      <ul>
        {/* {clickedLocations.map((clickedLocation) => {
          return (
            <li key={clickedLocation}>{clickedLocation.state}, {clickedLocation.country}</li>
          );
        })} */}
        {{Object.keys(
          clickedLocations.reduce((acc, clickedLocation) => {
            if (!acc[clickedLocation.state]) {
              acc[clickedLocation.state] = {
                state: clickedLocation.state,
                country: clickedLocation.country,
                count: 1
              };
            } else {
              acc[clickedLocation.state].count += 1;
            }
            return acc;
          }, {})
        ).map((key) => {
          const clickedLocation = clickedLocations[key];
          return (
            <li key={clickedLocation.state}>
              {clickedLocation.state}, {clickedLocation.country} - {clickedLocation.count}
            </li>
          );
        }
        )
        }
      </ul>
      <div id="map" style={{ width: '200px', height: '300px' }}></div>
    </div>
  );
  }

export default ClickCounterMap;
