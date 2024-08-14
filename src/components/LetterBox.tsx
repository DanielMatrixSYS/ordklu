import React, { useEffect, useState } from "react";

interface LetterBoxProps {
  answer: string;
  name: string;
  hasFocus: boolean;
  hasGuessed: boolean;
  guessedLetter: string;
  guessedLettersArray: string[];
  loading: boolean;
  hasWon: boolean;
}

const LetterBox: React.FC<LetterBoxProps> = ({
  answer,
  name,
  hasFocus,
  hasGuessed,
  guessedLetter,
  guessedLettersArray,
  loading,
  hasWon,
}) => {
  const [correctType, setCorrectType] = useState<number>(0);
  const [isWinningRow, setIsWinningRow] = useState<boolean>(false);

  useEffect(() => {
    setCorrectType(0);
  }, [answer, guessedLetter, hasGuessed]);

  useEffect(() => {
    if (hasGuessed && guessedLetter) {
      const columnPosition = parseInt(name[1]);
      const answerArray: string[] = answer.split("");
      const correctTypeArray: number[] = Array(answer.length).fill(0);

      const answerLetterCounts: { [key: string]: number } = {};

      answerArray.forEach((letter) => {
        answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
      });

      for (let i = 0; i < answer.length; i++) {
        if (guessedLettersArray[i] === answerArray[i]) {
          correctTypeArray[i] = 2;
          answerLetterCounts[guessedLettersArray[i]]--;
        }
      }

      for (let i = 0; i < answer.length; i++) {
        if (
          correctTypeArray[i] !== 2 &&
          answer.includes(guessedLettersArray[i]) &&
          answerLetterCounts[guessedLettersArray[i]] > 0
        ) {
          correctTypeArray[i] = 1;
          answerLetterCounts[guessedLettersArray[i]]--;
        }
      }

      if (correctTypeArray.every((type) => type === 2)) {
        setIsWinningRow(true);
      }

      setCorrectType(correctTypeArray[columnPosition]);
    }
  }, [hasGuessed, guessedLetter, answer, name, guessedLettersArray]);

  let boxColor = "bg-neutral-200 border-neutral-300 text-black";

  if (hasFocus) {
    boxColor = `bg-neutral-200 ${!hasWon && "border-blue-600"} border-opacity-60`;
  } else if (correctType === 1) {
    boxColor = "bg-yellow-500 border-yellow-600 text-black";
  } else if (correctType === 2) {
    boxColor = "bg-green-500 border-green-600 text-black";
  }

  return (
    <div
      className={`border ${boxColor} ${hasWon && !isWinningRow && "opacity-75"} w-16 h-16 rounded ${loading ? "animate-pulse" : ""}
      flex items-center justify-center text-center transition-all 
      duration-200 ease-in-out text-2xl`}
    >
      {guessedLetter}
    </div>
  );
};

export default LetterBox;
