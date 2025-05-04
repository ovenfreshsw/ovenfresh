"use client";

import { Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import LocationMarker from "./location-marker";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type MapProps = {
    position: number[] | null;
    points: LatLngExpression[];
    setPoints: React.Dispatch<React.SetStateAction<LatLngExpression[]>>;
    onLineSet?: (line: {
        start: [number, number];
        end: [number, number];
    }) => void;
};

// Fix default icon paths for Leaflet when using Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
});

const Map = ({ position, points, setPoints, onLineSet }: MapProps) => {
    const handleMapClick = (e: any) => {
        if (position === null) {
            return;
        }
        const newPoint: LatLngExpression = [e.latlng.lat, e.latlng.lng];

        if (points.length < 1) {
            setPoints([newPoint]);
        } else if (points.length === 1) {
            const updated = [...points, newPoint];
            setPoints(updated);
            if (onLineSet) {
                onLineSet({
                    start: updated[0] as [number, number],
                    end: updated[1] as [number, number],
                });
            }
        } else {
            // Reset on third click
            setPoints([newPoint]);
        }
    };

    return (
        <>
            <MapClickHandler onClick={handleMapClick} />
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} />
            {points.map((pos, idx) => (
                <Marker key={idx} position={pos} />
            ))}
            {points.length === 2 && (
                <Polyline positions={points} color="blue" />
            )}
        </>
    );
};

const RenderMap = ({ position, points, setPoints, onLineSet }: MapProps) => {
    const [MapViewer, setMapViewer] = useState<React.ComponentType | null>(
        null
    );

    useEffect(() => {
        import("react-leaflet").then((mod) => {
            setMapViewer(() => mod.MapContainer);
        });
    }, []);
    return MapViewer ? (
        // @ts-expect-error: MapViewer is not defined
        <MapViewer
            center={(position as [number, number]) || [43.7764, -79.2318]}
            zoom={13}
            style={{
                height: "100%",
                width: "100%",
            }}
            dragging={position !== null}
            touchZoom={position !== null}
            scrollWheelZoom={position !== null}
            doubleClickZoom={position !== null}
            boxZoom={position !== null}
            keyboard={position !== null}
            zoomControl={position !== null}
        >
            <Map
                position={position}
                points={points}
                setPoints={setPoints}
                onLineSet={onLineSet}
            />
        </MapViewer>
    ) : (
        <div className="h-full flex justify-center items-center">
            <p>Loading Map...</p>
        </div>
    );
};

export default dynamic(() => Promise.resolve(RenderMap), {
    ssr: false,
});

function MapClickHandler({ onClick }: { onClick: (e: any) => void }) {
    useMapEvents({
        click(e) {
            onClick(e);
        },
    });
    return null;
}
