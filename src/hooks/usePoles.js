import { useState, useEffect, useCallback, useRef } from 'react';
import { initialPoles, fmtTime } from '../data';

export default function usePoles() {
  const [poles, setPoles] = useState(() => initialPoles.map(p => ({ ...p })));
  const [toast, setToast] = useState({ msg: '', color: '' });
  const [logs, setLogs] = useState([
    { type: 'danger', msg: '🔴 Leakage at Pole-03 (Main Street) – Power OFF', time: fmtTime(new Date()) },
    { type: 'danger', msg: '🔴 High voltage at Pole-18 (Station Road)', time: fmtTime(new Date(Date.now() - 900000)) },
    { type: 'warning', msg: '⚠️ Pole-12 (Park Avenue) went offline', time: fmtTime(new Date(Date.now() - 1800000)) },
    { type: 'safe', msg: '🟢 Pole-07 (Market Road) restored to normal', time: fmtTime(new Date(Date.now() - 2700000)) },
    { type: 'danger', msg: '🔴 Leakage at Pole-20 (Bus Stand) – Power OFF', time: fmtTime(new Date(Date.now() - 3600000)) },
  ]);
  const soundCooldown = useRef(0);
  const audioCtx = useRef(null);

  const showToast = useCallback((msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast({ msg: '', color: '' }), 2500);
  }, []);

  const playAlert = useCallback(() => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.current.createOscillator();
      const g = audioCtx.current.createGain();
      o.connect(g); g.connect(audioCtx.current.destination);
      o.frequency.setValueAtTime(880, audioCtx.current.currentTime);
      o.frequency.setValueAtTime(440, audioCtx.current.currentTime + 0.1);
      g.gain.setValueAtTime(0.3, audioCtx.current.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.4);
      o.start(); o.stop(audioCtx.current.currentTime + 0.4);
    } catch (e) {}
  }, []);

  const sendPowerCmd = useCallback((poleId, cmd) => {
    fetch(`/api/power/${cmd}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pole_id: poleId }) }).catch(() => {});
    setPoles(prev => {
      let toastMsg = ''; let toastColor = '';
      const next = prev.map(p => {
        if (p.id !== poleId) return p;
        if (cmd === 'on') {
          if (p.status === 'leakage') { toastMsg = `⚠️ Cannot turn ON – Leakage active on ${poleId}`; toastColor = 'var(--red)'; return p; }
          toastMsg = `✅ Power ON sent to ${poleId}`; toastColor = 'var(--green)';
          setLogs(l => [{ type: 'safe', msg: `🟢 Power ON – ${poleId} (${p.loc})`, time: fmtTime(new Date()) }, ...l.slice(0, 4)]);
          return { ...p, power: true };
        } else {
          toastMsg = `🔴 Power OFF sent to ${poleId}`; toastColor = 'var(--red)';
          setLogs(l => [{ type: 'warning', msg: `⚠️ Power OFF – ${poleId} (${p.loc})`, time: fmtTime(new Date()) }, ...l.slice(0, 4)]);
          return { ...p, power: false };
        }
      });
      if (toastMsg) showToast(toastMsg, toastColor);
      return next;
    });
  }, [showToast]);

  useEffect(() => {
    const id = setInterval(() => {
      setPoles(prev => prev.map(p =>
        p.status === 'leakage' ? { ...p, voltage: Math.floor(30 + Math.random() * 40) } : p
      ));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const leaking = poles.filter(p => p.status === 'leakage').length;
    if (leaking > 0 && Date.now() - soundCooldown.current > 8000) {
      playAlert();
      soundCooldown.current = Date.now();
    }
  }, [poles, playAlert]);

  return { poles, logs, toast, sendPowerCmd };
}
