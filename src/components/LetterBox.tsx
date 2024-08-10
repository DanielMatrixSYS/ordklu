import React, { useEffect, useState } from "react";

interface LetterBoxProps {
  answer: string;
  name: string;
  hasFocus: boolean;
  hasGuessed: boolean;
  guessedLetter: string;
  guessedLettersArray: string[];
}

const LetterBox: React.FC<LetterBoxProps> = ({
  answer,
  name,
  hasFocus,
  hasGuessed,
  guessedLetter,
  guessedLettersArray,
}) => {
  const [correctType, setCorrectType] = useState<number>(0);

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

      setCorrectType(correctTypeArray[columnPosition]);
    }
  }, [hasGuessed, guessedLetter, answer, name, guessedLettersArray]);

  let borderColor = "bg-neutral-200 border-neutral-300 text-black";

  if (hasFocus) {
    borderColor = "bg-neutral-200 border-blue-600 border-opacity-60";
  } else if (correctType === 1) {
    borderColor = "bg-yellow-500 border-yellow-600 text-black";
  } else if (correctType === 2) {
    borderColor = "bg-green-500 border-green-600 text-black";
  }

  return (
    <div
      className={`border ${borderColor} w-16 h-16 rounded 
      flex items-center justify-center text-center transition-all 
      duration-200 ease-in-out text-2xl`}
    >
      {guessedLetter}
    </div>
  );
};

export default LetterBox;
