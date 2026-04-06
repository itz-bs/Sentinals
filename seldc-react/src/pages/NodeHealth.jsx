import StatCard from '../components/StatCard';
import PoleCard from '../components/PoleCard';
import Toast from '../components/Toast';
import usePoles from '../hooks/usePoles';

export default function NodeHealth() {
  const { poles, toast, sendPowerCmd } = usePoles();
  const leaking = poles.filter(p => p.status === 'leakage').length;
  const offline = poles.filter(p => p.status === 'offline').length;
  const safe = poles.filter(p => p.status === 'safe').length;

  return (
    <div className="container">
      <div className="page-title">Node <span>Health Monitor</span></div>

      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <StatCard color="blue" icon="📡" value={poles.length} label="Total Nodes" />
        <StatCard color="green" icon="✅" value={safe} label="Online & Safe" />
        <StatCard color="red" icon="⚠️" value={leaking} label="Fault / Leakage" />
        <StatCard color="orange" icon="🔌" value={offline} label="Offline" />
      </div>

      <div className="card">
        <div className="card-title">All Nodes – Control Panel</div>
        <div className="pole-grid">
          {poles.map(p => <PoleCard key={p.id} pole={p} onCmd={sendPowerCmd} showSignal />)}
        </div>
      </div>

      <Toast msg={toast.msg} color={toast.color} />
    </div>
  );
}
