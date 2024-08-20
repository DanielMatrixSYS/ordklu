import LetterBox from "./LetterBox";
import React, { useEffect, useState, useCallback, ReactElement } from "react";
import KeyboardButton from "./KeyboardButton";
import { getRandomWord } from "../util/FirebaseFunctions";
import "../index.css";
import { FaBackspace, FaSpinner } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";
import { addSolvedWord } from "../util/FirebaseFunctions";
import Button from "./Button.tsx";

const alphabetRowOne = "QWERTYUIOPÅ";
const alphabetRowTwo = "ASDFGHJKLÆØ";
const alphabetRowThree = "ZXCVBNM";

const Main = (): ReactElement => {
  const [rows] = useState<number>(5);
  const [columns] = useState<number>(5);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [attempts, setAttempts] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(columns).fill("")),
  );
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [won, setWon] = useState<boolean>(false);

  const handleLetterClick = useCallback(
    (letter: string): void => {
      const newAttempts = [...attempts];
      newAttempts[currentRow][currentColumn] = letter.toUpperCase();

      setAttempts(newAttempts);

      if (currentColumn < columns - 1) {
        setCurrentColumn((prev): number => prev + 1);
      }
    },

    [attempts, currentRow, currentColumn, columns],
  );

  const handleEnterClick = useCallback((): void => {
    const guess = attempts[currentRow].join("");

    if (guess.length < columns) {
      return; // Ensure the row is filled
    }

    if (guess !== answer) {
      setCurrentRow((prev): number => prev + 1);
      setCurrentColumn(0);

      if (currentRow === rows - 1) {
        console.log("You lost!");
      }
    } else {
      setCurrentRow((prev) => prev + 1);
      setWon(true);

      addSolvedWord(answer);
    }
  }, [attempts, currentRow, columns, rows, answer]);

  const handleBackspaceClick = useCallback((): void => {
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

  const shouldDisplayKeyboard = (): boolean => {
    if (won) return false;

    return currentRow - 1 !== rows - 1;
  };

  useEffect((): (() => void) => {
    document.addEventListener("keydown", handleKeyboardEvent);

    return (): void => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  useEffect((): void => {
    const getWord = async (): Promise<string> => {
      setLoading(true);

      return await getRandomWord({ length: 5, category: "all" });
    };

    getWord().then((word): void => {
      setAnswer(word.toUpperCase());
    });

    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col flex-grow w-full items-center mt-4 bg-pink-50">
      <div className="flex flex-col items-center space-y-2">
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
                loading={loading}
                hasWon={won}
              />
            ))}
          </div>
        ))}

        {loading && (
          <div className="flex space-x-2 items-center">
            <p className="text-base/8 text-neutral-700">Henter nytt ord...</p>
            <FaSpinner className="animate-spin text-neutral-700" />
          </div>
        )}

        {won && (
          <div className="flex space-x-2 items-center">
            <p className="text-base/8 text-green-600">
              Gratulerer, du klarte det!
            </p>
          </div>
        )}

        {currentRow - 1 === rows - 1 && !won && (
          <div className="flex flex-col items-center">
            <p className="text-base/8 text-red-600">
              Beklager, du klarte det ikke :(
            </p>
            <p className="text-sm text-neutral-700">
              Riktig svar var: {answer}
            </p>
          </div>
        )}

        {!won &&
          currentRow - 1 < rows - 1 &&
          attempts[currentRow].join("").length === columns && (
            <div className="flex flex-row items-center justify-center w-36">
              <Button
                value="Sjekk"
                disabled={loading}
                onClick={handleEnterClick}
              />
            </div>
          )}
      </div>

      <div className="flex flex-col mt-2 space-y-4 w-full">
        {shouldDisplayKeyboard() && (
          <>
            <div className="flex flex-wrap w-full space-x-2 items-center justify-center">
              {alphabetRowOne.split("").map((letter, i) => (
                <KeyboardButton
                  value={letter}
                  OnClick={(): void => handleLetterClick(letter)}
                  key={i}
                  loading={loading}
                />
              ))}
            </div>

            <div className="flex flex-wrap w-full space-x-2 items-center justify-center">
              {alphabetRowTwo.split("").map((letter, i) => (
                <KeyboardButton
                  value={letter}
                  OnClick={(): void => handleLetterClick(letter)}
                  key={i}
                  loading={loading}
                />
              ))}
            </div>

            <div className="flex flex-wrap w-full space-x-2 items-center justify-center">
              <button
                onClick={handleEnterClick}
                className="flex bg-neutral-100 items-center justify-center border w-10 h-14"
              >
                <IoMdReturnLeft />
              </button>

              {alphabetRowThree.split("").map((letter, i) => (
                <KeyboardButton
                  value={letter}
                  OnClick={(): void => handleLetterClick(letter)}
                  key={i}
                  loading={loading}
                />
              ))}

              <button
                onClick={handleBackspaceClick}
                className="flex bg-neutral-100 items-center justify-center border w-10 h-14"
              >
                <FaBackspace />
              </button>
            </div>
          </>
        )}

        <div className="flex flex-col items-center justify-center w-full space-y-2 px-2">
          <button
            className={`p-2 border border-blue-700 mt-8 text-sm w-full rounded-full ${won || currentRow - 1 === rows - 1 ? "bg-blue-700 text-white" : "border border-blue-700 text-blue-700"}`}
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
              // This is a special button, that is why we don't want to use the default buttons.

              // Remove focus from the button.
              // So the user can use the keyboard to play the game.
              if (e.currentTarget) {
                e.currentTarget.blur();
              }

              setLoading(true);
              setAttempts(
                Array.from({ length: rows }, () => Array(columns).fill("")),
              );

              setCurrentRow(0);
              setCurrentColumn(0);
              setWon(false);

              await getRandomWord({ length: 5, category: "all" }).then(
                (word: string) => {
                  setAnswer(word.toUpperCase());
                  setLoading(false);
                },
              );
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
