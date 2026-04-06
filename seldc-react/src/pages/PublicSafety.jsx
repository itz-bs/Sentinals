import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { initialComplaints } from '../data';

const safetyAlerts = [
  { type: 'danger', icon: '🚨', title: 'DANGER – Electrical Leakage Zone', titleColor: 'var(--red)', body: { location: 'Main Street, Block A (Near Pole-03)', voltage: '65V', voltageColor: 'var(--red)', gps: { lat: 12.9716, lng: 77.5946, id: 'Pole-03' }, warning: 'Electrical leakage detected near Street Pole-03. Do NOT touch any metal poles, fences, or standing water in this area.', action: 'Power supply automatically disconnected. Emergency response team notified.', time: '10:45 AM' } },
  { type: 'danger', icon: '🚨', title: 'DANGER – High Voltage Detected', titleColor: 'var(--red)', body: { location: 'Station Road, Block D (Near Pole-18)', voltage: '52V', voltageColor: 'var(--red)', gps: { lat: 12.9650, lng: 77.5850, id: 'Pole-18' }, warning: 'High voltage detected in the area. Stay away from electrical poles and avoid touching any metal structures.', action: 'Power disconnected. Emergency response team dispatched.', time: '09:50 AM' } },
  { type: 'warning', icon: '⚠️', title: 'WARNING – Power Disconnected', titleColor: 'var(--orange)', body: { location: 'Bus Stand, Block B (Near Pole-20)', voltage: '38V', voltageColor: 'var(--orange)', gps: { lat: 12.9700, lng: 77.5900, id: 'Pole-20' }, warning: 'Power supply temporarily disconnected due to electrical leakage. Maintenance crew is on-site.', action: null, time: '08:20 AM' } },
  { type: 'warning', icon: '🔧', title: 'MAINTENANCE – Node Offline', titleColor: 'var(--orange)', body: { location: 'Park Avenue, Block C (Near Pole-12)', voltage: null, gps: { lat: 12.9820, lng: 77.6050, id: 'Pole-12' }, warning: 'Monitoring node is offline. Technical team is investigating. Area is under observation.', action: null, time: '10:30 AM' } },
  { type: 'success', icon: '✅', title: 'RESOLVED – Area Cleared', titleColor: 'var(--green)', body: { location: 'Market Road, Block B (Near Pole-07)', voltage: null, gps: { lat: 12.9700, lng: 77.6100, id: 'Pole-07' }, warning: 'Electrical issue has been fully resolved. The area is now safe for public use.', action: null, time: '10:15 AM' } },
];

export default function PublicSafety() {
  const [tab, setTab] = useState('alerts');
  const [complaints, setComplaints] = useState(initialComplaints.map(c => ({ ...c })));
  const [form, setForm] = useState({ name: '', phone: '', type: '', pole: 'Unknown', location: '', severity: 'High', datetime: '', desc: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const id = 'CMP-' + String(complaints.length + 1).padStart(3, '0');
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today';
      setComplaints(prev => [{ id, name: form.name, type: form.type, pole: form.pole, location: form.location, severity: form.severity, desc: form.desc, time: timeStr, status: 'pending' }, ...prev]);
      setSuccessRef(`Reference ID: ${id} — Our team will respond within 2 hours.`);
      setForm({ name: '', phone: '', type: '', pole: 'Unknown', location: '', severity: 'High', datetime: '', desc: '' });
      setSubmitting(false);
      setTimeout(() => setSuccessRef(''), 5000);
    }, 800);
  }

  return (
    <div className="container">
      <div className="page-title">Public <span>Safety Portal</span></div>

      <div className="alert-banner" style={{ marginBottom: '1.25rem' }}>
        <div className="a-icon">🚨</div>
        <div>
          <div className="a-title">3 ACTIVE ELECTRICAL HAZARD ZONES – STAY CLEAR</div>
          <div className="a-sub">Main Street Block A · Station Road Block D · Bus Stand Block B</div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.25rem' }}>
        <StatCard color="red" icon="🚨" value={3} label="Active Hazard Zones" />
        <StatCard color="orange" icon="🔧" value={2} label="Under Maintenance" />
        <StatCard color="green" icon="✅" value={7} label="Resolved Today" />
        <StatCard color="blue" icon="📋" value={complaints.length} label="Public Complaints" />
      </div>

      <div className="tab-bar">
        {[['alerts', '🔔 Safety Alerts'], ['complaint', '📝 Post Complaint'], ['history', '📋 Complaint History']].map(([key, label]) => (
          <button key={key} className={`tab-btn ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'alerts' && (
        <div>
          {safetyAlerts.map((a, i) => (
            <div key={i} className={`pub-card ${a.type}`}>
              <div className="pub-head"><span className="pub-icon">{a.icon}</span><span className="pub-title" style={{ color: a.titleColor }}>{a.title}</span></div>
              <div className="pub-body">
                <strong>Location:</strong> {a.body.location}<br />
                {a.body.voltage && <><strong>Voltage Detected:</strong> <span style={{ color: a.body.voltageColor, fontWeight: 700 }}>{a.body.voltage}</span> — Above safe threshold<br /></>}
                <strong>GPS:</strong> <Link to={`/map?lat=${a.body.gps.lat}&lng=${a.body.gps.lng}&id=${a.body.gps.id}`} style={{ color: 'var(--blue)', fontSize: '0.78rem' }}>📍 {a.body.gps.lat.toFixed(4)}°N, {a.body.gps.lng.toFixed(4)}°E ↗</Link><br />
                <strong>{a.body.action ? 'Warning' : 'Notice'}:</strong> {a.body.warning}<br />
                {a.body.action && <><strong>Action Taken:</strong> {a.body.action}<br /></>}
                <strong>Time:</strong> {a.body.time}
              </div>
            </div>
          ))}
          <div className="pub-card info">
            <div className="pub-head"><span className="pub-icon">ℹ️</span><span className="pub-title" style={{ color: 'var(--blue)' }}>Public Safety Guidelines</span></div>
            <div className="pub-body">
              <ul>
                <li>Never touch electrical poles during rain or when standing in water</li>
                <li>Report sparking or unusual sounds from electrical equipment immediately</li>
                <li>Keep children away from electrical poles and transformers</li>
                <li>Do not attempt to repair or touch damaged electrical wires</li>
                <li>If you see someone electrocuted — do NOT touch them, call emergency services</li>
                <li>Emergency Helpline: <strong style={{ color: 'var(--red)' }}>1800-XXX-XXXX</strong></li>
                <li>Electricity Board Control Room: <strong style={{ color: 'var(--blue)' }}>1912</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === 'complaint' && (
        <div className="card">
          <div className="card-title">Submit a Complaint / Report Hazard</div>
          {successRef && (
            <div className="form-success">
              <span style={{ fontSize: '1.3rem' }}>✅</span>
              <div><div>Complaint submitted successfully!</div><div style={{ fontSize: '0.75rem', fontWeight: 400, marginTop: 2, color: 'var(--text2)' }}>{successRef}</div></div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Complaint Type *</label>
                <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                  <option value="">-- Select Type --</option>
                  <option value="Electrical Leakage">⚡ Electrical Leakage</option>
                  <option value="Sparking / Fire Risk">🔥 Sparking / Fire Risk</option>
                  <option value="Damaged Pole / Wire">🔌 Damaged Pole / Wire</option>
                  <option value="Power Outage">💡 Power Outage</option>
                  <option value="Exposed Live Wire">⚠️ Exposed Live Wire</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nearest Pole ID</label>
                <select className="form-select" value={form.pole} onChange={e => setForm(f => ({ ...f, pole: e.target.value }))}>
                  <option value="Unknown">Unknown / Not Sure</option>
                  {['Pole-01 – MG Road','Pole-02 – Brigade Road','Pole-03 – Main Street, Block A','Pole-04 – Indiranagar','Pole-05 – Cubbon Park','Pole-06 – Koramangala','Pole-07 – Market Road','Pole-08 – HSR Layout','Pole-12 – Park Avenue, Block C','Pole-18 – Station Road, Block D','Pole-19 – Lake View, Block F','Pole-20 – Bus Stand, Block B'].map(o => (
                    <option key={o} value={o.split(' – ')[0]}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Exact Location / Address *</label>
              <input className="form-input" type="text" placeholder="e.g. Near bus stop, Main Street, Block A" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Severity</label>
                <select className="form-select" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                  <option value="High">🔴 High – Immediate Danger</option>
                  <option value="Medium">🟡 Medium – Needs Attention</option>
                  <option value="Low">🟢 Low – Minor Issue</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date & Time of Incident</label>
                <input className="form-input" type="datetime-local" value={form.datetime} onChange={e => setForm(f => ({ ...f, datetime: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" placeholder="Describe the issue in detail..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="submit-btn" disabled={submitting}>
                <span>{submitting ? '⏳' : '📤'}</span> {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button type="button" className="btn" style={{ background: 'rgba(100,116,139,0.12)', color: 'var(--text2)', border: '1px solid var(--border)' }}
                onClick={() => setForm({ name: '', phone: '', type: '', pole: 'Unknown', location: '', severity: 'High', datetime: '', desc: '' })}>
                Reset
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>* Required fields</span>
            </div>
          </form>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <div className="card-title">Complaint History</div>
          {complaints.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)', fontSize: '0.85rem' }}>No complaints submitted yet.</div>
            : complaints.map(c => {
              const sevColor = c.severity === 'High' ? 'var(--red)' : c.severity === 'Medium' ? 'var(--yellow)' : 'var(--green)';
              return (
                <div key={c.id} className={`complaint-card ${c.status}`}>
                  <div className="c-head">
                    <div>
                      <div className="c-id">{c.id} · {c.time}</div>
                      <div className="c-title">{c.type} – {c.location}</div>
                    </div>
                    <span className={`c-status ${c.status}`}>{c.status.toUpperCase()}</span>
                  </div>
                  <div className="c-meta">👤 {c.name} &nbsp;|&nbsp; 📍 {c.pole} &nbsp;|&nbsp; Severity: <span style={{ color: sevColor, fontWeight: 700 }}>{c.severity}</span></div>
                  <div className="c-msg">{c.desc}</div>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}
