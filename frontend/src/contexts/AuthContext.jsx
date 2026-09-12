import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../../backend/src/config/firebase.js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const signOut = () => firebaseSignOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const value = { currentUser, loading, signOut, resetPassword };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
