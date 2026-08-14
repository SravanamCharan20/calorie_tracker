import { useState } from "react";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:6969";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.log("Error", error);
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>SignIn Form</h1>

        <label className="text-blue-600">Email</label>
        <input
          className="border-amber-400 border-4"
          id="signin-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="text-blue-600">Password</label>
        <input
          className="border-amber-400 border-4"
          id="signin-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {error && <h2 className="text-red-500">{error}</h2>}
    </div>
  );
};

export default Signin;
