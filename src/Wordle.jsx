import React, { useState, useEffect, createRef, forwardRef, useImperativeHandle, useRef, memo } from 'react';
import Styled from 'styled-components';

const Gameboard = Styled.section`
  width: 350px;
  height: 420px;
  display: grid;
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  grid-template-columns: repeat(5, 1fr);
`

const StyledInput = Styled.input`
  background-color: ${(props) => props.color()};
  color: white;
  height: 4rem;
  font-size: 62px;
  max-width: 62px;
  text-align: center;
  caret-color: transparent;
  border: none;
`

const Box = Styled.div`
  background-color: #121214;
  height: 4rem;
  max-width: 66px;
  border: 2px solid #3A3A3D;
`

const ANSWER = ['P', 'H', 'A', 'S', 'E']
const ROWS = 6;
const COLUMNS = 5;

const LAST_COLUMN = 4;
const LAST_ROW = 5;

function Wordle() {
  const [references, setReferences] = useState(null)
  const [activeRow, setActiveRow] = useState(0)
  const [activeCol, setActiveCol] = useState(0)

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
  }, [activeRow, activeCol, references]);

  const handleUpdateColumn = (val, isDelete = false) => {
    if (isDelete) {
      const newActiveCol = activeCol + val;
      setActiveCol(newActiveCol)
      references[activeRow][newActiveCol].current.reset()

      // clear the last cell
      references[activeRow][newActiveCol + 1].current.reset()
    } else {
      setActiveCol(oldVal => Math.min((oldVal + val), LAST_COLUMN))
    }
  }

  const handleIncrementLevel = (event) => {
    if (event.key !== 'Enter' || activeCol !== LAST_COLUMN) return
    if (activeRow === 5) {
      alert('Game over, you are shit')
      return
    }

    let correctAnswers = 0

    for (let i = 0; i < COLUMNS; i += 1) {
      if (references[activeRow][i].current.value === ANSWER[i]) {
        references[activeRow][i].current.handleSetCorrect();
        correctAnswers += 1
      } 
      else if (ANSWER.includes(references[activeRow][i].current.value)) {
        references[activeRow][i].current.handleSetWrongOrder();
      }
    }

    if (correctAnswers === LAST_ROW) {
      alert('You guessed correctly, well done');
      return;
    }

    setActiveRow(prevRow => prevRow + 1)
    setActiveCol(0)
  }

  const generateCells = () => {
    if (!references) return
    const cells = []
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLUMNS; col += 1) {
        if (activeRow < row) {
          cells.push(<Box />)
        } else {
          cells.push(
            <Cell
              handleUpdateColumn={handleUpdateColumn}
              isFirstCell={col === 0}
              isDisabled={!(row === activeRow && col === activeCol)} 
  
              ref={references[row][col]}
            />
          )
        }

      }
    }
    return cells;
  }

  return (
    <Gameboard onKeyDown={handleIncrementLevel}>
      {generateCells()}
    </Gameboard>
  );
}

// eslint-disable-next-line react/display-name
const Cell = memo(forwardRef(({ handleUpdateColumn, isFirstCell, isDisabled }, ref) => {
  console.log('render')
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [wrongOrder, setWrongOrder] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value.toUpperCase());
    handleUpdateColumn(1);
  }

  const reset = () => setValue('')

  const handleSetCorrect = () => setCorrect(true)
  const handleSetWrongOrder = () => setWrongOrder(true)

  const handleOnKeyDown = (event) => {
    if (event.key === 'Backspace' && !isFirstCell) {
      handleUpdateColumn(-1, true);
    }
  }

  const getColor = () => {
    if (correct) return '#538D4E' 
    if (wrongOrder) return'#B59F3B'
    
    return '#3A3A3D'
  }

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    reset,
    handleSetCorrect,
    handleSetWrongOrder,
    value
  }));

  return (
    <StyledInput 
      value={value} 
      onChange={handleChange} 
      ref={inputRef} 
      disabled={isDisabled}
      onKeyDown={handleOnKeyDown}
      maxLength="1"
      color={getColor}
    />
  )
}))

export default Wordle
