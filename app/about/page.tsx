'use client'

import Link from "next/link";
import useStore from "../helpers/store";

export default function Page() {
  const user = useStore((state) => state.user);

  return (
    <div>
      <h1>This is the about page</h1>
      <Link href={"/"}>Go back</Link>
      <button onClick={() => console.log(user)}>Print user</button >
      {user ? (
        <p>Logged in!</p>
      ) : (
        <p>not logged in... .(</p>
      )}
    </div>
  );
};
