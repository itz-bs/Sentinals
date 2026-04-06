import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import Alerts from './pages/Alerts';
import NodeHealth from './pages/NodeHealth';
import SensorData from './pages/SensorData';
import PublicSafety from './pages/PublicSafety';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/nodes" element={<NodeHealth />} />
        <Route path="/sensors" element={<SensorData />} />
        <Route path="/public" element={<PublicSafety />} />
      </Routes>
    </BrowserRouter>
  );
}
