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

export interface WordInterface {
  id: number;
  length: number;
  category: string;
  description: string;
  difficulty: number;
  language: string;
}

export interface RetrievedWordInterface extends WordInterface {
  word: string;
}

export function stringToBoolean(str: string): boolean {
  const normalizedStr = str.trim().toLowerCase();

  return (
    normalizedStr === "true" ||
    normalizedStr === "1" ||
    normalizedStr === "yes" ||
    normalizedStr === "y"
  );
}
