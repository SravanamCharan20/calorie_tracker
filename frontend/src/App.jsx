import { Outlet, Link, useLocation } from "react-router";

function App() {
  const location = useLocation();
  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && (
        <nav className="border-b border-border bg-surface px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/signin"
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Sign up
            </Link>
          </div>
        </nav>
      )}

      <Outlet />
    </>
  );
}

export default App;
