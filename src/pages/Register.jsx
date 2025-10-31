import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    setRole("admin")
    try {
      await register(name, email, password, role);
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
                Register
              </h2>

              {error && (
              <Alert error={error} /> 
              )}

              {successMsg && (
                <div className="alert alert-success shadow-lg mb-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{successMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-neutral mt-2 bg-white w-full"
                    value={name}
                    placeholder="username"
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

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
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-neutral-content">
                <Link to="/login">
                  <p className="text-neutral">
                    Already have an account?{" "}
                    <span className="link link-primary">Login</span>
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

export default Register;
