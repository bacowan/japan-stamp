import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat"

interface HeatmapLayerProps {
    points: {lat: number, lon: number}[];
  }
  
export default function Heatmap({points}: HeatmapLayerProps) {
    const map = useMap();
    useEffect(() => {
      const heatLayer = (L as any).heatLayer(points.map(p => [p.lat, p.lon, 1]), { maxZoom: 10, radius: 10 }).addTo(map);
  
      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map, points]);
    return null;
  }