import LetterBox from "./LetterBox";
import { useEffect, useState, useCallback } from "react";
import KeyboardButton from "./KeyboardButton";

import { FaBackspace } from "react-icons/fa";

const alphabetRowOne = "QWERTYUIOP";
const alphabetRowTwo = "ASDFGHJKL";
const alphabetRowThree = "ZXCVBNM";

//Generated.
const wordList: string[] = [
  // Gamle ord
  "kløkt", // cleverness
  "gnyet", // murmur or noise
  "bryll", // old term for wedding
  "snerp", // tightness, stiffness
  "knyst", // silence
  "fjusk", // cheating or fraud
  "snurt", // sulky
  "gløgg", // clever, mulled wine
  "kvass", // sharp, cutting
  "gjøk", // cuckoo (bird)

  // Vanskelige ord
  "grøft", // ditch
  "frykt", // fear
  "sverd", // sword
  "kveil", // coil
  "fjern", // distant
  "glimt", // glimpse
  "knapt", // barely
  "plump", // rude, blunt
  "kvist", // twig

  // Hippe og nye ord
  "vibes", // vibes (slang, borrowed)
  "basic", // basic (slang, borrowed)
  "fresh", // fresh (slang, borrowed)
  "gjest", // guest
  "smart", // clever, smart
  "koset", // cozying
  "chill", // relax (slang, borrowed)
  "flaks", // luck
  "kulde", // coldness

  // Slang
  "sjapp", // small shop
  "kødde", // to joke
  "sjukt", // crazy, cool
  "chill", // relax (slang)
  "lurer", // wondering, tricking
  "drøyt", // extreme, beyond the norm
  "gutta", // the guys
  "slick", // smooth, cool (slang, borrowed)

  // Andre 5-bokstavers ord
  "brann", // fire
  "våken", // awake
  "storm", // storm
  "treff", // hit
  "kvote", // quota
  "glede", // joy
  "bibel", // bible
  "lærer", // teacher
  "spise", // to eat
  "søker", // searcher, applicant
  "lyder", // sounds
  "huset", // house
  "skole", // school
  "måned", // month
  "solen", // sun
  "vindu", // window
  "fjell", // mountain
  "fjære", // shore
  "gulve", // floor
  "lemon", // lemon (borrowed)
  "prøve", // test, attempt
  "grønn", // green
  "blått", // blue
  "brune", // brown
  "kanal", // channel
  "musee", // museum (short form)
  "smalt", // narrow
  "kaldt", // cold
  "dansk", // Danish
  "dåpen", // baptism
  "gilde", // feast, party
  "koden", // code
  "flyet", // plane
  "bilen", // car
  "vogna", // wagon
  "bokse", // to box (sport)
  "koste", // cost
  "håpet", // hope
  "greit", // okay, fine
  "kaken", // cake
  "stakk", // stabbed, poked
  "passe", // to fit, suit
  "plikt", // duty
  "piken", // girl
  "nisse", // elf, Santa Claus
  "tiden", // time
  "maten", // food
  "ferie", // holiday
  "talen", // speech
  "lyset", // light
  "havet", // the sea
  "flora", // flora, plant life
  "koden", // the code
  "sport", // sport
  "faren", // the father
  "datid", // past tense
  "romer", // Roman
  "pilot", // pilot
  "nisse", // elf, Santa Claus
  "solgt", // sold
  "grått", // gray
  "stein", // stone
  "fjell", // mountain
  "våren", // spring
];

const Main = () => {
  const [rows] = useState<number>(5);
  const [columns] = useState<number>(5);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [attempts, setAttempts] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(columns).fill("")),
  );
  const [answer, setAnswer] = useState<string>(
    wordList[Math.floor(Math.random() * wordList.length)].toUpperCase(),
  );

  const handleLetterClick = (letter: string) => {
    const newAttempts = [...attempts];
    newAttempts[currentRow][currentColumn] = letter.toUpperCase();

    setAttempts(newAttempts);

    if (currentColumn < columns - 1) {
      setCurrentColumn((prev) => prev + 1);
    }
  };

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
    if (currentColumn > 0) {
      const newAttempts = [...attempts];
      newAttempts[currentRow][currentColumn] = "";
      setAttempts(newAttempts);
      setCurrentColumn((prev) => prev - 1);
    }
  }, [currentColumn, attempts, currentRow]);

  const handleKeyboardEvent = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentColumn < columns - 1) {
        setCurrentColumn((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentColumn > 0) {
        setCurrentColumn((prev) => prev - 1);
      } else if (e.key === "Enter") {
        handleEnterClick();
      } else if (e.key === "Backspace") {
        handleBackspaceClick();
      }
    },
    [currentColumn, columns, handleEnterClick, handleBackspaceClick],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  return (
    <div className="flex flex-col flex-grow w-full items-center mt-4 bg-pink-50">
      {currentRow - 1 === 4 && (
        <p className="text-2xl/8">Spillet er ferdig. Svaret er: {answer}</p>
      )}

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
              />
            ))}
          </div>
        ))}
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
              setAnswer(
                wordList[
                  Math.floor(Math.random() * wordList.length)
                ].toUpperCase(),
              );

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
