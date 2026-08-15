import { useState } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, chatMode = false }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${
          chatMode ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <div className="shrink-0 lg:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              className="rounded-xl p-2 text-white transition-colors hover:bg-card"
              onClick={() => setMobileNavOpen(true)}
            >
              <MenuIcon />
            </button>
            <span className="text-sm font-semibold text-white">
              Calorie Tracker
            </span>
            <div className="w-9" />
          </div>
        </div>

        <main
          className={`min-h-0 flex-1 ${
            chatMode
              ? "flex flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5"
              : "px-5 py-6 sm:px-8 sm:py-8 lg:px-10"
          }`}
        >
          <div
            className={`mx-auto w-full ${
              chatMode
                ? "flex min-h-0 max-w-[960px] flex-1 flex-col"
                : "max-w-[1200px] pb-16 sm:pb-24"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export default DashboardLayout;
