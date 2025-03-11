'use client'

import React, { useState, ChangeEvent, useEffect } from 'react';
import { signInUser, signUpUser, signOutUser } from '../firebase/authOperations';
import { setAuthPersistence, auth } from '../firebase/firebaseConfig';
import useStore from '../helpers/store';
import styles from './AuthComponent.module.css';

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [persistence, setPersistence] = useState<'LOCAL' | 'SESSION' | 'NONE'>('LOCAL');

  const user = useStore((state) => state.user);

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
        //await setAuthPersistence(persistence);
        await setAuthPersistence('LOCAL');
        await signInUser(email, password);
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      //setUser(null);
      console.log("Successfully signed out!");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  return (
    <div className={styles.container}>
      {user ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Admin</h1>
          <button
            style={{ fontFamily: "inherit", height: "fit-content", padding: "0.3rem 0.5rem", backgroundColor: "orange", color: "white", border: "none" }}
            onClick={() =>  user ? handleSignOut() : handleSignIn() }>
          {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.inputs}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange(setEmail)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange(setPassword)}
            />
            <button
              className={styles.button}
              onClick={() =>  user ? handleSignOut() : handleSignIn() }>
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>

          {/*
            <select value={persistence} onChange={handlePersistenceChange}>
              <option value="LOCAL">Local Persistence</option>
              <option value="SESSION">Session Persistence</option>
              <option value="NONE">No Persistence</option>
            </select>
          */}
        </>
      )}

        {/*<button onClick={handleCheckAuth}>Check Auth State</button>*/}
        {/*user ? <p>✅ Logged in! Welcome, {user.email}</p> : <p>😢 Not logged in...</p>*/}

    </div>
  );
};

export default AuthComponent;
