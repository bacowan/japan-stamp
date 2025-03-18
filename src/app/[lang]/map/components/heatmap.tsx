import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat"

interface HeatmapLayerProps {
    points: { lat: number, lon: number, weight: number }[];
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function toArrayOfLength(item: any, length: number) {
    return new Array(length).fill(item, 0);
}
  
export default function Heatmap({points}: HeatmapLayerProps) {
    const map = useMap();
    useEffect(() => {
      
      const heatLayer = L.heatLayer(
          points.flatMap(i => toArrayOfLength(i, i.weight)).map(p => [p.lon, p.lat, 1]),
          { maxZoom: 10, radius: 10 })
        .addTo(map);
  
      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map, points]);
    return null;
  }