import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/home");
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="figmaAuthWrapper">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="blob blob4"></div>

      <div className="figmaAuthContent">
        <h1 className="figmaAuthTitle">
          Welcome Back to
          <br />
          Enneagram Test
        </h1>

        <div className="figmaAuthCard">
          <form onSubmit={handleLogin} className="figmaForm">
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="figmaErrorText">{error}</p>}

            <div className="figmaButtonWrap">
              <button type="submit" className="pillButton" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>

        <p className="figmaSwitchText">
          Belum punya akun? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}