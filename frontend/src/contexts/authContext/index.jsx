// src/context/index.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // <-- import from your file, adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe; // cleanup
  }, []);

  function initializeUser(user) {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ currentUser, userLoggedIn, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// optional helper
export const useAuth = () => useContext(AuthContext);
