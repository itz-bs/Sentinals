export default function Toast({ msg, color }) {
  if (!msg) return null;
  return (
    <div className="btn-toast" style={{ display: 'block', color: color || 'var(--text)' }}>
      {msg}
    </div>
  );
}
