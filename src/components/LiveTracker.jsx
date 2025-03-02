import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';

const fetchRoute = async (source, destination) => {
  const start = `${source.lng},${source.ltd || source.lat}`;
  const end = `${destination.lng},${destination.ltd || destination.lat}`;
  // Use overview=full to get complete route geometry
  const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;
  console.log("OSRM URL:", url);
  const response = await fetch(url);
  const data = await response.json();
  if (data.routes && data.routes.length > 0) {
    // OSRM returns coordinates in [lng, lat] format; reverse them.
    return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
  } else {
    throw new Error('No route found');
  }
};

const LiveTracker = ({ sourceCoords, destinationCoords }) => {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (sourceCoords && destinationCoords) {
      fetchRoute(sourceCoords, destinationCoords)
        .then(coords => {
          console.log("Route coordinates:", coords);
          setRouteCoords(coords);
        })
        .catch(err => console.error("Error fetching route:", err));
    }
  }, [sourceCoords, destinationCoords]);

  // Use source coordinates for initial map center; fallback to [0,0]
  const initialCenter =
    sourceCoords && (sourceCoords.ltd || sourceCoords.lat)
      ? [sourceCoords.ltd || sourceCoords.lat, sourceCoords.lng]
      : [0, 0];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Ensure the map has a defined height */}
      <Map height={400} defaultCenter={initialCenter} defaultZoom={14}>
        {({ width, height, latLngToPx }) => (
          <>
            {/* Source Marker */}
            {sourceCoords && (
              <Marker
                anchor={[sourceCoords.ltd || sourceCoords.lat, sourceCoords.lng]}
                payload={1}
              />
            )}
            {/* Destination Marker */}
            {destinationCoords && (
              <Marker
                anchor={[
                  destinationCoords.ltd || destinationCoords.lat,
                  destinationCoords.lng
                ]}
                payload={2}
              />
            )}
            {/* Draw route polyline if coordinates exist */}
            {routeCoords.length > 0 && (
              <svg
                width={width}
                height={height}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              >
                <polyline
                  points={routeCoords
                    .map(coord => {
                      const { x, y } = latLngToPx(coord);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="blue"
                  strokeWidth="4"
                />
              </svg>
            )}
          </>
        )}
      </Map>
    </div>
  );
};

export default LiveTracker;
