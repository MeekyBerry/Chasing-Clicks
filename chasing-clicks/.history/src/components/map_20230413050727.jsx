import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useEffect, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA';

const ClickMap = () => {
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
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });
    setMap(map);

    return () => map.remove();
  }, []);

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem("country", JSON.stringify(country));
  }, [country]);

  useEffect(() => {
    localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));
  }, [clicksByLocation]);

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
      const [state, country] = place_name.split(", ");
      setState(state);
      setCountry(country);
      const newClicksByLocation = {
        ...clicksByLocation,
        [place_name]: (clicksByLocation[place_name] || 0) + 1,
      };
      setClicksByLocation(newClicksByLocation);
      if (map) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          `You have clicked ${newClicksByLocation[place_name]} times here`
        );
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map);
        map.flyTo({
          center: [longitude, latitude],
          essential: true,
        });
      }},
    (error) => {
      console.log(error);
    }
  );

  return (
    <div>
      {/* Conditionally render state and country */}
      {state && country && (
        <p>I was just clicked in <strong>{state}</strong>, <strong>{country}</strong>.</p>
      )}
      <div id="map" style={{ width: "100%", height: "400px" }} />
    </div>
    {
      
    }

}
export default ClickMap;