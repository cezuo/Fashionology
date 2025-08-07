import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { auth, provider, signInWithPopup } from "../firebase"; // Firebase setup
import { useNavigate } from "react-router-dom"; // Import useNavigate

export function WelcomePageCard() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate(); // Initialize navigate hook

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(""); // Clear previous errors
      const result = await signInWithPopup(auth, provider);
      console.log(result.user); // Log user info for debugging
      console.log("Navigating to onboarding");
      navigate("/onboarding"); // Navigate to onboarding page after successful sign-in
    } catch (error) {
      console.error("Google Sign In Error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up validation
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }

        // Firebase Sign Up
        const result = await auth.createUserWithEmailAndPassword(email, password);
        console.log(result.user);
        console.log("Navigating to onboarding");
        navigate("/onboarding"); // Redirect to onboarding after successful sign-up
      } else {
        // Email Login
        const result = await auth.signInWithEmailAndPassword(email, password);
        console.log(result.user);
        console.log("Navigating to onboarding");
        navigate("/onboarding"); // Redirect to onboarding after successful sign-in
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-zinc-900 bg-opacity-95 dark:bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm w-full max-w-md relative"
    >
      {/* Theme toggle button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>

      {/* Card content */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-4"
        >
          <img src="/images/logo.png" alt="Fashionology Logo" className="w-24 h-24 object-contain" />
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
            animate={{ boxShadow: "0 0 20px 10px rgba(0,0,0,0.1)" }}
            transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>

        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
          {isSignUp ? "Join Fashionology" : "Welcome Back"}
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          {isSignUp ? "Create an account to discover fashion trends" : "Sign in to continue your fashion journey"}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Email form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full h-11 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-500 focus:border-black dark:focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>

            {!isSignUp && (
              <button
                type="button"
                onClick={() => alert("Password reset functionality would go here")}
                className="text-xs text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full h-11 px-3 py-2 pr-10 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-500 focus:border-black dark:focus:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Sign In / Sign Up button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-black hover:bg-zinc-800 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isSignUp ? "Creating Account..." : "Signing In..."}
            </>
          ) : (
            <>{isSignUp ? "Create Account" : "Sign In"}</>
          )}
        </button>
      </form>

      {/* Google Sign-In Button */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">OR CONTINUE WITH</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-11 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
        Google
      </button>

      {/* Switch to Sign-In / Sign-Up */}
      <div className="mt-6 text-center text-sm">
        {isSignUp ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
              className="font-medium text-black dark:text-white hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
              className="font-medium text-black dark:text-white hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        )}
      </div>
    </motion.div>
  );
}
