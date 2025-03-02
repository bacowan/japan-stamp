import StampDto from "@/database/dtos/stampDto";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface StampPageMapProps {
    stamp: StampDto
}

export default function StampPageMap({ stamp }: StampPageMapProps) {
    return (
        <MapContainer center={[stamp.lat, stamp.lon]} zoom={13} scrollWheelZoom={false}
            style={{"width": "500px", "height": "500px"}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[stamp.lat, stamp.lon]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}