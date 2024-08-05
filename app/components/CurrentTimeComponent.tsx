'use client'

import useStore from "../helpers/store";

function CurrentTimeComponent() {
  const currentTime = useStore((store) => store.currentTime);

  return (
    <>
      <p>Current time: {currentTime}</p>
    </>
  );
}

export default CurrentTimeComponent;
