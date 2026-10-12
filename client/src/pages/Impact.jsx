import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Impact() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/stats').then((r) => setS(r.data)); }, []);
  if (!s) return <p className="empty">Loading impact…</p>;
  const max = Math.max(1, ...s.byCity.map((c) => c.meals));
  const tiles = [['Meals provided', s.meals], ['Food rescued (kg)', s.kgRescued], ['Successful pickups', s.pickups], ['CO₂ avoided (kg)', s.co2Saved]];
  return (
    <>
      <h2>Our impact</h2>
      <div className="tiles">{tiles.map(([l, v]) => <div className="tile" key={l}><b>{v.toLocaleString()}</b><span>{l}</span></div>)}</div>
      <p className="muted small">Estimates: 1 meal ≈ 0.4 kg of food; 1 kg of food waste ≈ 2.5 kg CO₂.</p>
      <h3>Meals rescued by city</h3>
      <div className="card">
        {s.byCity.map((c) => (
          <div className="bar" key={c.city}><span>{c.city}</span><i style={{ width: `${(c.meals / max) * 100}%` }} /><b>{c.meals}</b></div>
        ))}
        {!s.byCity.length && <p className="empty">The first completed pickup will appear here.</p>}
      </div>
    </>
  );
}
