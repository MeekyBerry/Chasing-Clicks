import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA';

const ClickMap = ({ clicks }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const handleMapLoad = (e) => {
    setMap(e.target);
  }
}

export default ClickMap;