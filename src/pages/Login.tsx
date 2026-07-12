import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  FiLock,
  FiUser,
  FiShield,
  FiSmartphone,
  FiChevronLeft,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Input from "../components/ui/Input";

type Step = "userId" | "password" | "otp";

function BrandPanel({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="hidden md:flex md:w-[44%] relative overflow-hidden flex-col justify-between bg-[#0A1F44] text-white">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        viewBox="0 0 600 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-20 640 C 100 600, 160 700, 260 660 S 420 560, 520 610 S 680 700, 780 640"
          stroke="#C9A227"
          strokeWidth="2"
        />
        <path
          d="M-20 720 C 120 660, 180 760, 300 700 S 440 620, 540 680 S 700 760, 800 700"
          stroke="#3E6BB0"
          strokeWidth="2"
        />
        <path
          d="M-20 560 C 90 520, 150 610, 250 570 S 410 480, 510 530 S 660 600, 780 550"
          stroke="#3E6BB0"
          strokeWidth="1.5"
        />
        <circle cx="260" cy="660" r="4" fill="#C9A227" />
        <circle cx="520" cy="610" r="4" fill="#C9A227" />
      </svg>

      <div className="relative z-10 p-10 lg:p-14">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">
            Woodsboro Bank
          </span>
        </div>
      </div>

      <div className="relative z-10 px-10 lg:px-14 pb-16">
        <h1 className="text-[2rem] leading-tight font-semibold mb-4 max-w-sm">
          {title}
        </h1>
        <p className="text-white/70 text-base max-w-sm mb-10">{subtitle}</p>

        <ul className="space-y-4 max-w-sm">
          <li className="flex items-start gap-3">
            <FiShield className="mt-0.5 h-5 w-5 text-[#C9A227] flex-shrink-0" />
            <span className="text-sm text-white/80">
              We verify every sign-in with a one-time code
            </span>
          </li>
          <li className="flex items-start gap-3">
            <FiSmartphone className="mt-0.5 h-5 w-5 text-[#C9A227] flex-shrink-0" />
            <span className="text-sm text-white/80">
              Face ID and fingerprint sign-in on mobile
            </span>
          </li>
        </ul>
      </div>

      <div className="relative z-10 px-10 lg:px-14 pb-8 flex items-center gap-2 text-xs text-white/50 border-t border-white/10 pt-6 mx-10 lg:mx-14">
        <span className="inline-flex items-center justify-center h-5 px-1.5 rounded border border-white/25 text-[10px] font-semibold tracking-wide">
          FDIC
        </span>
        Member FDIC — deposits insured up to $250,000
      </div>
    </div>
  );
}

export default function Login() {
  const [step, setStep] = useState<Step>("userId");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberUserId, setRememberUserId] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userId.trim()) {
      setError("Enter your User ID to continue");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Enter your password to continue");
      return;
    }

    // In production this call would validate credentials server-side and
    // return whether this device/browser is already recognized.
    if (rememberDevice) {
      try {
        await login(userId);
        navigate("/");
      } catch (err) {
        setError("We couldn't verify those details. Please try again.");
      }
      return;
    }

    setStep("otp");
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit code we sent you");
      return;
    }

    try {
      await login(userId);
      navigate("/");
    } catch (err) {
      setError("That code didn't match. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F7FA] dark:bg-[#0A1120]">
      <BrandPanel
        title="Banking that keeps pace with your life"
        subtitle="Check balances, move money, and manage your accounts — anytime, from any device."
      />

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <Logo />
            <span className="text-lg font-semibold text-[#0A1F44] dark:text-white">
              Woodsboro Bank
            </span>
          </div>

          {/* STEP 1: User ID */}
          {step === "userId" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Sign in
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  New to Woodsboro Bank?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-[#1B4B91] hover:text-[#0A1F44] dark:text-[#6FA3E0]"
                  >
                    Open an account
                  </a>
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleUserIdSubmit} noValidate>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm border border-red-100 dark:border-red-900/40">
                    {error}
                  </div>
                )}

                <Input
                  label="User ID"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  icon={<FiUser className="h-5 w-5 text-gray-400" />}
                  required
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[#334155] dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberUserId}
                      onChange={(e) => setRememberUserId(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#1B4B91] focus:ring-[#1B4B91]"
                    />
                    Remember my User ID
                  </label>
                  <a
                    href="#"
                    className="font-medium text-[#1B4B91] hover:text-[#0A1F44] dark:text-[#6FA3E0]"
                  >
                    Forgot User ID?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4B91] transition-colors duration-150"
                >
                  Continue
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-medium text-[#0A1F44] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <FiSmartphone className="h-4 w-4" />
                  Use Face ID or fingerprint instead
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Password */}
          {step === "password" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("userId");
                  setError("");
                }}
                className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0A1F44] dark:text-gray-400 mb-6"
              >
                <FiChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Enter your password
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  Signing in as{" "}
                  <span className="font-medium text-[#0A1F44] dark:text-white">
                    {userId}
                  </span>{" "}
                  ·{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("userId");
                      setError("");
                    }}
                    className="font-medium text-[#1B4B91] hover:text-[#0A1F44] dark:text-[#6FA3E0]"
                  >
                    Not you?
                  </button>
                </p>
              </div>

              <form className="space-y-5" onSubmit={handlePasswordSubmit} noValidate>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm border border-red-100 dark:border-red-900/40">
                    {error}
                  </div>
                )}

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<FiLock className="h-5 w-5 text-gray-400" />}
                  required
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[#334155] dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#1B4B91] focus:ring-[#1B4B91]"
                    />
                    Remember this device for 30 days
                  </label>
                  <a
                    href="#"
                    className="font-medium text-[#1B4B91] hover:text-[#0A1F44] dark:text-[#6FA3E0]"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4B91] transition-colors duration-150"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {rememberDevice ? "Sign in" : "Continue"}
                </button>
              </form>
            </>
          )}

          {/* STEP 3: One-time passcode */}
          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("password");
                  setError("");
                }}
                className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0A1F44] dark:text-gray-400 mb-6"
              >
                <FiChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Verify it's you
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  We sent a 6-digit code to the phone number on file ending
                  in •••• 4821
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleOtpSubmit} noValidate>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm border border-red-100 dark:border-red-900/40">
                    {error}
                  </div>
                )}

                <Input
                  label="6-digit code"
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  icon={<FiShield className="h-5 w-5 text-gray-400" />}
                  required
                />

                <button
                  type="button"
                  className="text-sm font-medium text-[#1B4B91] hover:text-[#0A1F44] dark:text-[#6FA3E0]"
                >
                  Resend code
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4B91] transition-colors duration-150"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Verify &amp; sign in
                </button>
              </form>
            </>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs text-[#64748B] dark:text-gray-500">
            <FiLock className="h-3.5 w-3.5" />
            Your connection is encrypted and secure
          </div>

          <p className="mt-6 text-center text-xs text-[#94A3B8] dark:text-gray-500">
            <a href="#" className="hover:text-[#1B4B91]">
              Terms of Service
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-[#1B4B91]">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-[#1B4B91]">
              Security
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}