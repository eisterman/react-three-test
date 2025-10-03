import clsx from 'clsx';
import {
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMapEvents, useMap } from 'react-leaflet';
import * as L from 'leaflet';

type Location = {
  lat: number;
  lon: number;
};

type Rectangle = {
  south: number;
  north: number;
  east: number;
  west: number;
};

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

function MapSelector({ location, onRectangleSelect }: MapSelectorProps) {
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

export function PlaceDialog({ ref }: { ref: RefObject<HTMLDialogElement> }) {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);

  async function searchSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      );
      const data = await response.json();
      if (data.length > 0) {
        setLocation({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
      } else {
        alert('Address not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }

  function onSave() {
    console.log('SAVING');
    if (rectangle) {
      alert(`N ${rectangle.north} S ${rectangle.south} E ${rectangle.east} W ${rectangle.west}`);
    }
    ref.current.close();
  }

  return (
    <dialog ref={ref} className='modal'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
        </form>
        <h3 className='font-bold text-lg'>Select Place</h3>
        <p className='py-4'>
          Insert an address, search it, drag the map where you want with the proper zoom, press the
          green edit button, draw a rectangle and then confirm.
        </p>
        <form className={'flex flex-row gap-2 w-full'} onSubmit={searchSubmit}>
          <input
            type='text'
            placeholder='3, rue Docteur Huart, 59260 Lille, FR'
            className='input grow'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type='submit' className={'btn'} disabled={address === ''}>
            Search
          </button>
        </form>
        <div className={'w-full flex flex-col items-center my-8'}>
          {location !== null && (
            <MapSelector location={location} onRectangleSelect={setRectangle} />
          )}
        </div>
        <div className='modal-action'>
          <button type={'button'} className='btn' disabled={rectangle === null} onClick={onSave}>
            Save (todo)
          </button>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const placeDialog = useRef<HTMLDialogElement>(null!);
  return (
    <div className={clsx('bg-base-200', className)}>
      <div className={'flex flex-col items-center gap-2 my-2'}>
        <button className='btn btn-success' onClick={() => placeDialog.current.showModal()}>
          Select Place
        </button>
        <PlaceDialog ref={placeDialog} />
        <button className='btn btn-success'>Test</button>
      </div>
    </div>
  );
}
