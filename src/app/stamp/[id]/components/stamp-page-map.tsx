import StampDto from "@/database/dtos/stampDto";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface StampPageMapProps {
    stamp: StampDto
}

export default function StampPageMap({ stamp }: StampPageMapProps) {
    return (<div className="w-full p-2 flex flex-col items-center">
        <MapContainer center={[stamp.lat, stamp.lon]} zoom={13} scrollWheelZoom={false}
            className="w-full max-w-2xl aspect-square">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[stamp.lat, stamp.lon]}/>
        </MapContainer>
    </div>)
}