import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA';

const ClickMap = ({ clicks }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.40);
  const [lat, setLat] = useState(37.78);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on('load', () => {
      // map.current.addSource('clicks', {
      //   type: 'geojson',
      //   data: {
      //     type: 'FeatureCollection',
      //     features: clicks.map((click) => ({
      //       type: 'Feature',
      //       geometry: {
      //         type: 'Point',
      //         coordinates: [click.longitude, click.latitude]
      //       }
      //     }))
      //   }
      // });

      map.current.addLayer({
        id: 'clicks',
        type: 'circle',
        source: 'clicks',
        paint: {
          'circle-radius': 6,
          'circle-color': '#007cbf'
        }
      });
    });
  });

  return (
    <div>
      <div className="sidebarStyle">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
}
export default ClickMap;