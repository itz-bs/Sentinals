import { useState } from 'react';
import StatCard from '../components/StatCard';
import { initialAlerts } from '../data';

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts.map(a => ({ ...a })));

  function ack(idx) {
    setAlerts(prev => prev.map((a, i) => i === idx ? { ...a, status: 'acknowledged' } : a));
  }

  const activeBanners = alerts.filter(a => a.status === 'critical');

  return (
    <div className="container">
      <div className="page-title">Leakage <span>Alerts Panel</span></div>

      {activeBanners.map((a, i) => (
        <div key={i} className="alert-banner" style={{ marginBottom: '0.75rem' }}>
          <div className="a-icon">🚨</div>
          <div>
            <div className="a-title">⚠️ Leakage Detected – Power Disconnected</div>
            <div className="a-sub">{a.poleId} · {a.location} · Voltage: {a.voltage}V · {a.time}</div>
          </div>
        </div>
      ))}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.25rem' }}>
        <StatCard color="red" icon="⚠️" value={alerts.filter(a => a.status === 'critical').length} label="Active Critical Alerts" />
        <StatCard color="orange" icon="🔌" value={alerts.filter(a => a.status === 'offline').length} label="Nodes Offline" />
        <StatCard color="green" icon="✅" value={alerts.filter(a => a.status === 'resolved').length} label="Resolved Today" />
      </div>

      <div className="card">
        <div className="card-title">Alert History</div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Time</th><th>Pole ID</th><th>Location</th><th>Voltage</th><th>GPS</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr key={i}>
                  <td>{a.time}</td>
                  <td><b>{a.poleId}</b></td>
                  <td>{a.location}</td>
                  <td style={{ color: a.voltage > 30 ? 'var(--red)' : a.voltage === null ? 'var(--yellow)' : 'var(--green)', fontWeight: a.voltage > 30 ? 700 : 400 }}>
                    {a.voltage !== null ? `${a.voltage}V` : 'N/A'}
                  </td>
                  <td style={{ fontSize: '0.72rem' }}>{a.lat.toFixed(4)}°N, {a.lng.toFixed(4)}°E</td>
                  <td>
                    <span className={`badge ${a.status === 'critical' ? 'critical' : a.status === 'offline' ? 'offline-b' : 'safe'}`}>
                      {a.status === 'acknowledged' ? 'ACKNOWLEDGED' : a.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {(a.status === 'critical' || a.status === 'offline') && (
                      <button className="btn btn-off" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }} onClick={() => ack(i)}>
                        Acknowledge
                      </button>
                    )}
                    {(a.status === 'resolved' || a.status === 'acknowledged') && (
                      <span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Event Log (Last 5)</div>
        <div className="log-list">
          <div className="log-item danger"><span className="log-time">10:45 AM</span><span>🔴 Leakage at Pole-03 (Main Street) – Power disconnected automatically</span></div>
          <div className="log-item warning"><span className="log-time">10:30 AM</span><span>⚠️ Pole-12 (Park Avenue) went offline – No response</span></div>
          <div className="log-item safe"><span className="log-time">10:15 AM</span><span>🟢 Pole-07 (Market Road) restored to normal operation</span></div>
          <div className="log-item danger"><span className="log-time">09:50 AM</span><span>🔴 High voltage 52V at Pole-18 (Station Road) – Power disconnected</span></div>
          <div className="log-item danger"><span className="log-time">08:20 AM</span><span>🔴 Leakage at Pole-20 (Bus Stand) – Emergency response notified</span></div>
        </div>
      </div>
    </div>
  );
}
