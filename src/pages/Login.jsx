import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen absolute top-0 z-10 flex items-center justify-center bg-base-200 text-neutral">
      <div className="container px-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl text-primary font-bold m-2 text-center"> HRM </h1>
            <h1 className=" text-white font-bold m-6 text-center">Manage employees, attendance, and more.
</h1>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-6 sm:p-8 bg-white">
              <h2 className="card-title justify-center text-2xl font-semibold mb-2 text-primary">
                Login
              </h2>

              {error && <Alert error={error} />}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-neutral mt-2 bg-white w-full"
                    value={email}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    className="input input-neutral mt-2 bg-white w-full"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-control mt-4">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-neutral-content">
                <Link to="/register">
                  <p className="text-neutral">
                    Don't have an account?{" "}
                    <span className="link link-primary">Register</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
