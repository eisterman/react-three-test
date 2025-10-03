import clsx from 'clsx';
import {
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMapEvents } from 'react-leaflet';
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
  setLocation: Dispatch<SetStateAction<Location | null>>;
};

interface DrawHandlerProps {
  onRectangleSelect: (bounds: Rectangle) => void;
}

function DrawHandler({ onRectangleSelect }: DrawHandlerProps) {
  const [currentRectangle, setCurrentRectangle] = useState<L.Rectangle | null>(null);

  useMapEvents({
    mousedown(e) {
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

function MapSelector({ location, setLocation }: MapSelectorProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  function onRectangleSelect(rec: Rectangle) {
    console.log('RECTANGLE SELECT');
    console.log(rec);
  }
  return (
    <div style={{ height: '400px', width: '400px' }}>
      {' '}
      {/* Adjust size as needed */}
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FeatureGroup ref={featureGroupRef}>
          <DrawHandler onRectangleSelect={onRectangleSelect} />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}

export function PlaceDialog({ ref }: { ref: RefObject<HTMLDialogElement> }) {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

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

  return (
    <dialog ref={ref} className='modal'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
        </form>
        <h3 className='font-bold text-lg'>Select Place</h3>
        <p className='py-4'>Insert an address, search it and then adjust the map.</p>
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
        {location !== null && <MapSelector location={location} setLocation={setLocation} />}
        <div className='modal-action'>
          <form method='dialog'>
            <button className='btn'>Close</button>
          </form>
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
