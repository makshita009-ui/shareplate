import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Home() {
  const [s, setS] = useState(null);
  const { user } = useAuth();
  useEffect(() => { api.get('/stats').then((r) => setS(r.data)).catch(() => {}); }, []);
  return (
    <>
      <section className="hero">
        <div>
          <h1>Good food should end up on a plate, not in a bin.</h1>
          <p className="lead">Restaurants, hostels and event hosts list surplus food. Verified NGOs claim it and collect it before it spoils.</p>
          <div className="row">
            {!user && <Link to="/register" className="btn big">List or claim food</Link>}
            {user?.role === 'donor' && <Link to="/donate" className="btn big">Donate food</Link>}
            {user?.role === 'ngo' && <Link to="/food" className="btn big">Find food near you</Link>}
            <Link to="/impact" className="btn ghost big">See our impact</Link>
          </div>
        </div>
        <div className="hero-card">
          <span className="muted">Meals rescued so far</span>
          <b>{s ? s.meals.toLocaleString() : '–'}</b>
          <span className="muted">{s ? `${s.activeNow} listings waiting for pickup right now` : 'Loading…'}</span>
        </div>
      </section>

      <section className="steps">
        <div><h3>1. Donors list surplus</h3><p>Add what you have, how many meals, the address and a safe-to-eat deadline.</p></div>
        <div><h3>2. NGOs claim it</h3><p>Verified organisations filter by city or area and claim food before anyone else.</p></div>
        <div><h3>3. Pickup is tracked</h3><p>Available, claimed, collected. Every rescue is counted on the impact page.</p></div>
      </section>
    </>
  );
}
