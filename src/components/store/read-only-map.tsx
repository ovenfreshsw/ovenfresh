"use client";

import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { haversine } from "@/lib/utils";

// Store icon
const storeIcon = new L.Icon({
    iconUrl: "/leaflet/store.svg", // put this in public/
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

// Fix default icon paths for Leaflet when using Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
});

// Disable all map interaction and fit to bounds
function FitBoundsAndDisableMap({ points }: { points: LatLngExpression[] }) {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
        map.scrollWheelZoom.disable();
    }, [map, points]);

    return null;
}

export default function ReadOnlyMap({
    storeLocation,
    addressLocation,
}: {
    storeLocation: LatLngExpression;
    addressLocation: LatLngExpression;
}) {
    const [secondPin, setSecondPin] = useState<LatLngExpression | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!addressLocation) return;
        const lat = (addressLocation as number[])[0];
        const lng = (addressLocation as number[])[1];
        if (!isNaN(lat) && !isNaN(lng)) {
            setSecondPin([lat, lng]);
        }
    }, [addressLocation]);

    const distance =
        secondPin &&
        haversine(
            (storeLocation as [number, number])[0],
            (storeLocation as [number, number])[1],
            (secondPin as [number, number])[0],
            (secondPin as [number, number])[1]
        ).toFixed(2);

    if (!mounted) return null; // 👈 prevent hydration mismatch

    return (
        <div>
            <div
                style={{
                    height: "500px",
                    width: "100%",
                    position: "relative",
                    zIndex: 0,
                }}
            >
                <MapContainer
                    center={storeLocation}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitBoundsAndDisableMap
                        points={
                            secondPin
                                ? [storeLocation, secondPin]
                                : [storeLocation]
                        }
                    />

                    <Marker position={storeLocation} icon={storeIcon}>
                        <Popup>Store</Popup>
                    </Marker>
                    {secondPin && (
                        <Marker position={secondPin}>
                            <Popup>Delivery Point</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            {secondPin && (
                <p style={{ marginTop: "1rem" }}>
                    📏 Distance from store to delivery point:{" "}
                    <strong>{distance} km</strong>
                </p>
            )}
        </div>
    );
}
