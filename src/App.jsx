import { useState } from 'react';
import './App.css';
import DeckOfCards from './DeckOfCards';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <DeckOfCards />
      </div>
    </>
  )
}

export default App
