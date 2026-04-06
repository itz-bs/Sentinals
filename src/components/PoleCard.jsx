import { useNavigate } from 'react-router-dom';
import { fmtTime } from '../data';

export default function PoleCard({ pole, onCmd, showSignal }) {
  const navigate = useNavigate();
  const st = pole.status === 'leakage' ? 'danger' : pole.status === 'offline' ? 'offline' : 'safe';
  const badgeTxt = pole.status === 'leakage' ? 'LEAKAGE' : pole.status === 'offline' ? 'OFFLINE' : 'SAFE';
  const vColor = pole.voltage > 30 ? 'red' : pole.status === 'offline' ? 'orange' : 'green';
  const onDis = pole.status === 'leakage' || pole.status === 'offline';
  const offDis = !pole.power || pole.status === 'offline';
  const sigColor = pole.signal > 80 ? 'var(--green)' : pole.signal > 50 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className={`pole-card ${st}`}>
      <div className="pole-head">
        <div className="pole-name">📍 {pole.id}</div>
        <div className={`pole-badge ${st}`}>{badgeTxt}</div>
      </div>
      <div className="pole-row"><span className="lbl">Location</span><span className="val">{pole.loc}</span></div>
      <div className="pole-row"><span className="lbl">Voltage</span><span className={`val ${vColor}`}>{pole.voltage}V</span></div>
      <div className="pole-row">
        <span className="lbl">GPS</span>
        <a onClick={() => navigate(`/map?lat=${pole.lat}&lng=${pole.lng}&id=${pole.id}`)}
          style={{ fontSize: '0.72rem', color: 'var(--blue)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          📍 {pole.lat.toFixed(4)}°N, {pole.lng.toFixed(4)}°E <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>↗</span>
        </a>
      </div>
      <div className="pole-row"><span className="lbl">Power</span><span className={`val ${pole.power ? 'green' : 'red'}`}>{pole.power ? 'ON' : 'OFF'}</span></div>
      {showSignal && (
        <>
          <div className="pole-row"><span className="lbl">Signal</span><span className="val" style={{ color: sigColor }}>{pole.signal}%</span></div>
          <div className="pole-row"><span className="lbl">Uptime</span><span className="val">{pole.uptime}</span></div>
        </>
      )}
      <div className="pole-row"><span className="lbl">Updated</span><span className="val" style={{ color: 'var(--text2)' }}>{fmtTime(new Date())}</span></div>
      <div className="pole-btns">
        <button className="btn btn-on" disabled={onDis} onClick={() => onCmd(pole.id, 'on')}>⚡ Power ON</button>
        <button className="btn btn-off" disabled={offDis} onClick={() => onCmd(pole.id, 'off')}>🔴 Power OFF</button>
      </div>
    </div>
  );
}
