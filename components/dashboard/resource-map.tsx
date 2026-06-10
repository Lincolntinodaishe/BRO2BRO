"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapResource = {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  free: boolean;
  phone: string;
  hours: string;
};

interface ResourceMapProps {
  resources: MapResource[];
  selected: string | null;
  center: [number, number];
  onSelect: (id: string) => void;
  searchKey?: number;
}

const TYPE_COLORS: Record<string, string> = {
  clinic:     "#3b82f6",
  barbershop: "#f59e0b",
  mental:     "#8b5cf6",
  support:    "#0d9488",
  mentor:     "#10b981",
};

const TYPE_LABELS: Record<string, string> = {
  clinic:     "Clinic",
  barbershop: "Barbershop",
  mental:     "Mental Health",
  support:    "Support Group",
};

function pinIcon(color: string, active: boolean) {
  const s = active ? 40 : 32;
  const svg = `<svg width="${s}" height="${s}" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 24 16 24s16-13.333 16-24C32 7.163 24.837 0 16 0z"
      fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="16" cy="16" r="5.5" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize:   [s, s * 1.25],
    iconAnchor: [s / 2, s * 1.25],
    popupAnchor:[0, -(s * 1.25)],
  });
}

export default function ResourceMap({ resources, selected, center, onSelect, searchKey }: ResourceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markersRef   = useRef<Record<string, L.Marker>>({});
  const userDotRef   = useRef<L.Marker | null>(null);

  /* ── initialise map once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Carto Voyager — clean, modern tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    /* user location dot */
    const pulseStyle =
      "width:16px;height:16px;background:#3b82f6;border-radius:50%;" +
      "border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.25);";
    const userDot = L.marker(center, {
      icon: L.divIcon({
        html: `<div style="${pulseStyle}"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup("<b>Your location</b>");

    userDotRef.current = userDot;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      userDotRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── move user dot + re-centre when center changes ── */
  useEffect(() => {
    mapRef.current?.setView(center, 13, { animate: true });
    userDotRef.current?.setLatLng(center);
  }, [center]);

  /* ── sync resource markers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const incomingIds = new Set(resources.map((r) => r.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!incomingIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    resources.forEach((r) => {
      const isActive = r.id === selected;
      const color    = TYPE_COLORS[r.type] ?? "#6b7280";
      const icon     = pinIcon(color, isActive);

      if (markersRef.current[r.id]) {
        markersRef.current[r.id].setIcon(icon);
      } else {
        const marker = L.marker([r.lat, r.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:190px;font-family:system-ui,sans-serif;line-height:1.45">
              <p style="font-weight:700;margin:0 0 2px;font-size:13px;color:#111">${r.name}</p>
              <p style="font-size:11px;color:#6b7280;margin:0 0 3px">${r.address}, ${r.city}</p>
              <p style="font-size:11px;color:#374151;margin:0 0 6px">🕐 ${r.hours}</p>
              <div style="display:flex;gap:4px;align-items:center;margin-bottom:8px">
                ${r.free ? '<span style="background:#dcfce7;color:#166534;font-size:10px;padding:2px 7px;border-radius:99px;font-weight:600">Free</span>' : ""}
              </div>
              <div style="display:flex;gap:6px">
                <a href="tel:${r.phone}" style="flex:1;text-align:center;padding:5px 0;background:#f3f4f6;border-radius:7px;font-size:11px;color:#111;text-decoration:none;font-weight:600">📞 Call</a>
                <a href="/dashboard/appointments" style="flex:1;text-align:center;padding:5px 0;background:#111;border-radius:7px;font-size:11px;color:#fff;text-decoration:none;font-weight:600">Book</a>
              </div>
            </div>`,
            { maxWidth: 230 }
          )
          .on("click", () => onSelect(r.id));
        markersRef.current[r.id] = marker;
      }
    });
  }, [resources, selected, onSelect]);

  /* ── fit bounds to all markers after each new search ── */
  useEffect(() => {
    if (!searchKey) return;
    const map = mapRef.current;
    if (!map) return;
    const positions = Object.values(markersRef.current).map((m) => m.getLatLng());
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds([center, ...positions]), {
        padding: [48, 48],
        maxZoom: 14,
        animate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  /* ── pan to selected marker ── */
  useEffect(() => {
    if (!selected || !mapRef.current) return;
    const marker = markersRef.current[selected];
    if (marker) {
      mapRef.current.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [selected]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: 360 }}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Legend overlay */}
      <div
        className="absolute bottom-8 left-3 bg-white/95 rounded-xl shadow border border-gray-100 p-2.5 flex flex-col gap-1.5 pointer-events-none"
        style={{ zIndex: 800 }}
      >
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              style={{ background: TYPE_COLORS[key] }}
              className="w-2.5 h-2.5 rounded-full shrink-0"
            />
            <span className="text-xs text-gray-700 leading-none">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
