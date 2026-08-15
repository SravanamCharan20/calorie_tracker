import { Link } from "react-router";

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
  <div className="flex min-h-screen items-center justify-center bg-surface px-5 py-10 sm:px-8">
    <div className="w-full max-w-[420px]">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-white">
          <FlameIcon />
        </div>
        <p className="mt-4 text-[15px] font-semibold text-white">
          Calorie Tracker
        </p>
        <p className="mt-1 text-xs text-muted">Personal wellness</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8">
        <header className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {subtitle}
          </p>
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
  </div>
);

export default AuthLayout;
