import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password dan Confirm Password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setSuccess("Register berhasil. Mengarahkan ke login...");

      setTimeout(() => {
        router.push("/login");
      }, 1200);

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
          Want to know your
          <br />
          Enneagram type?
        </h1>

        <div className="figmaAuthCard">
          <form onSubmit={handleRegister} className="figmaForm">
            <input
              type="text"
              placeholder="Username"
              aria-label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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

            <input
              type="password"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="figmaErrorText">{error}</p>}
            {success && <p className="figmaSuccessText">{success}</p>}

            <div className="figmaButtonWrap">
              <button type="submit" className="pillButton" disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>

        <p className="figmaSwitchText">
          Sudah punya akun? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}