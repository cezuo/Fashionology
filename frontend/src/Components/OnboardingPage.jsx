"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import useChatGPTQuestions from "../hooks/useChatGPTQuestions";

const Onboarding = () => {
  const { questions, refreshQuestions, error } = useChatGPTQuestions(); // <- array of 3
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState(1); // 1..3
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]); // [{step, question, answer}]
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch questions once on mount
  useEffect(() => {
    refreshQuestions?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading =
    !questions ||
    questions.length < 3 ||
    questions[0] === "Loading your style questions...";

  const currentQuestion = loading ? "Loading your personalized question..." : questions[step - 1];

  const handleNext = async () => {
    if (!answer.trim() || loading) return;
    setIsLoading(true);

    const newAnswers = [
      ...answers,
      { step, question: currentQuestion, answer: answer.trim() },
    ];
    setAnswers(newAnswers);
    console.log(`Step ${step} Answer:`, answer.trim());

    await new Promise((r) => setTimeout(r, 400));

    setAnswer("");
    setIsLoading(false);

    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("Onboarding complete!", newAnswers);
      navigate("/explore");
    }
  };

  const handleBack = () => {
    if (step === 1) return;
    const prevStep = step - 1;
    setStep(prevStep);

    // restore previous answer (if any)
    const prev = answers.find((a) => a.step === prevStep);
    setAnswer(prev?.answer || "");
  };

  const handleSkip = () => navigate("/explore");

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 left-6 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        Skip for now
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-black to-zinc-700 dark:from-white dark:to-zinc-300 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <img src="/images/logo.png" alt="Fashionology Logo" className="w-20 h-20 object-contain" />
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
            animate={{ boxShadow: "0 0 30px 15px rgba(0,0,0,0.05)" }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-lg backdrop-blur-sm border border-zinc-200 dark:border-zinc-700"
          >
            {/* Step Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === step
                        ? "bg-black dark:bg-white scale-125"
                        : i < step
                        ? "bg-green-500"
                        : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">
                {currentQuestion}
              </h2>

              {/* Optional quick-pick buttons on step 1 */}
              {step === 1 && !loading && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["Casual", "Formal", "Trendy", "Classic"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setAnswer(style)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        answer === style
                          ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                          : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Input */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your answer or select above..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 text-zinc-900 dark:text-zinc-100"
                  disabled={isLoading || loading}
                />
                {answer && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setAnswer("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    disabled={isLoading || loading}
                    className="flex-1 py-3 px-4 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={!answer.trim() || isLoading || loading}
                  className="flex-1 py-3 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>{step < 3 ? "Next" : "Complete Setup"}</>
                  )}
                </button>
              </div>
            </div>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4"
            >
              Your answers help us personalize your fashion experience
            </motion.p>

            {error && (
              <p className="mt-3 text-xs text-red-500 text-center">
                {error} <button className="underline" onClick={refreshQuestions}>Retry</button>
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Press Enter to continue or use the buttons above
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
