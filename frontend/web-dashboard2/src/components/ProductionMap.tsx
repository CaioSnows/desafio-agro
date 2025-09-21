// src/components/ProductionMap.tsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Uf } from '../services/api';
import { ufCoordinates } from '../data/coordenadas';
import L from 'leaflet'; 

const customIcon = L.icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
    iconSize:     [40, 41], 
    iconAnchor:   [12, 41], 
    popupAnchor:  [1, -34],
    shadowSize:   [41, 41]
});

interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  selectedUf: Uf | null;
}

export const ProductionMap: React.FC<MapProps> = React.memo(({ selectedUf}) => {
  const initialPosition: [number, number] = [-14.23, -51.92]; 
  const ufPosition = selectedUf ? ufCoordinates[selectedUf.id] : null;

  return (
    <MapContainer center={initialPosition} zoom={4} style={{ height: '100%', width: '100%' }}>
      <TileLayer
      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    />
      
      {ufPosition && <ChangeView center={ufPosition} zoom={7} />}

      {ufPosition && selectedUf && (
        <Marker position={ufPosition} icon={customIcon}>
          <Popup>
            {selectedUf.nome}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
});