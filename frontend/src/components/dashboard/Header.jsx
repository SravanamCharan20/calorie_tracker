import { Link } from "react-router";

const Header = ({ title, showAddMeal = true }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
          {today}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-[28px]">
          {title}
        </h1>
      </div>

      {showAddMeal && (
        <Link
          to="/meals"
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <PlusIcon />
          Add meal
        </Link>
      )}
    </header>
  );
};

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default Header;
