import { Link } from "react-router";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const WelcomeSection = ({ username }) => (
  <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm text-muted">
        {getGreeting()},{" "}
        <span className="font-medium text-white">{username}</span>
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
        Your daily snapshot
      </h2>
    </div>
    <Link
      to="/meals"
      className="self-start text-sm font-medium text-muted transition-colors hover:text-white"
    >
      View all meals ↗
    </Link>
  </section>
);

export default WelcomeSection;
