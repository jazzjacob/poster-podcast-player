import Link from "next/link";

const Navbar = () => {

  const style = {
    width: "100%",
    height: 'fit-content',
    padding: '1rem 2rem',
    backgroundColor: 'lightgray'
  };

  return (
    <nav style={style}>
      <h1>My Navbar</h1>
      <Link href="/">Home</Link >
      {/* Add your navigation links here */}
    </nav >
  );
};

export default Navbar;
