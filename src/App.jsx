import { useState, useEffect } from 'react';
import './index.css';
import GuessLine from './GuessLine';

const WORD_LIST_API_URL = 'https://random-word-api.herokuapp.com/word?length=5';
const NUM_GUESSES = 6;
const WORD_LENGTH = 5;



export default function App() {
  const [guesses,setGuesses] = useState(Array(NUM_GUESSES).fill(null));
  const [currentGuess,setCurrentGuess] = useState('');
  const [solution,setSolution] = useState(null);
  
  useEffect(()=>{
    const fetchSolution = async () => {
      const response = await fetch(WORD_LIST_API_URL);
      const word = await response.json();
      setSolution(word[0]);
    }; 
    fetchSolution();
  }, []);
  
  const isTrue = guesses[NUM_GUESSES - 1] != null && !guesses.includes(solution);

  
  useEffect(()=>{
    if(solution == null) return;

    const onPressKey = event =>{
      if(guesses[NUM_GUESSES-1] != null || guesses.includes(solution)){
        return;
      }

      const charCode = event.key.toLowerCase().charCodeAt(0);
      const isLetter = 
        event.key.length === 1 &&
        charCode >= 'a'.charCodeAt(0) &&
        charCode <= 'z'.charCodeAt(0);
        
      setCurrentGuess(prevGuess => {
        if(event.key === 'Backspace'){
          return prevGuess.slice(0,-1);
        }else if(event.key === 'Enter' && prevGuess.length === WORD_LENGTH){
          const currentGuessIndex = guesses.findIndex(guess => guess == null);
          const guessesClone = [...guesses];
          guessesClone[currentGuessIndex] =  prevGuess;
          setGuesses(guessesClone);
          return '';
        }else if(prevGuess.length < WORD_LENGTH && isLetter){
          return prevGuess + event.key.toLowerCase();
          
        }
        return prevGuess;
      });
    };

    window.addEventListener('keydown',onPressKey);

    return ()=> window.removeEventListener('keydown',onPressKey);
  },[solution,guesses]);

  const currentGuessIndex = guesses.findIndex(guess => guess==null);

  if(solution == null) return null;
  return (
    <div className="board">
      <h1>Guess the Word</h1>
      {guesses.map((guess, i) => {
        
        return(
          <GuessLine
            key={i}
            guess={(i===currentGuessIndex ? currentGuess : guess ?? '').padEnd(WORD_LENGTH)}
            solution={solution}
            isFinal = {currentGuessIndex > i || currentGuessIndex === -1}
            />
            
        );
      })
      }
      <h1>{isTrue && `Answer: ${solution}`}</h1>
    </div>
  );
}

