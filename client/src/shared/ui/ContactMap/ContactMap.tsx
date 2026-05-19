"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { fixLeafletIcons } from "@/shared/lib/fixLeafletIcons";
import "leaflet/dist/leaflet.css";
import "./ContactMap.css";

const OFFICE = {
  lat: 55.7558,
  lng: 37.6173,
  label: "г. Москва, ул. Пушкина, д. Колотушкина",
};

export function ContactMap() {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="contact-map">
      <MapContainer
        center={[OFFICE.lat, OFFICE.lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="contact-map__canvas"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[OFFICE.lat, OFFICE.lng]}>
          <Popup>{OFFICE.label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
