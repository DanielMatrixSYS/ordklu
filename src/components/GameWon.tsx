import React from "react";

interface GameWonProps {
  word: string;
  attempts: number;
  timeTaken: number;
  solved: boolean;
  dateSolved: string;
  hasSolvedDailyWord: boolean;
  hasSolvedDailyPreviously: boolean;
}

const GameWon: React.FC<GameWonProps> = ({
  word,
  attempts,
  timeTaken,
  solved,
  dateSolved,
  hasSolvedDailyPreviously,
  hasSolvedDailyWord,
}) => {
  return (
    <div>
      <h1>Game Won</h1>
    </div>
  );
};

export default GameWon;
