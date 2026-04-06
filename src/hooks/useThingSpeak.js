import { useState, useEffect, useCallback } from 'react';

const CHANNEL_ID = '2994048';          // replace with your ThingSpeak channel ID
const READ_API_KEY = 'WNWOQ3FX50E7FQ1P'; // from your Arduino sketch
const FETCH_INTERVAL = 15000;          // ThingSpeak free tier min 15s

// field1=voltageRaw, field2=currentRaw, field3=batteryV, field4=leakFlag
export default function useThingSpeak() {
  const [data, setData] = useState({
    voltageRaw: null,
    currentRaw: null,
    batteryV: null,
    leakDetected: null,
    powerOn: null,
    updatedAt: null,
    status: 'loading', // 'loading' | 'ok' | 'error'
  });

  const [history, setHistory] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const feed = await res.json();

      const voltageRaw  = parseInt(feed.field1) || 0;
      const currentRaw  = parseInt(feed.field2) || 0;
      const batteryV    = parseFloat(feed.field3) || 0;
      const leakFlag    = parseInt(feed.field4) || 0;
      const leakDetected = leakFlag === 1;
      const powerOn      = voltageRaw > 1000;

      const point = { voltageRaw, currentRaw, batteryV, leakDetected, time: new Date(feed.created_at) };

      setData({ voltageRaw, currentRaw, batteryV, leakDetected, powerOn, updatedAt: new Date(feed.created_at), status: 'ok' });
      setHistory(prev => [...prev.slice(-23), point]); // keep last 24 points
    } catch (e) {
      setData(prev => ({ ...prev, status: 'error' }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, FETCH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  return { data, history };
}
