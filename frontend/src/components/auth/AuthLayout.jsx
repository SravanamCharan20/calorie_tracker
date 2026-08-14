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
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22c4-2 6-5 6-9 0-3-2-5-4-6 0 3-1.5 5-3 6-1-2-3-4-5-4-2 0-4 2-5 4-1.5-1-3-3-3-6-2 1-4 3-4 6 0 4 2 7 6 9z" />
    <path d="M12 22c-1.5-2-2-3.5-2-5 0-2 1-3.5 2-4.5 1 1 2 2.5 2 4.5 0 1.5-.5 3-2 5z" />
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
      className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] text-white placeholder:text-subtle outline-none transition-colors focus:border-border-focus focus:ring-1 focus:ring-white/10"
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
  <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
    <aside className="hidden flex-1 flex-col justify-between border-r border-border p-10 lg:flex xl:p-14">
      <div className="flex items-center gap-3 text-white">
        <FlameIcon />
        <span className="text-lg font-semibold tracking-tight">Calorie Tracker</span>
      </div>

      <div className="max-w-sm space-y-6">
        <p className="text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
          Track smarter
        </p>
        <h2 className="text-3xl leading-snug font-bold tracking-tight text-white">
          Your daily nutrition, simplified.
        </h2>
        <p className="text-[15px] leading-relaxed text-muted">
          Log meals, monitor macros, and stay on target with a clear view of
          your progress.
        </p>
        <MacroStrip />
      </div>

      <p className="text-sm text-subtle">
        Built for consistency, not complexity.
      </p>
    </aside>

    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card-elevated text-white">
            <FlameIcon />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Calorie Tracker
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
          <header className="mb-8 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="text-[15px] leading-relaxed text-muted">{subtitle}</p>
          </header>

          {children}
        </div>

        {footerText && footerLinkText && footerLinkTo && (
          <p className="mt-6 text-center text-sm text-muted">
            {footerText}{" "}
            <Link
              to={footerLinkTo}
              className="font-medium text-white underline-offset-4 transition-colors hover:underline"
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
