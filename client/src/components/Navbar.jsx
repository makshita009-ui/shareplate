import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="logo"><span className="dot" />SharePlate</Link>
      <nav>
        <NavLink to="/impact">Impact</NavLink>
        {user?.role === 'donor' && <><NavLink to="/donate">Donate food</NavLink><NavLink to="/dashboard">My donations</NavLink></>}
        {user?.role === 'ngo' && <><NavLink to="/food">Find food</NavLink><NavLink to="/dashboard">My pickups</NavLink></>}
        {user?.role === 'admin' && <><NavLink to="/food">All food</NavLink><NavLink to="/admin">Admin</NavLink></>}
        {user ? (
          <button className="btn ghost" onClick={() => { logout(); nav('/'); }}>Log out</button>
        ) : (
          <><NavLink to="/login">Log in</NavLink><Link to="/register" className="btn">Join</Link></>
        )}
      </nav>
    </header>
  );
}
