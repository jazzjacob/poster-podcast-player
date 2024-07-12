import React, { useState, ChangeEvent, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { signInUser, signUpUser, signOutUser } from '../firebase/authOperations';
import { setAuthPersistence, auth } from '../firebase/firebaseConfig';

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [persistence, setPersistence] = useState<'LOCAL' | 'SESSION' | 'NONE'>('LOCAL');

  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.value);
  };



  const handlePersistenceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPersistence(e.target.value as 'LOCAL' | 'SESSION' | 'NONE');
  };

  const handleSignIn = async () => {
    if (email == "" || password == "") {
      console.log("Please enter email and password!");
    } else {
      try {
        await setAuthPersistence(persistence);
        const user = await signInUser(email, password);
        setUser(user);
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }
  };

  const handleSignUp = async () => {
    try {
      await setAuthPersistence(persistence);
      const user = await signUpUser(email, password);
      setUser(user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      console.log("Successfully signed out!");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCheckAuth = () => {
    if (user) {
      console.log('User is signed in:', user);
    } else {
      console.log('No user is signed in');
    }
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      <h1>Authentication</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChange(setEmail)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChange(setPassword)}
      />
      <select value={persistence} onChange={handlePersistenceChange}>
        <option value="LOCAL">Local Persistence</option>
        <option value="SESSION">Session Persistence</option>
        <option value="NONE">No Persistence</option>
      </select>
      <button
        style={{ margin: "0 1rem" }}
        onClick={() =>  user ? handleSignOut() : handleSignIn() }>
      {user ? 'Sign Out' : 'Sign In'}
      </button>
      <button onClick={handleCheckAuth}>Check Auth State</button>
      {user ? <p>✅ Logged in!</p> : <p>😢 Not logged in...</p>}
      {user && <p>Welcome, {user.email}</p>}
    </div >
  );
};

export default AuthComponent;
