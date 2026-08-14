import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Welcome {user.username}</h1>
          <p>{user.email}</p>

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h1>Not logged in</h1>
      )}
    </div>
  );
};

export default Dashboard;