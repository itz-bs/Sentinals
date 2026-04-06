import { THRESHOLD } from '../data';
import useThingSpeak from '../hooks/useThingSpeak';

function StatusDot({ status }) {
  if (status === 'loading') return <div className="spin" />;
  if (status === 'error')   return <span style={{ color: 'var(--red)', fontSize: '0.72rem' }}>⚠ Fetch error</span>;
  return <span style={{ color: 'var(--green)', fontSize: '0.72rem' }}>● Live</span>;
}

export default function SensorData() {
  const { data, history } = useThingSpeak();
  const { voltageRaw, currentRaw, batteryV, leakDetected, powerOn, updatedAt, status } = data;

  const leakStatus  = leakDetected ? 'leakage' : 'safe';
  const vColor      = leakDetected ? 'var(--red)' : 'var(--green)';
  const maxBar      = 4095; // 12-bit ADC max

  const updatedStr = updatedAt
    ? updatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  const jsonFeed = status === 'ok' ? [{
    pole_id: 'ESP32-C6',
    voltage_raw: voltageRaw,
    current_raw: currentRaw,
    battery_v: batteryV,
    leak_detected: leakDetected,
    power_on: powerOn,
    timestamp: updatedAt?.toISOString() ?? null,
  }] : [];

  return (
    <div className="container">
      <div className="page-title">Real-Time <span>Sensor Data</span></div>

      {/* Status bar */}
      <div className="sys-bar" style={{ marginBottom: '1.25rem' }}>
        <div className="sys-main">
          <div className={`sys-dot ${leakDetected ? 'danger' : 'safe'}`} />
          <div>
            <div className="sys-label">ESP32-C6 SENSOR STATUS</div>
            <div className={`sys-val ${leakDetected ? 'danger' : 'safe'}`}>
              {status === 'loading' ? 'FETCHING DATA...'
                : leakDetected ? '⚠️ LEAKAGE DETECTED – RELAY TRIPPED'
                : 'ALL SENSORS NORMAL'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <StatusDot status={status} />
          <div className="refresh-info"><div className="spin" />Auto-refresh 15s</div>
        </div>
      </div>

      {/* Live bar chart from history */}
      <div className="card">
        <div className="card-title">Live Voltage ADC History (field1)</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
            Voltage Raw: <b style={{ color: leakDetected ? 'var(--red)' : 'var(--green)' }}>{voltageRaw ?? '—'}</b>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
            Current Raw: <b style={{ color: 'var(--blue)' }}>{currentRaw ?? '—'}</b>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
            Battery: <b style={{ color: 'var(--orange)' }}>{batteryV != null ? `${batteryV.toFixed(2)}V` : '—'}</b>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
            Threshold (leak): <b style={{ color: 'var(--red)' }}>iRaw &gt; 2000</b>
          </span>
        </div>
        <div className="chart-wrap">
          {history.length === 0
            ? <div style={{ color: 'var(--text2)', fontSize: '0.8rem', margin: 'auto' }}>Waiting for data...</div>
            : history.map((h, i) => (
              <div key={i} style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 2 }}>
                <div
                  className={`bar ${h.leakDetected ? 'b-danger' : 'b-safe'}`}
                  style={{ height: `${Math.max((h.voltageRaw / maxBar) * 100, 2)}%` }}
                  title={`V:${h.voltageRaw} @ ${h.time?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
                />
                <div
                  className="bar"
                  style={{ height: `${Math.max((h.currentRaw / maxBar) * 100, 2)}%`, background: 'linear-gradient(to top,var(--blue),rgba(59,130,246,0.3))', opacity: 0.7 }}
                  title={`I:${h.currentRaw}`}
                />
              </div>
            ))
          }
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--red)', display: 'inline-block' }} /> Voltage (leak)
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)', display: 'inline-block' }} /> Voltage (safe)
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--blue)', display: 'inline-block' }} /> Current
          </span>
        </div>
      </div>

      {/* Sensor cards */}
      <div className="sensor-grid">
        {/* Voltage card */}
        <div className="sensor-card" style={{ borderTop: `3px solid ${leakDetected ? 'var(--red)' : 'var(--green)'}` }}>
          <h3>⚡ Voltage Sensor (field1)</h3>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>ADC Raw</span><span className="s-val" style={{ color: vColor }}>{voltageRaw ?? '—'}</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Power Status</span><span className="s-val" style={{ color: powerOn ? 'var(--green)' : 'var(--text2)' }}>{powerOn == null ? '—' : powerOn ? 'ON' : 'OFF'}</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Threshold</span><span className="s-val" style={{ color: 'var(--text2)' }}>ADC &gt; 1000</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Updated</span><span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{updatedStr}</span></div>
        </div>

        {/* Current card */}
        <div className="sensor-card" style={{ borderTop: '3px solid var(--blue)' }}>
          <h3>🔌 Current Sensor (field2)</h3>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>ADC Raw</span><span className="s-val" style={{ color: 'var(--blue)' }}>{currentRaw ?? '—'}</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Leak Threshold</span><span className="s-val" style={{ color: 'var(--text2)' }}>ADC &gt; 2000</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Leakage Status</span><span className="s-val" style={{ color: vColor }}>{leakDetected == null ? '—' : leakDetected ? '⚠️ DETECTED' : '✅ SAFE'}</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Updated</span><span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{updatedStr}</span></div>
        </div>

        {/* Battery card */}
        <div className="sensor-card" style={{ borderTop: '3px solid var(--orange)' }}>
          <h3>🔋 Battery Monitor (field3)</h3>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Voltage</span><span className="s-val" style={{ color: 'var(--orange)' }}>{batteryV != null ? `${batteryV.toFixed(2)}V` : '—'}</span></div>
          <div className="s-row">
            <span style={{ color: 'var(--text2)' }}>Level</span>
            <span className="s-val" style={{ color: batteryV > 3.7 ? 'var(--green)' : batteryV > 3.3 ? 'var(--yellow)' : 'var(--red)' }}>
              {batteryV != null ? `${Math.min(100, Math.max(0, Math.round((batteryV - 3.0) / 1.2 * 100)))}%` : '—'}
            </span>
          </div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Range</span><span className="s-val" style={{ color: 'var(--text2)' }}>3.0V – 4.2V</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Updated</span><span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{updatedStr}</span></div>
        </div>

        {/* Relay / Leak flag card */}
        <div className="sensor-card" style={{ borderTop: `3px solid ${leakDetected ? 'var(--red)' : 'var(--green)'}` }}>
          <h3>🔁 Relay / Leak Flag (field4)</h3>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Flag Value</span><span className="s-val" style={{ color: vColor }}>{leakDetected == null ? '—' : leakDetected ? '1 (LEAK)' : '0 (SAFE)'}</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Relay State</span><span className="s-val" style={{ color: leakDetected ? 'var(--red)' : 'var(--green)' }}>{leakDetected == null ? '—' : leakDetected ? 'TRIPPED (LOW)' : 'CLOSED (HIGH)'}</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Auto Cut-off</span><span className="s-val" style={{ color: 'var(--blue)' }}>Enabled</span></div>
          <div className="s-row"><span style={{ color: 'var(--text2)' }}>Updated</span><span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{updatedStr}</span></div>
        </div>
      </div>

      {/* Raw JSON feed */}
      <div className="card">
        <div className="card-title">Raw ThingSpeak Feed – Last Entry</div>
        <pre style={{ background: 'var(--card2)', borderRadius: 8, padding: '1rem', fontSize: '0.75rem', color: 'var(--green)', overflowX: 'auto', lineHeight: 1.6, border: '1px solid var(--border)' }}>
          {status === 'loading' ? 'Fetching from ThingSpeak...' : JSON.stringify(jsonFeed, null, 2)}
        </pre>
      </div>
    </div>
  );
}
