import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import * as L from 'leaflet';
import { FeatureGroup, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { Rectangle, Location } from '@/types.ts';
import clsx from 'clsx';

type MapSelectorProps = {
  location: Location;
  onRectangleSelect: (bounds: Rectangle) => void;
};

interface DrawHandlerProps {
  onRectangleSelect: (bounds: Rectangle) => void;
  isDrawingMode: boolean;
}

function DrawHandler({ onRectangleSelect, isDrawingMode }: DrawHandlerProps) {
  const [currentRectangle, setCurrentRectangle] = useState<L.Rectangle | null>(null);

  useMapEvents({
    mousedown(e) {
      // Skip if not in drawing mode
      if (!isDrawingMode) return;

      const mapInstance = e.target as L.Map;
      mapInstance.dragging.disable();

      const startLatLng = e.latlng;
      const rect = L.rectangle(
        [
          [startLatLng.lat, startLatLng.lng],
          [startLatLng.lat, startLatLng.lng],
        ],
        {
          color: 'red',
          weight: 2,
          opacity: 0.7,
        },
      );

      // Remove previous rectangle
      if (currentRectangle) {
        mapInstance.removeLayer(currentRectangle);
      }
      mapInstance.addLayer(rect);
      setCurrentRectangle(rect);

      let endLatLng = startLatLng;

      // Update on move
      const handleMouseMove = (e: L.LeafletMouseEvent) => {
        endLatLng = e.latlng;
        rect.setBounds([
          [startLatLng.lat, startLatLng.lng],
          [endLatLng.lat, endLatLng.lng],
        ]);
      };

      // Finish on up
      const handleMouseUp = () => {
        mapInstance.off('mousemove', handleMouseMove);
        mapInstance.off('mouseup', handleMouseUp);
        mapInstance.dragging.enable();

        const bounds = rect.getBounds();
        onRectangleSelect({
          south: bounds.getSouth(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      };

      mapInstance.on('mousemove', handleMouseMove);
      mapInstance.on('mouseup', handleMouseUp);
    },
  });

  return null;
}

// Custom Leaflet control for the drawing mode button
const DrawingModeControl = ({
  isDrawingMode,
  setIsDrawingMode,
}: {
  isDrawingMode: boolean;
  setIsDrawingMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control({ position: 'topright' }); // Position like zoom control

    control.onAdd = () => {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const button = L.DomUtil.create('a', 'leaflet-draw-toggle', container);
      button.href = '#';
      button.title = isDrawingMode ? 'Exit Drawing Mode' : 'Enter Drawing Mode';
      button.innerHTML = isDrawingMode ? '📏' : '✏️'; // Icons for drawing/editing
      button.style.backgroundColor = isDrawingMode ? '#ff6b6b' : '#4CAF50';
      button.style.color = 'white';
      button.style.padding = '0px';
      button.style.borderRadius = '4px';

      L.DomEvent.on(button, 'click', L.DomEvent.stopPropagation).on(button, 'mousedown', () => {
        setIsDrawingMode((prev) => !prev);
      });

      return container;
    };

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map, isDrawingMode, setIsDrawingMode]);

  return null;
};

export function MapSelector({ location, onRectangleSelect }: MapSelectorProps) {
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  return (
    <div className={clsx('h-[400px] w-[400px]', isDrawingMode && 'select-none')}>
      <MapContainer
        className={'h-full w-full'}
        center={[location.lat, location.lon]}
        zoom={13}
        dragging={!isDrawingMode} // Enable dragging only when NOT in drawing mode
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FeatureGroup>
          <DrawHandler onRectangleSelect={onRectangleSelect} isDrawingMode={isDrawingMode} />
        </FeatureGroup>
        <DrawingModeControl isDrawingMode={isDrawingMode} setIsDrawingMode={setIsDrawingMode} />
      </MapContainer>
    </div>
  );
}
