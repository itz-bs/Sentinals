import { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initialPoles } from '../data';

function FlyTo({ lat, lng, id, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 17);
      setTimeout(() => markerRefs.current[id]?.openPopup(), 400);
    }
  }, [lat, lng, id, map, markerRefs]);
  return null;
}

function makeIcon(status) {
  const cls = status === 'safe' ? 'pin-safe' : status === 'danger' ? 'pin-danger' : 'pin-offline';
  const lbl = status === 'safe' ? '✓' : status === 'danger' ? '!' : '?';
  return L.divIcon({ className: '', html: `<div class="custom-pin ${cls}">${lbl}</div>`, iconSize: [32, 32], iconAnchor: [16, 16] });
}

export default function LiveMap() {
  const [params] = useSearchParams();
  const flyLat = parseFloat(params.get('lat'));
  const flyLng = parseFloat(params.get('lng'));
  const flyId = params.get('id');
  const markerRefs = useRef({});

  const faultNodes = initialPoles.filter(n => n.status !== 'safe');

  return (
    <div className="container">
      <div className="page-title">Live <span>GPS Map</span></div>

      <div className="sys-bar" style={{ marginBottom: '1.25rem' }}>
        <div className="sys-main">
          <div className="sys-dot danger" />
          <div><div className="sys-label">MAP STATUS</div><div className="sys-val danger">3 FAULT LOCATIONS ACTIVE</div></div>
        </div>
        <div className="refresh-info"><div className="spin" />Auto-refresh 2s</div>
      </div>

      <div className="card">
        <div className="card-title">GPS Location Monitoring</div>
        <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: 520, width: '100%', borderRadius: 10, border: '1px solid var(--border)' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="© OpenStreetMap © CARTO" maxZoom={19} />
          {!isNaN(flyLat) && <FlyTo lat={flyLat} lng={flyLng} id={flyId} markerRefs={markerRefs} />}
          {initialPoles.map(n => {
            const stColor = n.status === 'safe' ? '#22c55e' : n.status === 'danger' ? '#ef4444' : '#f97316';
            const stTxt = n.status === 'safe' ? 'SAFE' : n.status === 'danger' ? 'LEAKAGE' : 'OFFLINE';
            return (
              <Marker key={n.id} position={[n.lat, n.lng]} icon={makeIcon(n.status)}
                ref={el => { if (el) markerRefs.current[n.id] = el; }}>
                <Popup>
                  <div className="p-title">📍 {n.id}</div>
                  <div className="p-row">Location: <b>{n.loc}</b></div>
                  <div className="p-row">Voltage: <b style={{ color: n.status === 'danger' ? '#ef4444' : '#22c55e' }}>{n.voltage}V</b></div>
                  <div className="p-row">GPS: <b>{n.lat.toFixed(4)}°N, {n.lng.toFixed(4)}°E</b></div>
                  <div style={{ marginTop: 6, display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: `${stColor}22`, color: stColor, border: `1px solid ${stColor}55` }}>{stTxt}</div>
                </Popup>
                {n.status === 'danger' && <Circle center={[n.lat, n.lng]} radius={200} color="#ef4444" fillColor="#ef4444" fillOpacity={0.08} />}
              </Marker>
            );
          })}
        </MapContainer>
        <div className="map-legend">
          <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />Safe Node</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--red)', boxShadow: '0 0 6px var(--red)' }} />Leakage Detected</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--orange)' }} />Node Offline</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Fault Summary</div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Pole ID</th><th>Location</th><th>Voltage</th><th>GPS</th><th>Status</th></tr></thead>
            <tbody>
              {faultNodes.map(n => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.loc}</td>
                  <td style={{ color: n.status === 'danger' ? 'var(--red)' : 'var(--yellow)', fontWeight: 700 }}>{n.voltage > 0 ? `${n.voltage}V` : 'N/A'}</td>
                  <td>{n.lat.toFixed(4)}°N, {n.lng.toFixed(4)}°E</td>
                  <td><span className={`badge ${n.status === 'danger' ? 'critical' : 'offline-b'}`}>{n.status === 'danger' ? 'LEAKAGE' : 'OFFLINE'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
