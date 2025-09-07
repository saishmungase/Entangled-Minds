import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [points, setPoints] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (points.length < 2) {
          setPoints([...points, [e.latlng.lng, e.latlng.lat]]);
        }
      },
    });
    return null;
  }

  async function fetchRoutes() {
    if (points.length === 2) {
      const url = `https://router.project-osrm.org/route/v1/driving/${points[0][0]},${points[0][1]};${points[1][0]},${points[1][1]}?alternatives=true&overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();
      setRoutes(data.routes);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MapContainer center={[19.076, 72.8777]} zoom={12} style={{ flex: 1 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />

        {points.map((pos, i) => (
          <Marker key={i} position={[pos[1], pos[0]]} />
        ))}

        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={r.geometry.coordinates.map(([lng, lat]: any) => [lat, lng])}
            color={activeRoute === i ? "blue" : "gray"}
            weight={activeRoute === i ? 6 : 3}
          />
        ))}
      </MapContainer>

      <div style={{ width: "300px", padding: "10px", background: "#f8f8f8" }}>
        <button onClick={fetchRoutes} disabled={points.length < 2}>
          Show Routes
        </button>

        <ul>
          {routes.map((r, i) => (
            <li
              key={i}
              style={{
                cursor: "pointer",
                margin: "10px 0",
                fontWeight: activeRoute === i ? "bold" : "normal",
              }}
              onClick={() => setActiveRoute(i)}
            >
              Route {i + 1} - {(r.distance / 1000).toFixed(1)} km, {(r.duration / 60).toFixed(1)} mins
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
