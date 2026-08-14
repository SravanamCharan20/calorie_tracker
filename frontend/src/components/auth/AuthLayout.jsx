import { Link } from "react-router";

const MacroStrip = () => (
  <div className="flex items-center gap-3" aria-hidden="true">
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-protein" />
      <span className="text-[11px] font-medium tracking-wide text-muted uppercase">
        Protein
      </span>
    </span>
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-carbs" />
      <span className="text-[11px] font-medium tracking-wide text-muted uppercase">
        Carbs
      </span>
    </span>
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-fat" />
      <span className="text-[11px] font-medium tracking-wide text-muted uppercase">
        Fat
      </span>
    </span>
  </div>
);

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

export const AuthField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-medium text-muted">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3.5 text-sm text-white placeholder:text-subtle outline-none transition-colors focus:border-border-focus"
    />
  </div>
);

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => (
  <div className="flex min-h-screen bg-surface">
    <aside className="hidden w-[272px] shrink-0 flex-col border-r border-border bg-card lg:flex">
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
      </div>

      <div className="flex flex-1 flex-col justify-center px-8 pb-12">
        <p className="text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
          Track smarter
        </p>
        <h2 className="mt-3 text-2xl leading-snug font-bold tracking-tight text-white">
          Your daily nutrition, simplified.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Log meals, monitor macros, and stay on target with a clear view of
          your progress.
        </p>
        <div className="mt-6">
          <MacroStrip />
        </div>
      </div>

      <p className="px-8 pb-8 text-xs text-subtle">
        Built for consistency, not complexity.
      </p>
    </aside>

    <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card-elevated text-white">
            <FlameIcon />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">Calorie Tracker</p>
            <p className="text-xs text-muted">Personal wellness</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
          <header className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>
          </header>

          {children}
        </div>

        {footerText && footerLinkText && footerLinkTo && (
          <p className="mt-6 text-center text-sm text-muted">
            {footerText}{" "}
            <Link
              to={footerLinkTo}
              className="font-medium text-white transition-colors hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </main>
  </div>
);

export default AuthLayout;
