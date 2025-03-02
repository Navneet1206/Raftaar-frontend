import React, { useState, useEffect, useContext } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { SocketContext } from '../context/SocketContext';

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: -33.8688, lng: 151.2195 });
  const { socket } = useContext(SocketContext);

  // Get initial geolocation from the browser.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  // Listen for live location updates via socket.
  useEffect(() => {
    if (socket) {
      socket.on('captain-location-update', location => {
        setCurrentPosition({ lat: location.ltd, lng: location.lng });
      });
      return () => {
        socket.off('captain-location-update');
      };
    }
  }, [socket]);

  return (
    <div style={{ width: '100%', height: '80%' }}>
      <Map
        height={400}
        center={[currentPosition.lat, currentPosition.lng]}  // Updated here
        defaultZoom={15}
      >
        {() => (
          <Marker
            anchor={[currentPosition.lat, currentPosition.lng]}
            payload={1}
          />
        )}
      </Map>
    </div>
  );
};

export default LiveTracking;
