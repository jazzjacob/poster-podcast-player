import Link from "next/link";

const Navbar = () => {

  const style = {
    width: "100%",
    height: 'fit-content',
    padding: '1rem 1rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'end',
    justifyContent: 'space-between',
    borderBottom: '1px solid lightgray'
  };

  return (
    <nav style={style}>
      <Link style={{ fontWeight: 'bold' }} href="/">Poster Podcast Player</Link  >
      <Link href='/admin'>Admin</Link>
      {/* Add your navigation links here */}
    </nav >
  );
};

export default Navbar;
