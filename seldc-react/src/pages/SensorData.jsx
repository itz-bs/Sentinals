import { useState, useEffect } from 'react';
import { THRESHOLD } from '../data';

const initSensors = [
  { id: 'Pole-03', loc: 'Main Street, Block A', voltage: 65, body: 62, status: 'leakage', lat: 12.9716, lng: 77.5946 },
  { id: 'Pole-18', loc: 'Station Road, Block D', voltage: 52, body: 48, status: 'leakage', lat: 12.9650, lng: 77.5850 },
  { id: 'Pole-20', loc: 'Bus Stand, Block B', voltage: 38, body: 35, status: 'leakage', lat: 12.9700, lng: 77.5900 },
  { id: 'Pole-01', loc: 'MG Road', voltage: 0, body: 0, status: 'safe', lat: 12.9850, lng: 77.5800 },
  { id: 'Pole-07', loc: 'Market Road, Block B', voltage: 0, body: 0, status: 'safe', lat: 12.9700, lng: 77.6100 },
  { id: 'Pole-11', loc: 'BTM Layout', voltage: 0, body: 0, status: 'safe', lat: 12.9450, lng: 77.6150 },
];

function initHistory() {
  return Array(12).fill(0).map(() => ({
    v03: 55 + Math.floor(Math.random() * 20),
    v18: 45 + Math.floor(Math.random() * 15),
    v20: 30 + Math.floor(Math.random() * 15),
  }));
}

export default function SensorData() {
  const [sensors, setSensors] = useState(initSensors.map(s => ({ ...s })));
  const [history, setHistory] = useState(initHistory);
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  useEffect(() => {
    const id = setInterval(() => {
      setSensors(prev => prev.map(s => {
        if (s.status !== 'leakage') return s;
        const v = Math.floor(30 + Math.random() * 45);
        return { ...s, voltage: v, body: v - Math.floor(Math.random() * 5) };
      }));
      setHistory(prev => {
        const next = [...prev.slice(1)];
        next.push({ v03: 0, v18: 0, v20: 0 }); // will be updated below
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setHistory(prev => {
      const next = [...prev.slice(0, -1), { v03: sensors[0].voltage, v18: sensors[1].voltage, v20: sensors[2].voltage }];
      return next;
    });
  }, [sensors]);

  const jsonFeed = sensors.filter(s => s.status === 'leakage').map(s => ({
    pole_id: s.id, voltage: s.voltage, status: s.status,
    location: `${s.lat},${s.lng}`, timestamp: new Date().toISOString()
  }));

  return (
    <div className="container">
      <div className="page-title">Real-Time <span>Sensor Data</span></div>

      <div className="sys-bar" style={{ marginBottom: '1.25rem' }}>
        <div className="sys-main">
          <div className="sys-dot danger" />
          <div><div className="sys-label">SENSOR STATUS</div><div className="sys-val danger">3 SENSORS ABOVE THRESHOLD (30V)</div></div>
        </div>
        <div className="refresh-info"><div className="spin" />Auto-refresh 2s</div>
      </div>

      <div className="card">
        <div className="card-title">Live Voltage Chart – All Faulty Poles</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Threshold: <b style={{ color: 'var(--red)' }}>30V</b></span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Pole-03: <b style={{ color: 'var(--red)' }}>{sensors[0].voltage}V</b></span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Pole-18: <b style={{ color: 'var(--red)' }}>{sensors[1].voltage}V</b></span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Pole-20: <b style={{ color: 'var(--red)' }}>{sensors[2].voltage}V</b></span>
        </div>
        <div className="chart-wrap">
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 2 }}>
              <div className="bar b-danger" style={{ height: `${(h.v03 / 100) * 100}%` }} title={`Pole-03: ${h.v03}V`} />
              <div className="bar b-danger" style={{ height: `${(h.v18 / 100) * 100}%`, opacity: 0.7 }} title={`Pole-18: ${h.v18}V`} />
              <div className="bar b-danger" style={{ height: `${(h.v20 / 100) * 100}%`, opacity: 0.5 }} title={`Pole-20: ${h.v20}V`} />
            </div>
          ))}
        </div>
      </div>

      <div className="sensor-grid">
        {sensors.map(s => {
          const vColor = s.voltage > THRESHOLD ? 'var(--red)' : 'var(--green)';
          return (
            <div key={s.id} className="sensor-card" style={{ borderTop: `3px solid ${s.voltage > THRESHOLD ? 'var(--red)' : 'var(--green)'}` }}>
              <h3>📍 {s.id} – {s.loc}</h3>
              <div className="s-row"><span style={{ color: 'var(--text2)' }}>Voltage Detected</span><span className="s-val" style={{ color: vColor }}>{s.voltage}V</span></div>
              <div className="s-row"><span style={{ color: 'var(--text2)' }}>Pole Body Voltage</span><span className="s-val" style={{ color: vColor }}>{s.body}V</span></div>
              <div className="s-row"><span style={{ color: 'var(--text2)' }}>Threshold</span><span className="s-val" style={{ color: 'var(--text2)' }}>30V</span></div>
              <div className="s-row"><span style={{ color: 'var(--text2)' }}>Leakage Status</span><span className="s-val" style={{ color: vColor }}>{s.voltage > THRESHOLD ? '⚠️ DETECTED' : '✅ SAFE'}</span></div>
              <div className="s-row"><span style={{ color: 'var(--text2)' }}>GPS</span><span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{s.lat.toFixed(4)}°N, {s.lng.toFixed(4)}°E</span></div>
              <div className="s-row"><span style={{ color: 'var(--text2)' }}>Updated</span><span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{now}</span></div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">Raw API Feed – /api/data</div>
        <pre style={{ background: 'var(--card2)', borderRadius: 8, padding: '1rem', fontSize: '0.75rem', color: 'var(--green)', overflowX: 'auto', lineHeight: 1.6, border: '1px solid var(--border)' }}>
          {JSON.stringify(jsonFeed, null, 2)}
        </pre>
      </div>
    </div>
  );
}
