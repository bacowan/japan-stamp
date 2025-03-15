import StampDto from "@/database/dtos/stampDto";
import { Map } from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

interface MapEventWrapperProps {
    onMapViewChanged: (e: MapViewValues) => void
}

function getMapViewValues(map: Map): MapViewValues {
    const center = map.getCenter();
    return {
        center: {
            lat: center.lat,
            lon: center.lng
        },
        zoom: map.getZoom()
    }
}

function MapEventWrapper({ onMapViewChanged }: MapEventWrapperProps) {
    const map = useMapEvents({
        zoomend: e => {
            onMapViewChanged(getMapViewValues(map));
        },
        moveend: e => {
            onMapViewChanged(getMapViewValues(map));
        }
    });
    return null;
}

interface StampPageMapProps {
    initialMapViewValues: MapViewValues,
    onMapViewChanged: (e: MapViewValues) => void,
    stamps: StampDto[]
}

export interface MapViewValues {
    center: { lat: number, lon: number },
    zoom: number
}

export default function MapPageMap({ initialMapViewValues, onMapViewChanged, stamps }: StampPageMapProps) {
    const stampMarkers = stamps.map(s => <Marker key={s.id} position={[s.lat, s.lon]}/>);
    return (<div className="w-full h-full p-2 flex flex-col items-center">
        <MapContainer center={[initialMapViewValues.center.lat, initialMapViewValues.center.lon]} zoom={initialMapViewValues.zoom} scrollWheelZoom={false}
            className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stampMarkers}
            <MapEventWrapper onMapViewChanged={onMapViewChanged}/>
        </MapContainer>
    </div>)
}