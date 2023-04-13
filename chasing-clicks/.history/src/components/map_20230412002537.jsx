import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA';

const ClickMap = ({ clicks }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 1
    });

    map.on('load', () => {
      map.addSource('clicks', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: clicks.map((click) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [click.longitude, click.latitude]
            }
          }))
        }
      });

      map.addLayer({
        id: 'clicks',
        type: 'circle',
        source: 'clicks',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222'
        }
      });

      map.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        })
      );

      setMap(map);
      return () => map.remove();
    });
  }, [clicks]);

  return <div className="map-container" ref={mapContainer} />;
}

export default ClickMap;