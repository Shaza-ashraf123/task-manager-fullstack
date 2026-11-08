import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="card">
      <h2>Welcome, {user.name}</h2>
      <p>Tasks will appear here.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}