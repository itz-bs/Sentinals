export const THRESHOLD = 30;

export const initialPoles = [
  { id: 'Pole-01', loc: 'MG Road', lat: 12.9850, lng: 77.5800, voltage: 0, status: 'safe', power: true, signal: 98, uptime: '99.9%' },
  { id: 'Pole-02', loc: 'Brigade Road', lat: 12.9750, lng: 77.5900, voltage: 0, status: 'safe', power: true, signal: 95, uptime: '99.7%' },
  { id: 'Pole-03', loc: 'Main Street, Block A', lat: 12.9716, lng: 77.5946, voltage: 65, status: 'leakage', power: false, signal: 87, uptime: '98.1%' },
  { id: 'Pole-04', loc: 'Indiranagar', lat: 12.9650, lng: 77.6000, voltage: 0, status: 'safe', power: true, signal: 92, uptime: '99.5%' },
  { id: 'Pole-05', loc: 'Cubbon Park', lat: 12.9800, lng: 77.5850, voltage: 0, status: 'safe', power: true, signal: 96, uptime: '99.8%' },
  { id: 'Pole-06', loc: 'Koramangala', lat: 12.9600, lng: 77.5950, voltage: 0, status: 'safe', power: true, signal: 94, uptime: '99.6%' },
  { id: 'Pole-07', loc: 'Market Road, Block B', lat: 12.9700, lng: 77.6100, voltage: 0, status: 'safe', power: true, signal: 91, uptime: '99.4%' },
  { id: 'Pole-08', loc: 'HSR Layout', lat: 12.9550, lng: 77.6050, voltage: 0, status: 'safe', power: true, signal: 97, uptime: '99.9%' },
  { id: 'Pole-09', loc: 'Malleshwaram', lat: 12.9900, lng: 77.5900, voltage: 0, status: 'safe', power: true, signal: 93, uptime: '99.3%' },
  { id: 'Pole-10', loc: 'Jayanagar', lat: 12.9500, lng: 77.5800, voltage: 0, status: 'safe', power: true, signal: 90, uptime: '99.2%' },
  { id: 'Pole-11', loc: 'BTM Layout', lat: 12.9450, lng: 77.6150, voltage: 0, status: 'safe', power: true, signal: 95, uptime: '99.7%' },
  { id: 'Pole-12', loc: 'Park Avenue, Block C', lat: 12.9820, lng: 77.6050, voltage: 0, status: 'offline', power: false, signal: 0, uptime: '87.2%' },
  { id: 'Pole-13', loc: 'Rajajinagar', lat: 12.9680, lng: 77.5750, voltage: 0, status: 'safe', power: true, signal: 88, uptime: '99.0%' },
  { id: 'Pole-14', loc: 'JP Nagar', lat: 12.9580, lng: 77.5900, voltage: 0, status: 'safe', power: true, signal: 92, uptime: '99.5%' },
  { id: 'Pole-15', loc: 'Bannerghatta Road', lat: 12.9400, lng: 77.5950, voltage: 0, status: 'safe', power: true, signal: 89, uptime: '99.1%' },
  { id: 'Pole-16', loc: 'Yeshwanthpur', lat: 12.9950, lng: 77.5950, voltage: 0, status: 'safe', power: true, signal: 96, uptime: '99.8%' },
  { id: 'Pole-17', loc: 'Whitefield', lat: 12.9780, lng: 77.6200, voltage: 0, status: 'safe', power: true, signal: 91, uptime: '99.4%' },
  { id: 'Pole-18', loc: 'Station Road, Block D', lat: 12.9650, lng: 77.5850, voltage: 52, status: 'leakage', power: false, signal: 82, uptime: '97.5%' },
  { id: 'Pole-19', loc: 'Lake View, Block F', lat: 12.9550, lng: 77.6100, voltage: 0, status: 'offline', power: false, signal: 0, uptime: '72.3%' },
  { id: 'Pole-20', loc: 'Bus Stand, Block B', lat: 12.9700, lng: 77.5900, voltage: 38, status: 'leakage', power: false, signal: 79, uptime: '96.8%' },
];

export const initialAlerts = [
  { time: '10:45 AM', poleId: 'Pole-03', location: 'Main Street, Block A', voltage: 65, lat: 12.9716, lng: 77.5946, status: 'critical' },
  { time: '10:30 AM', poleId: 'Pole-12', location: 'Park Avenue, Block C', voltage: null, lat: 12.9820, lng: 77.6050, status: 'offline' },
  { time: '10:15 AM', poleId: 'Pole-07', location: 'Market Road, Block B', voltage: 0, lat: 12.9700, lng: 77.6100, status: 'resolved' },
  { time: '09:50 AM', poleId: 'Pole-18', location: 'Station Road, Block D', voltage: 52, lat: 12.9650, lng: 77.5850, status: 'critical' },
  { time: '09:30 AM', poleId: 'Pole-15', location: 'School Street, Block A', voltage: 0, lat: 12.9400, lng: 77.5950, status: 'resolved' },
  { time: '09:10 AM', poleId: 'Pole-22', location: 'Temple Road, Block E', voltage: 0, lat: 12.9480, lng: 77.6020, status: 'resolved' },
  { time: '08:45 AM', poleId: 'Pole-19', location: 'Lake View, Block F', voltage: null, lat: 12.9550, lng: 77.6100, status: 'offline' },
  { time: '08:20 AM', poleId: 'Pole-20', location: 'Bus Stand, Block B', voltage: 38, lat: 12.9700, lng: 77.5900, status: 'critical' },
  { time: '07:55 AM', poleId: 'Pole-11', location: 'Hospital Road, Block C', voltage: 0, lat: 12.9450, lng: 77.6150, status: 'resolved' },
  { time: '07:30 AM', poleId: 'Pole-05', location: 'Garden Street, Block A', voltage: 0, lat: 12.9800, lng: 77.5850, status: 'resolved' },
];

export const initialComplaints = [
  { id: 'CMP-001', name: 'Rajesh Kumar', type: 'Electrical Leakage', pole: 'Pole-03', location: 'Main Street, Block A', severity: 'High', desc: 'Noticed sparks from the pole base during rain. Water on road was giving mild shocks.', time: '10:30 AM, Today', status: 'reviewing' },
  { id: 'CMP-002', name: 'Priya Sharma', type: 'Exposed Live Wire', pole: 'Pole-18', location: 'Station Road, Block D', severity: 'High', desc: 'A wire is hanging low near the footpath. Very dangerous for pedestrians.', time: '09:45 AM, Today', status: 'pending' },
  { id: 'CMP-003', name: 'Mohammed Irfan', type: 'Power Outage', pole: 'Pole-12', location: 'Park Avenue, Block C', severity: 'Medium', desc: 'No power in the entire block since last night. Pole seems to be offline.', time: '08:00 AM, Today', status: 'pending' },
  { id: 'CMP-004', name: 'Anitha Devi', type: 'Damaged Pole / Wire', pole: 'Pole-20', location: 'Bus Stand, Block B', severity: 'High', desc: 'The pole near the bus stand is leaning and the wire is touching a metal fence.', time: 'Yesterday, 06:15 PM', status: 'resolved' },
];

export const WX_ICONS = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️', 71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 95: '⛈️', 96: '⛈️', 99: '⛈️' };
export const WX_DESC = { 0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 80: 'Rain Showers', 81: 'Heavy Showers', 82: 'Violent Showers', 95: 'Thunderstorm', 96: 'Thunderstorm+Hail', 99: 'Heavy Thunderstorm' };

export function fmtTime(d) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
