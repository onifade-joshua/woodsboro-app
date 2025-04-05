import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoadingFallback from "./components/LoadingFallback";
import ProtectedRoute from "./components/ProtectedRoute";
import withLogging from "./utils/withLogging"; // Import the logging HOC

// Lazy load and wrap components with logging
const Login = withLogging(lazy(() => import("./pages/Login")));
const Signup = withLogging(lazy(() => import("./pages/Signup"))); // <== Add Signup Page
const Dashboard = withLogging(lazy(() => import("./pages/Dashboard")));
const Transactions = withLogging(lazy(() => import("./pages/Transactions")));
const Investments = withLogging(lazy(() => import("./pages/Investments")));
const Savings = withLogging(lazy(() => import("./pages/Savings")));
const Profile = withLogging(lazy(() => import("./pages/Profile")));

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/signup" // <== Add Signup Route
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Signup />
                  </Suspense>
                }
              />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route
                    path="/"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Transactions />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/investments"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Investments />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/savings"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Savings />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Profile />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
