import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Input from "../components/ui/Input";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(email);
      navigate("/");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Financial dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col justify-center h-full text-white p-12">
          <h1 className="text-4xl font-bold flex items-center mb-4">
            <Logo />
            <span className="ml-2">Woodsboro Bank</span>
          </h1>
          <p className="text-xl mb-8 text-start max-w-md">
            Create your account and start managing your finances today.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center p-6 md:p-12 md:w-1/2">
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-6">
            <Logo />
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create an account</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or {" "}
                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  sign in to your account
                </a>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                icon={<FiUser className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<FiMail className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<FiLock className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={<FiLock className="h-5 w-5 text-gray-400" />}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
