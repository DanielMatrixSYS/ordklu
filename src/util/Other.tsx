export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} sekund${seconds === 1 ? "" : "er"}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} minutt${minutes === 1 ? "" : "er"} og ${remainingSeconds} sekund${remainingSeconds === 1 ? "" : "er"}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 3600) % 60;

    return `${hours} time${hours === 1 ? "" : "r"}, ${remainingMinutes} minutt${remainingMinutes === 1 ? "" : "er"} og ${remainingSeconds} sekund${remainingSeconds === 1 ? "" : "er"}`;
  }
};
