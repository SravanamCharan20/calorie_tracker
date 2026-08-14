import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout, { AuthField } from "../../components/auth/AuthLayout";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:6969";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      setSuccess(data.message);
      navigate("/signin");
    } catch (error) {
      console.log("Error", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking calories and macros with a clear daily overview."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          label="Username"
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          autoComplete="username"
        />

        <AuthField
          label="Email"
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <AuthField
          label="Password"
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
