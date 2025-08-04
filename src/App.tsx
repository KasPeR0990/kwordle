import { useState, useEffect } from "react";
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

      setSolution(randomWord.word);
    };
    fetchWords();
  }, []);

  return (
    <div className="App">
      <div className="title">
        <h1> Kwordle</h1>
      </div>
      <div>{solution}</div>
      <div className="built-by">built by kasper</div>
      <div className="board">
        {guesses.map((guess, i) => {
          // first guess thats null
          const isCurrentGuess = i === guesses.findIndex((val) => val === null);

          return (
            <Line
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              key={i}
              isCurrentGuess={isCurrentGuess}
            />
          );
        })}
      </div>
    </div>
  );
}

function Line({
  guess,
  isCurrentGuess,
}: {
  guess: string | null;
  isCurrentGuess: boolean;
}) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess ? guess[i] : "";
    const isActiveTile = isCurrentGuess && i === guess?.length;
    tiles.push(
      <div key={i} className={`tile ${isActiveTile ? "blinking-cursor" : ""}`}>
        {char}
      </div>
    );
  }

  return <div className="line">{tiles}</div>;
}
