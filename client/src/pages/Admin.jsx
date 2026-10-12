import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const load = () => {
    api.get('/admin/users').then((r) => setUsers(r.data));
    api.get('/reports').then((r) => setReports(r.data));
  };
  useEffect(() => { load(); }, []);

  const verify = async (u) => {
    try { await api.patch(`/admin/users/${u._id}/verify`, { isVerified: !u.isVerified }); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const resolve = async (id) => { await api.patch(`/reports/${id}/resolve`); toast.success('Report resolved'); load(); };

  return (
    <>
      <h2>Verify members</h2>
      <div className="card tbl">
        {users.map((u) => (
          <div className="trow" key={u._id}>
            <div><b>{u.orgName || u.name}</b><span className="muted small"> {u.role} · {u.email} · {u.phone || 'no phone'} · {u.city}</span></div>
            <button className={`btn ${u.isVerified ? 'ghost' : ''}`} onClick={() => verify(u)}>{u.isVerified ? 'Remove verification' : 'Verify'}</button>
          </div>
        ))}
        {!users.length && <p className="empty">No members have registered yet.</p>}
      </div>

      <h2>Reported issues</h2>
      <div className="card tbl">
        {reports.map((r) => (
          <div className="trow" key={r._id}>
            <div><b>{r.donation?.foodType}</b> <span className="pill">{r.status}</span><p className="muted small">{r.reporter?.name} ({r.reporter?.role}): {r.message}</p></div>
            {r.status === 'open' && <button className="btn" onClick={() => resolve(r._id)}>Mark resolved</button>}
          </div>
        ))}
        {!reports.length && <p className="empty">No issues reported.</p>}
      </div>
    </>
  );
}
