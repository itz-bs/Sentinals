import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import PoleCard from '../components/PoleCard';
import Toast from '../components/Toast';
import usePoles from '../hooks/usePoles';
import useThingSpeak from '../hooks/useThingSpeak';
import { WX_ICONS, WX_DESC, fmtTime } from '../data';

export default function Dashboard() {
  const { poles, logs, toast, sendPowerCmd } = usePoles();
  const { data: ts } = useThingSpeak();
  const [clock, setClock] = useState(new Date());
  const [loc, setLoc] = useState({ name: 'Detecting...', coords: '--°N, --°E' });
  const [wx, setWx] = useState({ icon: '🌡️', temp: 'Loading...', desc: 'Fetching weather...' });

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setLoc({ name: 'Location unavailable', coords: 'Enable location access' }); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      setLoc(l => ({ ...l, coords: `${lat}°N, ${lng}°E` }));
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(r => r.json()).then(d => {
          const city = d.address.city || d.address.town || d.address.village || d.address.county || 'Unknown';
          setLoc(l => ({ ...l, name: `${city}${d.address.state ? ', ' + d.address.state : ''}` }));
        }).catch(() => setLoc(l => ({ ...l, name: 'Location Detected' })));
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
        .then(r => r.json()).then(d => {
          const w = d.current_weather;
          setWx({ icon: WX_ICONS[w.weathercode] || '🌡️', temp: `${w.temperature}°C  |  Wind ${w.windspeed} km/h`, desc: WX_DESC[w.weathercode] || 'Clear' });
        }).catch(() => setWx({ icon: '🌡️', temp: 'Weather unavailable', desc: 'Allow location for weather' }));
    }, () => setLoc({ name: 'Location unavailable', coords: 'Enable location access' }));
  }, []);

  const leaking = poles.filter(p => p.status === 'leakage');
  const offline = poles.filter(p => p.status === 'offline');
  const active = poles.filter(p => p.status !== 'offline').length;
  const safe = poles.filter(p => p.status === 'safe').length;
  const hasFault = leaking.length > 0;

  return (
    <div className="container">
      <div className="page-title">System <span>Overview</span></div>

      {/* DateTime / Location / Weather Bar */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🕐</span>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.5px' }}>
                {clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
                {clock.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📍</span>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{loc.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>{loc.coords}</div>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{wx.icon}</span>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{wx.temp}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>{wx.desc}</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="spin" />Live Updates
        </div>
      </div>

      {/* System Status Bar */}
      <div className="sys-bar">
        <div className="sys-main">
          <div className={`sys-dot ${hasFault ? 'danger' : 'safe'}`} />
          <div>
            <div className="sys-label">SYSTEM STATUS</div>
            <div className={`sys-val ${hasFault ? 'danger' : 'safe'}`}>
              {hasFault ? `⚠️ LEAKAGE DETECTED – ${leaking.length} POLE(S)` : 'ALL SYSTEMS NORMAL'}
            </div>
          </div>
        </div>
        <div className="sys-meta">
          <div className="sys-meta-item">Active Nodes <b>{active}</b></div>
          <div className="sys-meta-item">Leakage Alerts <b style={{ color: 'var(--red)' }}>{leaking.length}</b></div>
          <div className="sys-meta-item">Offline <b style={{ color: 'var(--orange)' }}>{offline.length}</b></div>
          <div className="sys-meta-item">Last Sync <b>{fmtTime(new Date())}</b></div>
        </div>
        <div className="refresh-info"><div className="spin" />Auto-refresh 2s</div>
      </div>

      {/* Alert Banner */}
      {hasFault && (
        <div className="alert-banner">
          <div className="a-icon">🚨</div>
          <div>
            <div className="a-title">⚠️ Leakage Detected – Power Disconnected</div>
            <div className="a-sub">{leaking.map(p => `${p.id} (${p.loc})`).join(' | ')}</div>
          </div>
        </div>
      )}

      {/* ESP32 Live Node */}
      {ts.status !== 'loading' && (
        <div style={{ background: 'var(--card)', border: `1px solid ${ts.leakDetected ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: 12, padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', boxShadow: ts.leakDetected ? 'var(--glow-red)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className={`sys-dot ${ts.leakDetected ? 'danger' : 'safe'}`} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>ESP32-C6 LIVE NODE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: ts.leakDetected ? 'var(--red)' : 'var(--green)' }}>
                {ts.leakDetected ? '⚠️ LEAKAGE – RELAY TRIPPED' : '✅ ALL CLEAR'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Voltage ADC', value: ts.voltageRaw ?? '—', color: ts.leakDetected ? 'var(--red)' : 'var(--text)' },
              { label: 'Current ADC', value: ts.currentRaw ?? '—', color: 'var(--blue)' },
              { label: 'Battery', value: ts.batteryV != null ? `${ts.batteryV.toFixed(2)}V` : '—', color: 'var(--orange)' },
              { label: 'Power', value: ts.powerOn == null ? '—' : ts.powerOn ? 'ON' : 'OFF', color: ts.powerOn ? 'var(--green)' : 'var(--text2)' },
            ].map(item => (
              <div key={item.label} style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                {item.label} <b style={{ color: item.color }}>{item.value}</b>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
            {ts.updatedAt ? `Updated ${ts.updatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard color="blue" icon="📡" value={poles.length} label="Total Monitoring Nodes" />
        <StatCard color="green" icon="✅" value={active} label="Active Nodes" />
        <StatCard color="red" icon="⚠️" value={leaking.length} label="Leakage Alerts" />
        <StatCard color="orange" icon="🔌" value={offline.length} label="Offline / Faulty" />
      </div>

      <div className="grid2">
        <div>
          <div className="card">
            <div className="card-title">Multi-Node Monitor</div>
            <div className="pole-grid">
              {poles.slice(0, 10).map(p => <PoleCard key={p.id} pole={p} onCmd={sendPowerCmd} />)}
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title">Event Log (Last 5)</div>
            <div className="log-list">
              {logs.map((l, i) => (
                <div key={i} className={`log-item ${l.type}`}>
                  <span className="log-time">{l.time}</span>
                  <span>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Network Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Safe Nodes', color: 'var(--green)', value: safe, anim: false },
                { label: 'Leakage Detected', color: 'var(--red)', value: leaking.length, anim: true },
                { label: 'Node Offline', color: 'var(--orange)', value: offline.length, anim: false },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--card2)', borderRadius: 8, fontSize: '0.8rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, display: 'inline-block', boxShadow: `0 0 6px ${row.color}`, animation: row.anim ? 'blink 1s infinite' : 'none' }} />
                    {row.label}
                  </span>
                  <b style={{ color: row.color }}>{row.value}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Quick Actions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link to="/map" className="btn btn-on">🗺️ Live Map</Link>
              <Link to="/alerts" className="btn btn-off">🔔 View Alerts</Link>
              <Link to="/sensors" className="btn" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.3)' }}>📊 Sensor Data</Link>
              <Link to="/nodes" className="btn" style={{ background: 'rgba(249,115,22,0.12)', color: 'var(--orange)', border: '1px solid rgba(249,115,22,0.3)' }}>🔧 Node Health</Link>
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} color={toast.color} />
    </div>
  );
}
