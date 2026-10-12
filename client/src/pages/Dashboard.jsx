import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Ticket from '../components/Ticket.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const load = () => api.get('/donations/mine').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const act = async (id, action, msg) => {
    try { await api.patch(`/donations/${id}/${action}`); toast.success(msg); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const report = async (id) => {
    const message = prompt('What went wrong with this donation?');
    if (!message) return;
    try { await api.post('/reports', { donation: id, message }); toast.success('Report sent to admin'); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <>
      <h2>{user.role === 'ngo' ? 'My pickups' : 'My donations'}</h2>
      <div className="list">
        {list.map((d) => (
          <Ticket key={d._id} d={d}>
            {d.claimedBy && user.role === 'donor' && <span className="small">Claimed by {d.claimedBy.orgName || d.claimedBy.name} · {d.claimedBy.phone}</span>}
            {user.role === 'donor' && d.status === 'available' && <button className="btn ghost" onClick={() => act(d._id, 'cancel', 'Listing cancelled')}>Cancel</button>}
            {user.role === 'ngo' && d.status === 'claimed' && <button className="btn" onClick={() => act(d._id, 'collect', 'Marked as collected')}>Mark collected</button>}
            {d.status !== 'available' && <button className="link" onClick={() => report(d._id)}>Report an issue</button>}
          </Ticket>
        ))}
        {!list.length && (
          <p className="empty">
            {user.role === 'donor' ? <>You have not listed any food yet. <Link to="/donate">List your first donation</Link></> : <>You have not claimed any food yet. <Link to="/food">Find food to collect</Link></>}
          </p>
        )}
      </div>
    </>
  );
}
