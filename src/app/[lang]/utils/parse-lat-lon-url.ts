export default function parseLatLonUrl(url: string): { lat: number, lon: number } | null {
  const [lon, lat] = url.split(",").map(x => parseFloat(x));
  if (!isNaN(lat) && !isNaN(lon)) {
    return { lat, lon };
  }
  else {
    return null;
  }
}