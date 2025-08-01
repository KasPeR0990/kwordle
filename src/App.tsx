import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  "https://corsproxy.io/?https://api.frontendexpert.io/api/fe/wordle-words";

const WORD_LENGTH = 5;

export default function App() {
  const [solution, setSolution] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");

  useEffect(() => {
    const handleType = (event: KeyboardEvent) => {
      console.log(event.key);
    };

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];

      setSolution(randomWord);
    };
    fetchWords();
  }, []);

  return (
    <div>
      <div className="title">
        <h1> Wordle</h1>
      </div>
      <div className="built-by">built by kasper</div>
      <div className="board"> {solution}</div>
    </div>
  );
}
