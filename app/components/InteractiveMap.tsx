"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import { asondoData } from "@/lib/asondo-data";
import { useI18n } from "@/lib/i18n-context";

/**
 * Public demo polygon — same geometry as
 * `/public/demo-polygon.geojson`. Inlined here so the map renders it
 * without a second network round-trip; the public file remains the
 * canonical artefact for press / partner citation. The polygon is
 * intentionally fictional and labelled as such.
 *
 * We deliberately avoid importing the `geojson` types package — it
 * is not a direct project dependency and react-leaflet's `GeoJSON`
 * component accepts any structurally-correct GeoJSON object.
 */
const DEMO_POLYGON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Demo plot · Central basin",
        area_ha: 4.8,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-5.0285, 6.692],
            [-5.0162, 6.6948],
            [-5.0098, 6.7041],
            [-5.0135, 6.718],
            [-5.0273, 6.7195],
            [-5.0365, 6.7102],
            [-5.034, 6.6985],
            [-5.0285, 6.692],
          ],
        ],
      },
    },
  ],
} as const;

// Custom HQ icon (orange, gold accent)
function createHQIcon() {
  return L.divIcon({
    className: "custom-hq-icon",
    html: `
      <div style="position: relative; width: 36px; height: 44px;">
        <div style="
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #F2B83E 0%, #D4A017 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 6px 16px rgba(208, 107, 31, 0.4);
        "></div>
        <div style="
          position: absolute;
          inset: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #D06B1F;
          font-size: 11px;
        ">HQ</div>
      </div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

// Custom sourcing region icon (orange)
function createSourcingIcon() {
  return L.divIcon({
    className: "custom-sourcing-icon",
    html: `
      <div style="position: relative; width: 30px; height: 36px;">
        <div style="
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #E8833D 0%, #D06B1F 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2.5px solid white;
          box-shadow: 0 4px 12px rgba(208, 107, 31, 0.35);
        "></div>
        <div style="
          position: absolute;
          inset: 6px;
          background: white;
          border-radius: 50%;
          transform: rotate(-45deg);
        "></div>
      </div>`,
    iconSize: [30, 36],
    iconAnchor: [15, 36],
    popupAnchor: [0, -36],
  });
}

export default function InteractiveMap() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#FEF3E7] to-[#F4A866]/30 animate-pulse rounded-2xl" />
    );
  }

  // Center on Côte d'Ivoire
  const center: [number, number] = [7.4, -5.5];

  /*
   * Map every supplyZone to one of our four i18n bundle keys:
   *   - office  → "hq"
   *   - sourcing-region in order: 0 → central, 1 → eastern, 2 → western
   * This is order-stable: it follows the array layout in
   * `lib/asondo-data.ts` and never returns a missing translation.
   */
  type ZoneKey = "hq" | "central" | "eastern" | "western";
  const sourcingOrder: ZoneKey[] = ["central", "eastern", "western"];
  const zoneKeyByName = new Map<string, ZoneKey>();
  let sourcingIdx = 0;
  for (const zone of asondoData.supplyZones) {
    if (zone.type === "office") {
      zoneKeyByName.set(zone.name, "hq");
    } else if (zone.type === "sourcing-region") {
      const key = sourcingOrder[sourcingIdx] ?? "central";
      zoneKeyByName.set(zone.name, key);
      sourcingIdx += 1;
    }
  }

  // Pull the localised popup texts (region title, department line,
  // description paragraph) from the i18n bundle. Falls back to the
  // original asondoData copy if a key is somehow missing.
  const localized = (zone: (typeof asondoData.supplyZones)[number]) => {
    const key = zoneKeyByName.get(zone.name);
    if (!key) {
      return {
        region: zone.region,
        department: zone.department,
        description: zone.description,
      };
    }
    const tr = t.supply.zoneDetails[key];
    return {
      region: tr.region,
      department: tr.department,
      description: tr.description,
    };
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full rounded-2xl"
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {asondoData.supplyZones.map((zone) => {
          const isHQ = zone.type === "office";
          const loc = localized(zone);
          const accuracyLabel =
            zone.accuracy === "exact"
              ? t.supply.accuracy.exact
              : t.supply.accuracy.approximate;
          return (
            <div key={zone.name}>
              <Marker
                position={[zone.lat, zone.lng]}
                icon={isHQ ? createHQIcon() : createSourcingIcon()}
              >
                <Popup className="asondo-popup">
                  <div className="min-w-[220px] py-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isHQ ? "bg-[#F2B83E]" : "bg-[#E8833D]"
                        }`}
                      />
                      <h3 className="font-bold text-[#1A1A1A] text-sm m-0">
                        {loc.region}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6B7280] mb-2 m-0">
                      {loc.department}
                    </p>
                    <p className="text-xs text-[#4B5563] mb-2 m-0">
                      {loc.description}
                    </p>
                    <div
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: zone.accuracy === "exact" ? "#DCFCE7" : "#FEF3C7",
                        color: zone.accuracy === "exact" ? "#15803D" : "#B45309",
                      }}
                    >
                      {accuracyLabel}
                    </div>
                  </div>
                </Popup>
              </Marker>
              {zone.accuracy === "approximate" && (
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={60000}
                  pathOptions={{
                    color: "#E8833D",
                    fillColor: "#E8833D",
                    fillOpacity: 0.12,
                    weight: 2,
                    dashArray: "6 6",
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Public demo polygon — anonymised, intentionally fictional.
            The `as any` cast avoids depending on the `geojson` types
            package (not a direct project dep). Runtime shape is a
            valid RFC 7946 FeatureCollection. */}
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={DEMO_POLYGON as any}
          style={{
            color: "#1F3D2F",
            weight: 3,
            fillColor: "#F2B83E",
            fillOpacity: 0.35,
            dashArray: "4 4",
          }}
          onEachFeature={(feature, layer) => {
            const popupHtml = `
              <div style="min-width: 220px; padding: 4px 0;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                  <div style="width:8px; height:8px; border-radius:50%; background:#1F3D2F;"></div>
                  <h3 style="font-weight:700; color:#1A1A1A; font-size:14px; margin:0;">
                    ${t.supply.demoPolygon.title}
                  </h3>
                </div>
                <p style="font-size:12px; color:#4B5563; margin:0 0 8px 0; line-height:1.5;">
                  ${t.supply.demoPolygon.description}
                </p>
                <p style="font-size:11px; color:#6B7280; margin:0 0 10px 0; line-height:1.5; font-style:italic;">
                  ${t.supply.demoPolygon.area} : ${
              feature.properties?.area_ha ?? "4.8"
            } ha
                </p>
                <div style="
                  display:inline-flex; align-items:center; gap:6px;
                  padding:3px 10px; border-radius:9999px;
                  background:#1F3D2F; color:#F2B83E;
                  font-size:10px; font-weight:700;
                  text-transform:uppercase; letter-spacing:0.06em;
                ">
                  ${t.supply.demoPolygon.badge}
                </div>
              </div>`;
            layer.bindPopup(popupHtml, { className: "asondo-popup" });
          }}
        />
      </MapContainer>

      {/* Floating legend overlay — z-10 stays well below the Navbar (z-50). */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2.5 shadow-lg border border-[#E8833D]/15">
        <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
          {t.supply.legend}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#F2B83E] to-[#D4A017] border border-white shadow" />
          <span className="font-medium">{t.supply.headquarters}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#E8833D] to-[#D06B1F] border border-white shadow" />
          <span className="font-medium">{t.supply.sourcing}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
          <div className="w-3 h-3 rounded-sm bg-[#F2B83E] border border-[#1F3D2F] shadow" />
          <span className="font-medium">{t.supply.demoPolygon.legend}</span>
        </div>
      </div>
    </div>
  );
}
