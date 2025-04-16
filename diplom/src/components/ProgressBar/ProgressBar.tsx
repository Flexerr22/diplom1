import styles from "./ProgressBar.module.css";
export const ProgressBar = ({ progress }: { progress: number }) => (
  <div className={styles.main}>
    <div className={styles.progressContainer}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <span className={styles.progressText}>{progress}%</span>
  </div>
);
