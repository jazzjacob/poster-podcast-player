'use client';

import { getAuth } from "firebase/auth";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import useStore from "../helpers/store";
import AddEpisodeComponent from "./AddEpisodeComponent";
import { usePathname } from 'next/navigation';
import Link from "next/link";

function AdminToolsBanner() {
  const pathname = usePathname();
  const auth = getAuth();
  const { user, loading } = useAuth();
  const podcastPattern = /^\/podcasts\/[^/]+\/episodes\/[^/]+$/;
  const editModePattern = /^\/podcasts\/[^/]+\/episodes\/[^/]+\/edit-mode+$/;
  console.log(pathname);

  // Check if the current path matches the podcast episode pattern
  const isPodcastEpisodePage = podcastPattern.test(pathname);

  // Check if the current path matches the edit mode pattern
  const isEditModePage = editModePattern.test(pathname);

  const style = {
    width: '100%',
    backgroundColor: 'dodgerblue',
    color: 'white',
    position: 'fixed' as 'fixed',
    bottom: "0",
    left: '0',
    zIndex: '1000'
  };

  if (!user) {
    return null; // If the user is not logged in, do not display the banner
  }

  return (
    <div style={style}>
      <p>This is the admin tools banner</p>
      {loading ? (
        <p>Loading...</p> // Display a loading message if the authentication state is still being determined
      ) : (
        <>
          <p>User logged in: {user.email}</p>
          {isPodcastEpisodePage && (
            <Link style={{ textDecoration: 'underline' }} href={pathname + '/edit-mode'}>
              Turn on edit mode
            </Link>
          )}
          {isEditModePage && (
            <Link style={{ textDecoration: 'underline' }} href={pathname.replace('/edit-mode', '')}>
              Turn off edit mode
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default AdminToolsBanner;
