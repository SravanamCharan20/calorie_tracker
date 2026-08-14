import { Outlet, Link } from "react-router";

function App() {
  return (
    <>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/signin">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>

      <Outlet />
    </>
  );
}

export default App;
