import styles from './Button.module.css';

function Button({ title, type }: { title: string, type: string }) {

  let style;
  if (type == "main") {
    style = {
      backgroundColor: "dodgerblue",
      color: "white",
    }
  } else {
    style = {
      backgroundColor: "lightgray",
      color: "black"
    }
  }

  return (
    <button
      className={styles.button}
      style={style}
    >
      {title}
    </button>
  );
}

export default Button;
