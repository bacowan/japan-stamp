
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapRecenter({coords, resetCoords}: {coords: {lat: number, lon: number} | null, resetCoords: () => void}) {
    const map = useMap();
    useEffect(() => {
        if (coords !== null) {
            map.setView([coords.lat, coords.lon], 18);
            resetCoords();
        }
    }, [coords, map, resetCoords]);
    return null;
}