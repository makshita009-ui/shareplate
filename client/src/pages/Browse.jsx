import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Ticket from '../components/Ticket.jsx';

export default function Browse() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [q, setQ] = useState({ city: '', area: '' });
  const load = () => api.get('/donations', { params: q }).then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const claim = async (id) => {
    try { await api.patch(`/donations/${id}/claim`); toast.success('Claimed! Address and phone are in My pickups'); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <>
      <h2>Food available for pickup</h2>
      {user.role === 'ngo' && !user.isVerified && <p className="notice">Your NGO is waiting for admin verification. You can browse now and claim once approved.</p>}
      <form className="filters" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input placeholder="City" value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })} />
        <input placeholder="Area" value={q.area} onChange={(e) => setQ({ ...q, area: e.target.value })} />
        <button className="btn">Search</button>
      </form>
      <div className="list">
        {list.map((d) => (
          <Ticket key={d._id} d={d}>
            {user.role === 'ngo' && <button className="btn" onClick={() => claim(d._id)}>Claim this food</button>}
          </Ticket>
        ))}
        {!list.length && <p className="empty">No food listed here yet. Try another city or area, or check back soon.</p>}
      </div>
    </>
  );
}
