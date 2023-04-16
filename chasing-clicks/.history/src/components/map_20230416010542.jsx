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
}

export default ClickCounterMap;
