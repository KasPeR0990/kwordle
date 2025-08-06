import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

const API_URL =
  "https://corsproxy.io/?https://api.datamuse.com/words?sp=k????&max=1000";

const WORD_LENGTH = 5;

export default function App() {
  const [solution, setSolution] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));

  useEffect(() => {
    const handleType = (event: KeyboardEvent) => {
      if (event.key === "Enter" && currentGuess.length === WORD_LENGTH) {
        event.preventDefault();
        const index = guesses.findIndex((g) => g === null);

        if (index !== -1) {
          const nextGuesses = [...guesses];
          nextGuesses[index] = currentGuess;
          setGuesses(nextGuesses);
          setCurrentGuess("");
        }
        return;
      }

      if (event.key === "Backspace" && currentGuess.length > 0) {
        setCurrentGuess((prev) => prev.slice(0, -1));
      }

      if (!/^[a-zA-Z]$/.test(event.key)) return;

      if (currentGuess.length !== WORD_LENGTH) {
        setCurrentGuess((prev) => prev + event.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess]);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];

      setSolution(randomWord.word.toLowerCase());
    };
    fetchWords();
  }, []);

  return (
    <div className="App">
      <div className="title">Kwordle</div>
      <div>{solution}</div>{" "}
      {/* Optional: If you want to display the solution */}
      <div className="built-by">built by kasper</div>
      <div className="board">
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex((val) => val === null);
          return (
            <Line
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              key={i}
              isCurrentGuess={isCurrentGuess}
              statuses={
                guess
                  ? getGuessStatuses(guess, solution)
                  : Array(WORD_LENGTH).fill("absent")
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function getGuessStatuses(
  guess: string,
  solution: string
): ("correct" | "present" | "absent")[] {
  const result: ("correct" | "present" | "absent")[] =
    Array(WORD_LENGTH).fill("absent");
  // frequnecy map
  function getFrequency(string: string) {
    let freq: Record<string, number> = {};

    for (let i = 0; i < string.length; i++) {
      const character = string[i];
      if (freq[character]) {
        freq[character]++;
      } else {
        freq[character] = 1;
      }
    }

    return freq;
  }

  const solutionLettersCount = getFrequency(solution);

  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess[i];
    if (letter === solution[i]) {
      result[i] = "correct";
      solutionLettersCount[letter]--;
    }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess[i];
    if (result[i] === "correct") continue; // skip correct

    if (solutionLettersCount[letter] > 0) {
      result[i] = "present";
      solutionLettersCount[letter]--;
    }
  }

  return result;
}

function Line({
  guess,
  isCurrentGuess,
  statuses,
}: {
  guess: string | null;
  isCurrentGuess: boolean;
  statuses: string[];
}) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess ? guess[i] : "";
    const isActiveTile = isCurrentGuess && i === guess?.length;
    // get status for each tile
    const status = statuses[i];
    tiles.push(
      <div
        key={i}
        className={`tile tile-${status} ${
          isActiveTile ? "blinking-cursor" : ""
        }`}
      >
        {char}
      </div>
    );
  }

  return <div className="line">{tiles}</div>;
}
