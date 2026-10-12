import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { useAuth } from './AuthContext.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Browse from './pages/Browse.jsx';
import Donate from './pages/Donate.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import Impact from './pages/Impact.jsx';

function Guard({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/food" element={<Guard roles={['ngo', 'admin']}><Browse /></Guard>} />
          <Route path="/donate" element={<Guard roles={['donor']}><Donate /></Guard>} />
          <Route path="/dashboard" element={<Guard roles={['donor', 'ngo']}><Dashboard /></Guard>} />
          <Route path="/admin" element={<Guard roles={['admin']}><Admin /></Guard>} />
        </Routes>
      </main>
      <footer className="foot">SharePlate · Rescue food. Feed people. Waste less.</footer>
    </>
  );
}
