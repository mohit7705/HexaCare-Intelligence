import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { auth, googleProvider } from "./firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

// Main Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import Technology from "./components/Technology";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Background3D from "./components/Background3D";

// Legal Pages
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import Compliance from "./components/Compliance";

/* 🔐 Protected Route */
const ProtectedRoute = ({ user, children }: any) => {
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ NEW: track fresh login intent
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // ✅ Auth state listener (INTENT-BASED redirect)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && justLoggedIn) {
        setShowLogin(false);
        setJustLoggedIn(false);
        navigate("/dashboard"); // ✅ redirect ONLY after login
      }
    });

    getRedirectResult(auth).catch(() => {});
    return () => unsubscribe();
  }, [justLoggedIn, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setJustLoggedIn(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setJustLoggedIn(false);
      alert("Login Failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setJustLoggedIn(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setJustLoggedIn(false);
      if (
        error.code === "auth/popup-blocked" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        alert("Google Login Failed: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-sans">
        Loading HexaCare Intelligence...
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-navy w-full min-h-screen overflow-x-hidden relative">
      <Background3D />

      {/* Navbar only on NON-dashboard pages */}
      {!isDashboardRoute && (
        <Navbar
          user={user}
          onAuthClick={() => setShowLogin(true)}
          onLogout={() => signOut(auth)}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <main className="relative z-10 w-full">
              <Hero user={user} onStart={() => setShowLogin(true)} />
              <About />
              <Features />
              <Technology />
              <Contact />
              <Footer />
            </main>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} onLogout={() => signOut(auth)} />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/compliance" element={<Compliance />} />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />

      </Routes>

      {/* 🔐 Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/60 backdrop-blur-md p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-navy text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              Welcome to HexaCare
            </h2>

            {/* Google Login with Logo */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl mb-6 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.9 2.38 30.47 0 24 0 14.64 0 6.44 5.38 2.56 13.22l7.98 6.19C12.43 13.12 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24c0-1.64-.15-3.22-.43-4.75H24v9.01h12.65c-.55 2.9-2.18 5.36-4.63 7.01l7.18 5.59C43.98 36.27 46.5 30.64 46.5 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.43 14.43 0 010-9.18l-7.98-6.19a23.93 23.93 0 000 21.56l7.98-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.14 15.9-5.81l-7.18-5.59c-2 1.34-4.56 2.13-8.72 2.13-6.26 0-11.57-3.62-13.46-8.91l-7.98 6.19C6.44 42.62 14.64 48 24 48z"
                />
              </svg>

              <span className="text-sm font-semibold text-gray-700">
                Continue with Google
              </span>
            </button>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 border rounded-xl"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 border rounded-xl"
              />
              <button className="w-full bg-techBlue text-white py-4 rounded-xl">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
