import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Sign in user
export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token
    const idToken = await user.getIdToken();

    // Send the token to your server
    const response = await fetch('/api/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    });

    const data = await response.json();
    console.log('Token successfully set:', data);

    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign up user
export const signUpUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
