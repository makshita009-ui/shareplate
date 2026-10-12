import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Auth({ mode }) {
  const reg = mode === 'register';
  const [f, setF] = useState({ role: 'donor' });
  const { login } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(reg ? '/auth/register' : '/auth/login', f);
      login(data);
      toast.success(reg ? 'Welcome to SharePlate' : 'Logged in');
      nav(data.user.role === 'admin' ? '/admin' : data.user.role === 'ngo' ? '/food' : '/donate');
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>{reg ? 'Create your account' : 'Welcome back'}</h2>
      {reg && (
        <>
          <div className="seg">
            {['donor', 'ngo'].map((r) => (
              <button type="button" key={r} className={f.role === r ? 'on' : ''} onClick={() => setF({ ...f, role: r })}>
                {r === 'donor' ? 'I have food to give' : 'I represent an NGO'}
              </button>
            ))}
          </div>
          <input placeholder="Your name" required onChange={set('name')} />
          <input placeholder={f.role === 'ngo' ? 'NGO name' : 'Restaurant / hostel / organisation (optional)'} required={f.role === 'ngo'} onChange={set('orgName')} />
          <input placeholder="Phone number" onChange={set('phone')} />
          <input placeholder="City" onChange={set('city')} />
        </>
      )}
      <input type="email" placeholder="Email" required onChange={set('email')} />
      <input type="password" placeholder="Password" required minLength={6} onChange={set('password')} />
      <button className="btn big">{reg ? 'Create account' : 'Log in'}</button>
      <p className="muted small">
        {reg ? <>Already a member? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
    </form>
  );
}
