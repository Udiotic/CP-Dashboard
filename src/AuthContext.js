// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { linkWithCredential} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  };

  const logOut = async () => {
    await signOut(auth);
    localStorage.clear(); 
    // Or, to be more specific:
    // localStorage.removeItem('firebase:authUser:YOUR_API_KEY:[DEFAULT]');
    window.location.href = '/';
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
  
      // Check if an account already exists with this email
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
  
      if (methods.length > 0 && !methods.includes('google.com')) {
        // An account exists with email/password, but Google sign-in is not linked
        // We'll link the Google credential to the existing account
        try {
          // Sign out the Google user
          await auth.signOut();
          
          // Sign in with email/password
          const emailSignInResult = await signInWithEmailAndPassword(auth, user.email, prompt("Enter your password to link accounts:"));
          
          // Link the Google credential to this account
          await linkWithCredential(emailSignInResult.user, credential);
          
          console.log("Successfully linked Google account to existing email/password account");
        } catch (linkError) {
          console.error("Error linking accounts:", linkError);
          // Handle the error (e.g., show a message to the user)
        }
      }
  
      return auth.currentUser;
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    logOut,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}