import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHash,
  FiUpload,
  FiShield,
  FiCheckCircle,
  FiChevronLeft,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Input from "../components/ui/Input";

const STEPS = [
  { key: "personal", label: "Personal info" },
  { key: "contact", label: "Address" },
  { key: "identity", label: "Identity" },
  { key: "credentials", label: "Login" },
  { key: "review", label: "Review" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
];

interface FormState {
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  email: string;
  phone: string;
  street: string;
  aptUnit: string;
  city: string;
  state: string;
  zip: string;
  idType: string;
  idFrontFile: string;
  idBackFile: string;
  userId: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  agreeCip: boolean;
  agreeEsign: boolean;
  agreeTerms: boolean;
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  dob: "",
  ssn: "",
  email: "",
  phone: "",
  street: "",
  aptUnit: "",
  city: "",
  state: "",
  zip: "",
  idType: "",
  idFrontFile: "",
  idBackFile: "",
  userId: "",
  password: "",
  confirmPassword: "",
  securityQuestion: "",
  securityAnswer: "",
  agreeCip: false,
  agreeEsign: false,
  agreeTerms: false,
};

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                i < currentIndex
                  ? "bg-[#0A1F44] border-[#0A1F44] text-white"
                  : i === currentIndex
                  ? "border-[#0A1F44] text-[#0A1F44]"
                  : "border-gray-200 text-gray-300 dark:border-gray-700"
              }`}
            >
              {i < currentIndex ? <FiCheck className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={`hidden sm:block text-[10px] font-medium whitespace-nowrap ${
                i <= currentIndex
                  ? "text-[#0A1F44] dark:text-white"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-1.5 -mt-4 sm:-mt-4 ${
                i < currentIndex ? "bg-[#0A1F44]" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Signup() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const step: StepKey = STEPS[stepIndex].key;

  const update = (field: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const goNext = () => {
    setError("");
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => {
    setError("");
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const validateStep = (): string | null => {
    switch (step) {
      case "personal":
        if (!form.firstName || !form.lastName)
          return "Enter your full legal name";
        if (!form.dob) return "Enter your date of birth";
        if (!/^\d{3}-?\d{2}-?\d{4}$/.test(form.ssn))
          return "Enter a valid Social Security Number";
        return null;
      case "contact":
        if (!form.email || !form.phone)
          return "Email and phone number are required";
        if (!form.street || !form.city || !form.state || !form.zip)
          return "A physical residential address is required";
        if (/^p\.?o\.?\s*box/i.test(form.street))
          return "We can't accept a P.O. Box as your residential address";
        return null;
      case "identity":
        if (!form.idType) return "Select the type of ID you're providing";
        if (!form.idFrontFile)
          return "Upload the front of your government-issued ID";
        return null;
      case "credentials":
        if (!form.userId) return "Choose a User ID";
        if (!form.password || form.password.length < 8)
          return "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword)
          return "Passwords do not match";
        if (!form.securityQuestion || !form.securityAnswer)
          return "Set up a security question in case you're ever locked out";
        return null;
      default:
        return null;
    }
  };

  const handleContinue = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    goNext();
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.agreeCip || !form.agreeEsign || !form.agreeTerms) {
      setError("Please review and accept all agreements to continue");
      return;
    }
    try {
      await signup(form.email);
      navigate("/");
    } catch (err) {
      setError("We couldn't open your account. Please try again.");
    }
  };

  const mockUpload = (field: "idFrontFile" | "idBackFile") => {
    update(field, "id-upload.jpg");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F7FA] dark:bg-[#0A1120]">
      {/* Left side - Brand panel */}
      <div className="hidden md:flex md:w-[40%] relative overflow-hidden flex-col justify-between bg-[#0A1F44] text-white">
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
            Open an account in minutes
          </h1>
          <p className="text-white/70 text-base max-w-sm mb-10">
            Federal law requires us to verify your identity before opening
            an account — it only takes a few steps.
          </p>

          <ul className="space-y-4 max-w-sm">
            <li className="flex items-start gap-3">
              <FiCheckCircle className="mt-0.5 h-5 w-5 text-[#C9A227] flex-shrink-0" />
              <span className="text-sm text-white/80">
                No monthly maintenance fees
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FiShield className="mt-0.5 h-5 w-5 text-[#C9A227] flex-shrink-0" />
              <span className="text-sm text-white/80">
                256-bit encryption on every session
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

      {/* Right side - Wizard */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-[460px]">
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <Logo />
            <span className="text-lg font-semibold text-[#0A1F44] dark:text-white">
              Woodsboro Bank
            </span>
          </div>

          <StepIndicator currentIndex={stepIndex} />

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0A1F44] dark:text-gray-400 mb-4"
            >
              <FiChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm border border-red-100 dark:border-red-900/40 mb-5">
              {error}
            </div>
          )}

          {/* STEP 1: Personal info */}
          {step === "personal" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Tell us about yourself
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  Already bank with us?{" "}
                  <a
                    href="/login"
                    className="font-medium text-[#1B4B91] hover:text-[#0A1F44] dark:text-[#6FA3E0]"
                  >
                    Sign in
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Legal first name"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Jordan"
                  icon={<FiUser className="h-5 w-5 text-gray-400" />}
                  required
                />
                <Input
                  label="Legal last name"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Rivera"
                  required
                />
              </div>

              <Input
                label="Date of birth"
                type="date"
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
                icon={<FiCalendar className="h-5 w-5 text-gray-400" />}
                required
              />

              <Input
                label="Social Security Number"
                type="text"
                value={form.ssn}
                onChange={(e) => update("ssn", e.target.value)}
                placeholder="XXX-XX-XXXX"
                icon={<FiHash className="h-5 w-5 text-gray-400" />}
                required
              />
              <p className="text-xs text-[#94A3B8] -mt-3">
                Required by federal law to verify your identity. We never
                share this outside of required regulatory reporting.
              </p>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors duration-150"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Contact & address */}
          {step === "contact" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  How can we reach you?
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  A physical residential address is required — we can't
                  accept P.O. Boxes.
                </p>
              </div>

              <Input
                label="Email address"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                icon={<FiMail className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Mobile phone number"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(555) 123-4567"
                icon={<FiPhone className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Street address"
                type="text"
                value={form.street}
                onChange={(e) => update("street", e.target.value)}
                placeholder="123 Main St"
                icon={<FiMapPin className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Apt / Unit (optional)"
                type="text"
                value={form.aptUnit}
                onChange={(e) => update("aptUnit", e.target.value)}
                placeholder="Apt 4B"
              />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Input
                    label="City"
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Austin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-1.5">
                    State
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="w-full h-[46px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                    required
                  >
                    <option value="">--</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="ZIP code"
                  type="text"
                  value={form.zip}
                  onChange={(e) => update("zip", e.target.value)}
                  placeholder="73301"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors duration-150"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: Identity verification */}
          {step === "identity" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Verify your identity
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  Upload a government-issued photo ID. This is required under
                  federal Customer Identification Program rules.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-1.5">
                  ID type
                </label>
                <select
                  value={form.idType}
                  onChange={(e) => update("idType", e.target.value)}
                  className="w-full h-[46px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                  required
                >
                  <option value="">Select an ID type</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="state_id">State ID Card</option>
                  <option value="passport">U.S. Passport</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => mockUpload("idFrontFile")}
                className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed text-sm transition-colors ${
                  form.idFrontFile
                    ? "border-[#0A1F44] bg-[#0A1F44]/5 text-[#0A1F44]"
                    : "border-gray-200 text-gray-400 hover:border-[#1B4B91] hover:text-[#1B4B91] dark:border-gray-700"
                }`}
              >
                {form.idFrontFile ? (
                  <FiCheckCircle className="h-6 w-6" />
                ) : (
                  <FiUpload className="h-6 w-6" />
                )}
                {form.idFrontFile ? "Front uploaded" : "Upload front of ID"}
              </button>

              <button
                type="button"
                onClick={() => mockUpload("idBackFile")}
                className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed text-sm transition-colors ${
                  form.idBackFile
                    ? "border-[#0A1F44] bg-[#0A1F44]/5 text-[#0A1F44]"
                    : "border-gray-200 text-gray-400 hover:border-[#1B4B91] hover:text-[#1B4B91] dark:border-gray-700"
                }`}
              >
                {form.idBackFile ? (
                  <FiCheckCircle className="h-6 w-6" />
                ) : (
                  <FiUpload className="h-6 w-6" />
                )}
                {form.idBackFile ? "Back uploaded" : "Upload back of ID (optional)"}
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors duration-150"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 4: Credentials */}
          {step === "credentials" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Create your login
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  You'll use this User ID and password to sign in going
                  forward.
                </p>
              </div>

              <Input
                label="User ID"
                type="text"
                value={form.userId}
                onChange={(e) => update("userId", e.target.value)}
                placeholder="Choose a User ID"
                icon={<FiUser className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 8 characters"
                icon={<FiLock className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="••••••••"
                icon={<FiLock className="h-5 w-5 text-gray-400" />}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-1.5">
                  Security question
                </label>
                <select
                  value={form.securityQuestion}
                  onChange={(e) => update("securityQuestion", e.target.value)}
                  className="w-full h-[46px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                  required
                >
                  <option value="">Select a question</option>
                  <option value="pet">What was your first pet's name?</option>
                  <option value="school">
                    What elementary school did you attend?
                  </option>
                  <option value="city">
                    In what city did your parents meet?
                  </option>
                </select>
              </div>
              <Input
                label="Answer"
                type="text"
                value={form.securityAnswer}
                onChange={(e) => update("securityAnswer", e.target.value)}
                placeholder="Your answer"
                required
              />

              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors duration-150"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 5: Review & consent */}
          {step === "review" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
                  Review &amp; confirm
                </h2>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-gray-400">
                  Check your details before opening your account.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#64748B]">Name</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {form.firstName} {form.lastName}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#64748B]">Date of birth</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {form.dob || "—"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#64748B]">Email</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {form.email}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#64748B]">Phone</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {form.phone}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 gap-4">
                  <span className="text-[#64748B] flex-shrink-0">
                    Address
                  </span>
                  <span className="text-[#0A1F44] dark:text-white font-medium text-right">
                    {form.street}
                    {form.aptUnit ? `, ${form.aptUnit}` : ""}, {form.city},{" "}
                    {form.state} {form.zip}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#64748B]">User ID</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {form.userId}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeCip}
                    onChange={(e) => update("agreeCip", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1B4B91] focus:ring-[#1B4B91]"
                  />
                  <span className="text-[#334155] dark:text-gray-300">
                    I have received and reviewed the{" "}
                    <a href="#" className="text-[#1B4B91] hover:underline">
                      Customer Identification Program Notice
                    </a>{" "}
                    required under the USA PATRIOT Act.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeEsign}
                    onChange={(e) => update("agreeEsign", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1B4B91] focus:ring-[#1B4B91]"
                  />
                  <span className="text-[#334155] dark:text-gray-300">
                    I agree to receive account documents electronically (
                    <a href="#" className="text-[#1B4B91] hover:underline">
                      E-Sign Consent
                    </a>
                    ).
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => update("agreeTerms", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1B4B91] focus:ring-[#1B4B91]"
                  />
                  <span className="text-[#334155] dark:text-gray-300">
                    I agree to the{" "}
                    <a href="#" className="text-[#1B4B91] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#1B4B91] hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
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
                {isLoading ? "Opening your account..." : "Open my account"}
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs text-[#64748B] dark:text-gray-500">
            <FiLock className="h-3.5 w-3.5" />
            Your information is encrypted and never shared without consent
          </div>
        </div>
      </div>
    </div>
  );
}