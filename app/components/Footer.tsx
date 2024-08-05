  const style = {
    width: "100%",
    height: 'fit-content',
    padding: '1rem 2rem 4rem 2rem',
    borderTop: '1px solid lightgray',
  };

  const textStyle = {
    marginTop: '1rem',
    color: '#a4a5a6',
    fontSize: '0.8rem'
  }

const Footer = () => {

  return (
    <footer style={style}>
      <p style={textStyle}>Poster Podcast Player - Made by Jacob Reinikainen Lindström</p  >
      {/* Add your footer content here */}
    </footer >
  );
};

export default Footer;
