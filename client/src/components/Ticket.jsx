// A donation shown as a pickup ticket: details on the left, meals + time left on the stub
export const timeLeft = (iso) => {
  const ms = new Date(iso) - Date.now();
  if (ms <= 0) return 'Expired';
  const h = Math.floor(ms / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  return h ? `${h}h ${m}m left` : `${m}m left`;
};

export default function Ticket({ d, children }) {
  const a = d.address || {};
  const urgent = d.status === 'available' && new Date(d.expiryTime) - Date.now() < 2 * 36e5;
  return (
    <article className={`ticket s-${d.status}`}>
      <div className="t-main">
        <span className={`pill ${d.status}`}>{d.status}</span>
        <h3>{d.foodType}</h3>
        {d.description && <p className="muted">{d.description}</p>}
        <p className="where">📍 {[a.street, a.area, a.city, a.pincode].filter(Boolean).join(', ')}</p>
        {d.donor?.name && <p className="muted small">From {d.donor.orgName || d.donor.name}{d.donor.isVerified ? ' ✔ verified' : ''}</p>}
        {d.contactPhone && <p className="small">📞 {d.contactPhone}</p>}
        {d.pickupInstructions && <p className="small">📝 {d.pickupInstructions}</p>}
        <div className="actions">{children}</div>
      </div>
      <div className="t-stub">
        <strong>{d.servings}</strong><span>meals</span>
        <em className={urgent ? 'urgent' : ''}>{d.status === 'available' ? timeLeft(d.expiryTime) : new Date(d.expiryTime).toLocaleDateString()}</em>
      </div>
    </article>
  );
}
