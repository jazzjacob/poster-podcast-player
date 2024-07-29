'use client';

import { getAuth } from "firebase/auth";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import useStore from "../helpers/store";

function AdminToolsBanner() {
  const auth = getAuth();
  const { user, loading } = useAuth();
  //const user = useStore((state) => state.user);
  //let loading = false;

  const style = {
    width: '100%',
    backgroundColor: 'dodgerblue',
    color: 'white',
    position: 'fixed' as 'fixed',
    bottom: "0",
    left: '0',
    zIndex: '1000'
  }

  return (
    <div style={style}>
      <p>This is the admin tools banner</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {user && (
              <p>User logged in: {user.email}</p>
            )}
          {!user && (
            <p>No user signed in...</p>
          )}
        </>
      )}
    </div >
  );
}

export default AdminToolsBanner;
