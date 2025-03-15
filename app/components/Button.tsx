import styles from './Button.module.css';

function Button({ children, variant = "default", onClick }: { children: React.ReactNode, variant?: string, onClick: () => void }) {

  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
