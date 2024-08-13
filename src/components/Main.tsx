import LetterBox from "./LetterBox";
import { useEffect, useState, useCallback } from "react";
import KeyboardButton from "./KeyboardButton";
import { getRandomWord } from "../util/FirebaseFunctions";
import { FaBackspace, FaSpinner } from "react-icons/fa";

const alphabetRowOne = "QWERTYUIOP";
const alphabetRowTwo = "ASDFGHJKL";
const alphabetRowThree = "ZXCVBNM";

const Main = () => {
  const [rows] = useState<number>(5);
  const [columns] = useState<number>(5);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [attempts, setAttempts] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(columns).fill("")),
  );
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleLetterClick = useCallback(
    (letter: string) => {
      const newAttempts = [...attempts];
      newAttempts[currentRow][currentColumn] = letter.toUpperCase();

      setAttempts(newAttempts);

      if (currentColumn < columns - 1) {
        setCurrentColumn((prev) => prev + 1);
      }
    },
    [attempts, currentRow, currentColumn, columns],
  );

  const handleEnterClick = useCallback(() => {
    const guess = attempts[currentRow].join("");

    if (guess.length < columns) {
      return; // Ensure the row is filled
    }

    if (guess !== answer) {
      setCurrentRow((prev) => prev + 1);
      setCurrentColumn(0);

      if (currentRow === rows - 1) {
        console.log("You lost!");
      }
    } else {
      alert("You won!");
    }
  }, [attempts, currentRow, columns, rows, answer]);

  const handleBackspaceClick = useCallback(() => {
    if (currentColumn >= 0) {
      const newAttempts = [...attempts];
      newAttempts[currentRow][currentColumn] = "";

      setAttempts(newAttempts);

      if (currentColumn > 0) {
        setCurrentColumn((prev: number) => prev - 1);
      }
    }
  }, [currentColumn, attempts, currentRow]);

  const handleKeyboardEvent = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentColumn < columns - 1) {
        setCurrentColumn((prev: number) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentColumn > 0) {
        setCurrentColumn((prev: number) => prev - 1);
      } else if (e.key === "Enter") {
        handleEnterClick();
      } else if (e.key === "Backspace") {
        handleBackspaceClick();
      } else if (e.key.search(/[a-zA-ZÆØÅæøå]/) !== -1) {
        if (e.key.length === 1) {
          handleLetterClick(e.key);
        }
      }
    },
    [
      currentColumn,
      columns,
      handleEnterClick,
      handleBackspaceClick,
      handleLetterClick,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  useEffect(() => {
    const getWord = async (): Promise<string> => {
      setLoading(true);

      return await getRandomWord({ length: 5, category: "all" });
    };

    getWord().then((word) => {
      setAnswer(word.toUpperCase());
    });

    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col flex-grow w-full items-center mt-4 bg-pink-50">
      {currentRow - 1 === 4 && (
        <p className="text-2xl/8">Spillet er ferdig. Svaret er: {answer}</p>
      )}

      <div className="flex flex-col items-center space-y-2">
        {loading ? (
          <div className="flex space-x-2 items-center">
            <p className="text-base/8 text-neutral-700">Henter nytt ord...</p>
            <FaSpinner className="spinning text-neutral-700" />
          </div>
        ) : (
          <>
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex space-x-2">
                {Array.from({ length: columns }).map((_, j) => (
                  <LetterBox
                    key={j}
                    name={`${i}${j}`}
                    hasFocus={i === currentRow && j === currentColumn}
                    answer={answer}
                    guessedLetter={attempts[i][j]}
                    hasGuessed={i < currentRow}
                    guessedLettersArray={attempts[i]}
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex flex-col my-4 space-y-4">
        <div className="flex flex-wrap w-full space-x-2 items-center justify-center">
          {alphabetRowOne.split("").map((letter, i) => (
            <KeyboardButton
              value={letter}
              OnClick={() => handleLetterClick(letter)}
              key={i}
            />
          ))}
        </div>

        <div className="flex flex-wrap w-full space-x-2 items-center justify-center">
          {alphabetRowTwo.split("").map((letter, i) => (
            <KeyboardButton
              value={letter}
              OnClick={() => handleLetterClick(letter)}
              key={i}
            />
          ))}
        </div>

        <div className="flex flex-wrap w-full space-x-2 items-center justify-center">
          {alphabetRowThree.split("").map((letter, i) => (
            <KeyboardButton
              value={letter}
              OnClick={() => handleLetterClick(letter)}
              key={i}
            />
          ))}
          <button
            onClick={handleBackspaceClick}
            className="flex bg-neutral-100 items-center justify-center border w-10 h-14"
          >
            <FaBackspace />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-full space-y-2">
          <button
            className="flex items-center rounded-full justify-center h-10 border w-1/2 bg-pink-200"
            onClick={handleEnterClick}
          >
            Sjekk
          </button>

          <button
            className="flex items-center rounded-full justify-center h-10 border w-1/2 text-sm text-neutral-800/90 bg-transparent"
            onClick={() => {
              setAttempts(
                Array.from({ length: rows }, () => Array(columns).fill("")),
              );

              setCurrentRow(0);
              setCurrentColumn(0);
            }}
          >
            Gi meg nytt ord
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
