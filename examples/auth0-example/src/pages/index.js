import { useAuth } from 'cumulusflow/auth';

export default function Home() {
  const { user, login, logout } = useAuth();

  return (
    <div className="container">
      <h1>Auth0 Example</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}