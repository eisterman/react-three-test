import { type FormEvent, type RefObject, useState } from 'react';
import type { Rectangle } from '@/types.ts';
import { MapSelector } from '@/components/MapSelector.tsx';
import { useMapStore } from '@/stores/useMapStore.ts';

function PlaceDialog({ ref }: { ref: RefObject<HTMLDialogElement> }) {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);
  const setMapRectangle = useMapStore((state) => state.setMapRectangle);

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
      setMapRectangle(rectangle);
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

export default PlaceDialog;
