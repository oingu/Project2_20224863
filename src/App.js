import './App.css';
import Header from "./components/Header";
import Translate from "./components/Translate";
import Dictionary from "./components/Dictionary";
import Wordle from "./components/Wordle/Wordle";
import WordScramble from "./components/WordScramble/WordScramble";


function App() {
  return (
      <>
        <Header/>
        <WordScramble/>
      </>
  );
}

export default App;
