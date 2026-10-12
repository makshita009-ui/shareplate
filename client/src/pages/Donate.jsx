import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';

const TYPES = ['Cooked veg meals', 'Cooked non-veg meals', 'Bread & bakery', 'Fruits & vegetables', 'Packaged food', 'Other'];

export default function Donate() {
  const [f, setF] = useState({ foodType: TYPES[0], address: {} });
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setA = (k) => (e) => setF({ ...f, address: { ...f.address, [k]: e.target.value } });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/donations', f);
      toast.success('Food listed. NGOs can now claim it');
      nav('/dashboard');
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>List surplus food</h2>
      <p className="muted">The street address and phone are shown only to the NGO that claims your food.</p>
      <div className="grid2">
        <label>Food type<select value={f.foodType} onChange={set('foodType')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Number of meals<input type="number" min="1" required onChange={set('servings')} /></label>
        <label>Prepared at<input type="datetime-local" onChange={set('preparedTime')} /></label>
        <label>Safe to eat until<input type="datetime-local" required onChange={set('expiryTime')} /></label>
      </div>
      <input placeholder="What is it? e.g. Veg biryani and curd, packed in boxes" onChange={set('description')} />
      <div className="grid2">
        <input placeholder="Street / building" required onChange={setA('street')} />
        <input placeholder="Area" required onChange={setA('area')} />
        <input placeholder="City" required onChange={setA('city')} />
        <input placeholder="Pincode" onChange={setA('pincode')} />
        <input placeholder="Contact phone" required onChange={set('contactPhone')} />
        <input placeholder="Pickup note, e.g. ask for the manager at the gate" onChange={set('pickupInstructions')} />
      </div>
      <button className="btn big">List this food</button>
    </form>
  );
}
