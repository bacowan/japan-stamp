import { useMapEvents } from "react-leaflet";

interface MapEventListenerProps {
    setZoomLevel?: (zoomLevel: number) => void,
    setLocation?: (location: {lat: number, lon: number}) => void
  }
  
  export default function MapEventListener({setZoomLevel, setLocation}: MapEventListenerProps) {
    const mapEvents = useMapEvents({
      zoomend: () => {
        if (setZoomLevel !== undefined) {
            setZoomLevel(mapEvents.getZoom());
        }
      },
      moveend: () => {
        if (setLocation !== undefined) {
            const center = mapEvents.getCenter()
            setLocation({lat: center.lat, lon: center.lng});
        }
      }
    });
  
    return null;
  }