import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">⚡ SELDC – Power Control System</div>
      <ul className="nav-menu">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li><NavLink to="/map" className={({ isActive }) => isActive ? 'active' : ''}>Live Map</NavLink></li>
        <li><NavLink to="/alerts" className={({ isActive }) => isActive ? 'active' : ''}>Alerts</NavLink></li>
        <li><NavLink to="/nodes" className={({ isActive }) => isActive ? 'active' : ''}>Node Health</NavLink></li>
        <li><NavLink to="/sensors" className={({ isActive }) => isActive ? 'active' : ''}>Sensor Data</NavLink></li>
        <li><NavLink to="/public" className={({ isActive }) => isActive ? 'active' : ''}>Public Safety</NavLink></li>
      </ul>
      <div className="nav-right"><div className="live-dot"></div>LIVE</div>
    </nav>
  );
}
