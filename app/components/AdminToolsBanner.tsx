

function AdminToolsBanner() {
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
    <div style={style}>This is the admin tools banner</div >
  );
}

export default AdminToolsBanner;
