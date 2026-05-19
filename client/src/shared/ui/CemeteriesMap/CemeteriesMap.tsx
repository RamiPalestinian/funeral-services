"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { fixLeafletIcons } from "@/shared/lib/fixLeafletIcons";
import { MOSCOW_CEMETERIES, type CemeteryPoint } from "./data";
import "leaflet/dist/leaflet.css";
import "./CemeteriesMap.css";

const MAP_POSITIONS = MOSCOW_CEMETERIES.map(
  (cemetery) => [cemetery.lat, cemetery.lng] as [number, number],
);

function FitBounds() {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(L.latLngBounds(MAP_POSITIONS), { padding: [36, 36] });
  }, [map]);

  return null;
}

function FocusCemetery({ cemeteryId }: { cemeteryId: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!cemeteryId) {
      return;
    }

    const cemetery = MOSCOW_CEMETERIES.find((item) => item.id === cemeteryId);
    if (!cemetery) {
      return;
    }

    map.flyTo([cemetery.lat, cemetery.lng], 14, { duration: 0.8 });
  }, [cemeteryId, map]);

  return null;
}

type CemeteryMarkerProps = {
  cemetery: CemeteryPoint;
  isActive: boolean;
  onSelect: (id: string) => void;
};

function CemeteryMarker({ cemetery, isActive, onSelect }: CemeteryMarkerProps) {
  const markerRef = useRef<LeafletMarker>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    markerRef.current?.openPopup();
  }, [isActive]);

  return (
    <Marker
      ref={markerRef}
      position={[cemetery.lat, cemetery.lng]}
      eventHandlers={{
        click: () => onSelect(cemetery.id),
      }}
    >
      <Popup>
        <strong>{cemetery.name}</strong>
        <br />
        {cemetery.district}
      </Popup>
    </Marker>
  );
}

export function CemeteriesMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="cemeteries-map-section">
      <div className="cemeteries-map">
        <MapContainer
          center={[55.7558, 37.6173]}
          zoom={10}
          scrollWheelZoom={false}
          className="cemeteries-map__canvas"
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds />
          <FocusCemetery cemeteryId={selectedId} />
          {MOSCOW_CEMETERIES.map((cemetery) => (
            <CemeteryMarker
              key={cemetery.id}
              cemetery={cemetery}
              isActive={selectedId === cemetery.id}
              onSelect={setSelectedId}
            />
          ))}
        </MapContainer>
      </div>

      <ul className="cemeteries-map-list">
        {MOSCOW_CEMETERIES.map((cemetery) => (
          <li key={cemetery.id}>
            <button
              type="button"
              className={`cemeteries-map-list__button${
                selectedId === cemetery.id ? " is-active" : ""
              }`}
              aria-pressed={selectedId === cemetery.id}
              onClick={() => setSelectedId(cemetery.id)}
            >
              <span>{cemetery.name}</span>
              <small>{cemetery.district}</small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
