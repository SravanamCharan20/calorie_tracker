import { useState } from "react";
import { useNavigate } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:6969";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

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
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Signup Form</h1>

        <label className="text-blue-600">Username</label>
        <input
          className="border-amber-400 border-4"
          id="signup-username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="text-blue-600">Email</label>
        <input
          className="border-amber-400 border-4"
          id="signup-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="text-blue-600">Password</label>
        <input
          className="border-amber-400 border-4"
          id="signup-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Submit</button>

        {error && <h2 className="text-red-500">{error}</h2>}
        {success && <h2 className="text-green-600">{success}</h2>}
      </form>
    </div>
  );
};

export default Signup;
