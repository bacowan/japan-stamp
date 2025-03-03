import { useEffect } from "react";

export default function useLeaflet() {
    useEffect(() => {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        cssLink.crossOrigin = "";
        document.head.appendChild(cssLink);

        const jsLink = document.createElement("script");
        jsLink.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        jsLink.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        jsLink.crossOrigin = "";
        document.head.appendChild(jsLink);
    
        return () => {
            // Cleanup when unmounting
            document.head.removeChild(cssLink);
            document.head.removeChild(jsLink);
        };
    }, []);
}