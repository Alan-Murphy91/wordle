import React, { useState, useEffect, createRef, forwardRef } from 'react';

function Wordle() {
  const [references, setReferences] = useState(null)
  const [activeRow, setActiveRow] = useState(0)
  const [activeCol, setActiveCol] = useState(0)
  // const [guesses, setGuesses] = useState([])

  const ANSWER = ['P', 'H', 'A', 'S', 'E']
  const ROWS = 6;
  const COLUMNS = 5;

  useEffect(() => {
    const inputs = Array.from({ length: ROWS }).fill(null).map(() => 
      Array.from({ length: COLUMNS }, () => createRef())
    );
    setReferences(inputs);
  }, []);

  useEffect(() => {
    if (references) {
      references[activeRow][activeCol].current.focus()
    }
  }, [activeRow, activeCol]);

  // const shiftFocus = (direction) => {
    // if ((activeCol + direction) < 0 || (activeCol + direction) > 4) return;
    // console.log('shiftfocus', references[activeRow][activeCol + direction].current)
    // references[activeRow][activeCol + direction].current.focus()
  // }

  const generateCells = () => {
    if (!references) return
    const cells = []
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLUMNS; col += 1) {
        cells.push(
          <Cell 
            letter={ANSWER[col]} 
            isDisabled={!(row === activeRow && col === activeCol)} 
            ref={references[row][col]}
            // shiftFocus={shiftFocus}
          />
        )        
      }
    }
    return cells;
  }
  console.log('references', references)

  return (
    <section>
      {generateCells()}
    </section>
  );
}

// eslint-disable-next-line react/display-name
const Cell = forwardRef((props, ref) => {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value)
    // props.shiftFocus()
  }
  // const [letter, setLetter] = useState(props.letter)
  // useEffect(() => {
  // }, [])
  return <input value={value} onChange={handleChange} ref={ref} placeholder={props.letter} disabled={props.isDisabled} />
})

export default Wordle
