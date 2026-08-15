import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../utils/AuthContext.jsx";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutIcon },
  { label: "Meals", to: "/meals", icon: UtensilsIcon },
  { label: "Goals", to: "/goals", icon: TargetIcon },
  { label: "Chat", to: "/chat", icon: ChatIcon },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin", { replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[272px] flex-col overflow-hidden border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card-elevated text-white">
            <FlameIcon />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">Calorie Tracker</p>
            <p className="text-xs text-muted">Personal wellness</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card-elevated px-3.5 py-2.5">
          <p className="truncate text-sm font-medium text-white">
            {user?.username}
          </p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
        </div>
      </div>

      <nav
        className="flex-1 overflow-hidden px-3"
        aria-label="Main navigation"
      >
        <p className="px-3 pb-2 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
          Workspace
        </p>
        <ul className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <li key={label}>
                <Link
                  to={to}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-muted hover:bg-card-elevated hover:text-white"
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-full border border-border px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

const FlameIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22c4-2 6-5 6-9 0-3-2-5-4-6 0 3-1.5 5-3 6-1-2-3-4-5-4-2 0-4 2-5 4-1.5-1-3-3-3-6-2 1-4 3-4 6 0 4 2 7 6 9z" />
  </svg>
);

function LayoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M6 3v8M10 3v8M6 11v10M10 11v10M14 3v18M18 3c1.5 0 3 1.5 3 4v4c0 2.5-1.5 4-3 4" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8.3v.5z" />
    </svg>
  );
}

export default Sidebar;
