import L from "leaflet";
import { renderToString } from "react-dom/server";
import { Marker } from "react-leaflet";

function NumberedCircle( { value }: { value: number }) {
    // tailwind doesn't work with the stringified html
    return <div style={{ display: "flex", justifyContent: "center", textAlign: "center", background: "blue", color: "white", fontWeight: "bold", border: "2px solid white" }}>
      {value}
    </div>
  }

interface PrefectureMarkerProps {
    value: number,
    lat: number,
    lon: number
}

export default function PrefectureMarker({ value, lat, lon }: PrefectureMarkerProps) {
    const test = <NumberedCircle value={value}/> //TODO: This is where the number of stamps should appear
    const icon = L.divIcon({
      html: renderToString(test),
      className: '', // We do not want any additional styles applied by default
      iconSize: [30, 30], // Size of the icon (can be adjusted)
      iconAnchor: [15, 15], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -15], // Point from which the popup should open relative to the iconAnchor
    });
    return <Marker position={[lat, lon]} icon={icon}></Marker>
}