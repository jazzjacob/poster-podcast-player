import Link from "next/link";

const Navbar = () => {

  const style = {
    width: "100%",
    height: 'fit-content',
    padding: '1rem 2rem',
    backgroundColor: 'lightgray',
    display: 'flex',
    gap: '1rem',
    alignItems: 'end'
  };

  return (
    <nav style={style}>
      <h1>My Navbar</h1>
      <Link href="/">Home</Link >
      <Link href='/login'>Login</Link>
      {/* Add your navigation links here */}
    </nav >
  );
};

export default Navbar;
