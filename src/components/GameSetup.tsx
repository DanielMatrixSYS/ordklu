import { useNavigate } from "react-router-dom";
import { FC, useState, ChangeEvent } from "react";

interface OptionInterface {
  label: string;
  value: number;
}

interface SelectProps {
  label: string;
  options: OptionInterface[];
  onChange: (value: number) => void;
}

const Select: FC<SelectProps> = ({ label, options, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col mt-4 max-w-md">
      <label htmlFor={label} className="text-sm">
        {label}
      </label>
      <select
        id={label}
        className="w-full border border-blue-700 rounded-full p-2 mt-1"
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const GameSetup: FC = () => {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<number>(1);
  const [wordLength, setWordLength] = useState<number>(5);

  const handleStartGame = () => {
    let randomLength = wordLength;

    if (wordLength === 8) {
      const possibleLengths = [6, 7, 8];
      randomLength =
        possibleLengths[Math.floor(Math.random() * possibleLengths.length)];
    } else if (wordLength === 9) {
      const possibleLengths = [9, 10];
      randomLength =
        possibleLengths[Math.floor(Math.random() * possibleLengths.length)];
    }

    console.log(
      "Starting game with difficulty:",
      difficulty,
      "and word length:",
      randomLength,
    );

    navigate(
      `/game?length=${randomLength}&difficulty=${difficulty}&theme=all&language=no`,
    );
  };

  return (
    <div className="flex bg-gradient-to-t from-pink-100 to-pink-50 flex-col items-center w-full h-full">
      <div className="flex flex-col mt-4">
        <h1 className="text-6xl h-20 font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Spillregler
        </h1>

        <div className="flex flex-col mt-4 space-y-1">
          <p className="text-sm text-center">
            Velg vanskelighetsgrad, kategorier, språk og lengde på ordene.
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-10 max-w-md">
        <Select
          label="Vanskelighetsgrad"
          options={[
            { label: "Lett", value: 1 },
            { label: "Middels", value: 2 },
            { label: "Vanskelig", value: 3 },
          ]}
          onChange={setDifficulty}
        />

        <Select
          label="Lengde på ord"
          options={[
            { label: "Veldig kort (4 bokstaver)", value: 4 },
            { label: "Kort (5 bokstaver)", value: 5 },
            { label: "Medium (6-8 bokstaver)", value: 8 },
            { label: "Lang (9-10 bokstaver)", value: 9 },
          ]}
          onChange={setWordLength}
        />
      </div>

      <div className="flex flex-col items-center mt-14 w-full">
        <button
          className="px-8 w-2/3 sm:w-96 py-2 bg-blue-500 text-white rounded-full hover:scale-105 transition-all duration-300"
          onClick={handleStartGame}
        >
          Gjett nå!
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
