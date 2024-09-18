import LetterBox from "./LetterBox";
import React, {
  useEffect,
  useState,
  useCallback,
  ReactElement,
  useContext,
} from "react";
import KeyboardButton from "./KeyboardButton";
import "../index.css";
import { FaBackspace, FaSpinner } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";
import {
  addSolvedWord,
  addSolvedDailyWord,
  hasUserSolvedDailyWord,
} from "../util/FirebaseFunctions";
import Button from "./Button.tsx";
import { WordInterface, stringToBoolean, formatTime } from "../util/Other.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import AltButton from "./AltButton.tsx";
import { fetchDailyWord, fetchCustomWord } from "../util/PostgresqlFunctions";
import { AuthContext, AuthContextProps } from "./Auth/AuthContext.tsx";

const alphabetRowOne = "QWERTYUIOPÅ";
const alphabetRowTwo = "ASDFGHJKLÆØ";
const alphabetRowThree = "ZXCVBNM";

const Main = (): ReactElement => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { user, loading } = useContext(AuthContext) as AuthContextProps;

  const length = searchParams.get("length") ?? "5";
  const difficulty = searchParams.get("difficulty") ?? "1";
  const category = searchParams.get("category") ?? "all";
  const language = searchParams.get("language") ?? "NO";
  const isDaily = searchParams.get("daily") ?? "false";

  const [rows] = useState<number>(5);
  const [columns] = useState<number>(parseInt(length, 10));
  const [answer, setAnswer] = useState<string>("");
  const [hasSolvedDaily, setHasSolvedDaily] = useState<boolean>(false);
  const [hasSolvedDailyPreviously, setHasSolvedDailyPreviously] =
    useState<boolean>(false);
  const [wordData, setWordData] = useState<WordInterface>();
  const [gettingWord, setGettingWord] = useState<boolean>(true);

  const [gameState, setGameState] = useState({
    currentRow: 0,
    currentColumn: 0,
    won: false,
    attempts: Array.from({ length: rows }, () => Array(columns).fill("")),
    gameFinished: false,
    timeTaken: 0,
  });

  const setCurrentRow = (row: number): void => {
    setGameState((prev) => ({ ...prev, currentRow: row }));
  };

  const setCurrentColumn = (column: number): void => {
    setGameState((prev) => ({ ...prev, currentColumn: column }));
  };

  const setWon = (won: boolean): void => {
    setGameState((prev) => ({ ...prev, won }));
  };

  const setAttempts = (attempts: string[][]): void => {
    setGameState((prev) => ({ ...prev, attempts }));
  };

  const setGameFinished = (gameFinished: boolean): void => {
    setGameState((prev) => ({ ...prev, gameFinished }));
  };

  const setTimer = (time: number): void => {
    setGameState((prev) => ({ ...prev, timeTaken: time }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (gameState.gameFinished) return;

      setTimer(gameState.timeTaken + 1);
    }, 1000);

    return (): void => {
      clearTimeout(timer);
    };
  }, [gameState.timeTaken, gameState.gameFinished]);

  const getWord = async (): Promise<string> => {
    setGettingWord(true);

    try {
      const isDailyBoolean = stringToBoolean(isDaily.toString());
      const fetchedData = isDailyBoolean
        ? await fetchDailyWord()
        : await fetchCustomWord(
            parseInt(length, 10),
            parseInt(difficulty, 10),
            category,
            language,
          );

      if (isDailyBoolean) {
        const hasSolved = await hasUserSolvedDailyWord(fetchedData.word);
        setHasSolvedDaily(hasSolved);
        setGameFinished(hasSolved);
        setHasSolvedDailyPreviously(hasSolved);

        if (hasSolved) {
          setGameState({
            currentRow: 0,
            currentColumn: 0,
            won: true,
            attempts: Array.from({ length: rows }, () =>
              Array(columns).fill(""),
            ),
            gameFinished: true,
            timeTaken: 0,
          });

          for (let i = 0; i < columns; i++) {
            gameState.attempts[0][i] = fetchedData.word[i].toUpperCase();
          }

          return fetchedData.word.toUpperCase();
        }
      }

      const answer = fetchedData.word.toUpperCase();

      setGameState({
        currentRow: 0,
        currentColumn: 0,
        won: false,
        attempts: Array.from({ length: rows }, () => Array(columns).fill("")),
        gameFinished: false,
        timeTaken: 0,
      });

      setWordData(fetchedData);
      setAnswer(answer);

      return answer;
    } catch (error) {
      console.error(error);
      return "";
    } finally {
      setGettingWord(false);
    }
  };

  const renderKeyboardRow = (letters: string[]) => (
    <div className="flex flex-wrap w-full space-x-[3px] items-center justify-center">
      {letters.map((letter, i) => (
        <KeyboardButton
          value={letter}
          OnClick={(): void => handleLetterClick(letter)}
          key={i}
          loading={gettingWord}
        />
      ))}
    </div>
  );

  const handleLetterClick = useCallback(
    (letter: string): void => {
      if (gameState.gameFinished) return;

      const newAttempts = gameState.attempts;

      newAttempts[gameState.currentRow][gameState.currentColumn] =
        letter.toUpperCase();

      setAttempts(newAttempts);

      if (gameState.currentColumn < columns - 1) {
        setCurrentColumn(gameState.currentColumn + 1);
      }
    },

    [gameState, columns],
  );

  const handleEnterClick = useCallback((): void => {
    const guess = gameState.attempts[gameState.currentRow].join("") ?? "";

    if (guess.length < columns) {
      return; // Ensure the row is filled
    }

    if (guess !== answer) {
      setCurrentRow(gameState.currentRow + 1);
      setCurrentColumn(0);

      if (gameState.currentRow === rows - 1) {
        playGameoverSound();
        setGameFinished(true);

        if (stringToBoolean(isDaily)) {
          addSolvedDailyWord(
            answer,
            gameState.attempts.filter((a) => a.join("").length > 0).length,
            gameState.timeTaken,
            false,
            new Date().toISOString(),
          );

          setHasSolvedDaily(true);

          return;
        }

        addSolvedWord(
          answer,
          gameState.attempts.filter((a) => a.join("").length > 0).length,
          gameState.timeTaken,
          false,
          new Date().toISOString(),
        );
      } else {
        playErrorSound();
      }
    } else {
      setCurrentRow(gameState.currentRow + 1);
      setWon(true);
      setGameFinished(true);
      playWinningSound();

      if (stringToBoolean(isDaily)) {
        addSolvedDailyWord(
          answer,
          gameState.attempts.filter((a) => a.join("").length > 0).length,
          gameState.timeTaken,
          true,
          new Date().toISOString(),
        );

        setHasSolvedDaily(true);

        return;
      }

      addSolvedWord(
        answer,
        gameState.attempts.filter((a) => a.join("").length > 0).length,
        gameState.timeTaken,
        true,
        new Date().toISOString(),
      );
    }
  }, [gameState, answer, rows, columns]);

  const handleBackspaceClick = useCallback((): void => {
    if (gameState.currentColumn >= 0) {
      const newAttempts = gameState.attempts;
      newAttempts[gameState.currentRow][gameState.currentColumn] = "";

      setAttempts(newAttempts);

      if (gameState.currentColumn > 0) {
        setCurrentColumn(gameState.currentColumn - 1);
      }
    }
  }, [gameState]);

  const handleKeyboardEvent = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && gameState.currentColumn < columns - 1) {
        setCurrentColumn(gameState.currentColumn + 1);
      } else if (e.key === "ArrowLeft" && gameState.currentColumn > 0) {
        setCurrentColumn(gameState.currentColumn - 1);
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
      gameState,
      columns,
      handleEnterClick,
      handleBackspaceClick,
      handleLetterClick,
    ],
  );

  const playWinningSound = (): void => {
    const audio = new Audio("/sounds/solved.mp3");

    audio.play();

    audio.onended = (): void => {
      audio.remove();
    };

    audio.onerror = (): void => {
      console.error("Error playing audio");
    };
  };

  const playErrorSound = (): void => {
    const audio = new Audio("/sounds/error.mp3");

    audio.play();

    audio.onended = (): void => {
      audio.remove();
    };

    audio.onerror = (): void => {
      console.error("Error playing audio");
    };
  };

  const playGameoverSound = (): void => {
    const audio = new Audio("/sounds/gameover.mp3");

    audio.play();

    audio.onended = (): void => {
      audio.remove();
    };

    audio.onerror = (): void => {
      console.error("Error playing audio");
    };
  };

  const shouldDisplayKeyboard = (): boolean => {
    if (gameState.won) return false;
    if (gameState.gameFinished) return false;
    if (stringToBoolean(isDaily) && hasSolvedDaily) return false;

    return gameState.currentRow - 1 !== rows - 1;
  };

  const shouldDisplayLoginOrRegisterButtons = (): boolean => {
    if (user) return false;
    if (loading) return false;

    return !gameState.gameFinished;
  };

  useEffect((): (() => void) => {
    document.addEventListener("keydown", handleKeyboardEvent);

    return (): void => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (loading) return;

      await getWord();
    };

    fetchData();
  }, [loading]);

  const canDisplay = shouldDisplayLoginOrRegisterButtons();

  return (
    <div className="flex flex-col flex-grow w-full items-center mt-4 bg-pink-50">
      <div className="flex flex-col items-center space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-2">
            {Array.from({ length: columns }).map((_, j) => (
              <LetterBox
                key={j}
                name={`${i}${j}`}
                hasFocus={
                  i === gameState.currentRow && j === gameState.currentColumn
                }
                answer={answer}
                guessedLetter={gameState.attempts[i][j]}
                hasGuessed={i < gameState.currentRow}
                guessedLettersArray={gameState.attempts[i]}
                loading={gettingWord}
                hasWon={gameState.won}
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

        {gameState.won && (
          <div className="flex flex-col space-x-2 items-center justify-center text-center">
            <p className="text-2xl/8 text-green-600">
              Gratulerer, du gjetta det!
            </p>

            <p className="flex flex-col mt-4 space-y-2 text-sm text-neutral-700 items-center">
              <span className="text-lg text-blue-700">{answer}</span>{" "}
              {wordData?.description ?? ""}
            </p>

            <p className="text-sm text-neutral-700">
              Tid brukt: {formatTime(gameState.timeTaken)}
            </p>

            {canDisplay && (
              <div className="flex flex-col items-center justify-center w-full px-4 mt-8 space-y-2">
                <AltButton
                  value="Logg inn"
                  onClick={() => navigate("/login")}
                />
                <p className="text-neutral-700/80">eller</p>

                <AltButton
                  value="Registrer deg"
                  onClick={() => navigate("/register")}
                />

                <p className="text-sm text-neutral-700 italic">
                  For å beholde progresjon
                </p>
              </div>
            )}
          </div>
        )}

        {gameState.currentRow - 1 === rows - 1 && !gameState.won && (
          <div className="flex flex-col items-center text-center space-y-1 px-2">
            <p className="text-2xl/8 text-red-600">
              Beklager, du klarte det ikke :(
            </p>

            <p className="text-base/8 text-neutral-700">
              Riktig svar var:{" "}
              <span className="text-lg font-bold">{answer}</span>
            </p>

            <p className="text-sm text-neutral-700">
              {wordData?.description ?? ""}
            </p>

            <p className="text-sm text-neutral-700">
              Tid brukt: {formatTime(gameState.timeTaken)}
            </p>
          </div>
        )}

        {!gameState.won &&
          gameState.currentRow - 1 < rows - 1 &&
          gameState.attempts[gameState.currentRow].join("").length ===
            columns &&
          !gameState.gameFinished && (
            <div className="flex flex-row items-center justify-center w-36">
              <Button
                value="Sjekk"
                disabled={gettingWord}
                onClick={handleEnterClick}
              />
            </div>
          )}
      </div>

      <div className="flex flex-col mt-2 space-y-4 w-full items-center">
        {shouldDisplayKeyboard() && (
          <>
            {renderKeyboardRow(alphabetRowOne.split(""))}
            {renderKeyboardRow(alphabetRowTwo.split(""))}

            <div className="flex flex-row items-center justify-center">
              <button
                onClick={handleEnterClick}
                className="flex w-16 h-14 bg-neutral-100 items-center justify-center border"
              >
                <IoMdReturnLeft />
              </button>

              {renderKeyboardRow(alphabetRowThree.split(""))}

              <button
                onClick={handleBackspaceClick}
                className="flex bg-neutral-100 items-center justify-center border w-16 h-14"
              >
                <FaBackspace />
              </button>
            </div>

            {gameState.timeTaken > 0 && (
              <p className="text-sm text-neutral-700">
                Tid brukt: {formatTime(gameState.timeTaken)}
              </p>
            )}
          </>
        )}

        <div className="flex flex-col max-w-md items-center justify-center w-full space-y-2 px-2">
          {!stringToBoolean(isDaily) && (
            <button
              className={`p-2 border border-blue-700 text-sm w-full rounded-full hover:scale-105 transition-all duration-300 ${gameState.won || gameState.currentRow - 1 === rows - 1 ? "bg-blue-700 text-white" : "border border-blue-700 text-blue-700"}`}
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                // This is a special button, that is why we don't want to use the default buttons.

                // Remove focus from the button.
                // So the user can use the keyboard to play the game.
                if (e.currentTarget) {
                  e.currentTarget.blur();
                }

                await getWord();
              }}
            >
              Gi meg nytt ord
            </button>
          )}

          {!isDaily && (
            <AltButton
              value="Endre innstillinger"
              onClick={() => navigate("/setup")}
            />
          )}
        </div>

        {canDisplay && (
          <div className="flex flex-col items-center justify-center w-full px-2 space-y-2">
            <AltButton value="Logg inn" onClick={() => navigate("/login")} />
            <p className="text-neutral-700/80">eller</p>

            <AltButton
              value="Registrer deg"
              onClick={() => navigate("/register")}
            />

            <p className="text-sm text-neutral-700">For å beholde progresjon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
