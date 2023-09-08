import React, { useState, useEffect, createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import Styled from 'styled-components';

const StyledInput = Styled.input`
  background-color: ${(props) => props.color()};
  color: white;
  margin: 2px;
`
const l = (...props) => console.log(...props)

const ANSWER = ['P', 'H', 'A', 'S', 'E']
const ROWS = 6;
const COLUMNS = 5;

const LAST_IN_COLUMN = 4;
const FIRST_IN_COLUMN = 0;

function Wordle() {
  const [references, setReferences] = useState(null)
  const [activeRow, setActiveRow] = useState(0)
  const [activeCol, setActiveCol] = useState(0)
  // const [guesses, setGuesses] = useState([])

  useEffect(() => {
    const inputs = Array.from({ length: ROWS }).fill(null).map(() => 
      Array.from({ length: COLUMNS }, () => createRef())
    );
    setReferences(inputs);
  }, []);

  useEffect(() => {
    if (references) references[activeRow][activeCol].current.focus()
  }, [references]);

  useEffect(() => {
    // l('row, col', activeRow, activeCol)
    if (references) {
      l(references[activeRow][activeCol].current)
      references[activeRow][activeCol].current.focus()
    }
  }, [activeRow, activeCol]);

  const handleUpdateColumn = (val, isDelete = false) => {
    if (isDelete) {
      const newActiveCol = activeCol + val;
      setActiveCol(newActiveCol)
      references[activeRow][newActiveCol].current.reset()

      // clear the last cell
      references[activeRow][newActiveCol + 1].current.reset()
    } else {
      setActiveCol(oldVal => Math.min((oldVal + val), 4))
    }
  }

  const handleIncrementLevel = (event) => {
    //  l('active col', activeCol)
    if (event.key !== 'Enter' || activeCol !== 4) return
    l('increment', event.key)

    for (let i = 0; i < COLUMNS; i += 1) {
      l(references[activeRow][i].current.value, ANSWER[i])
      if (references[activeRow][i].current.value === ANSWER[i]) {
        references[activeRow][i].current.handleSetCorrect();
      } 
      else if (ANSWER.includes(references[activeRow][i].current.value)) {
        references[activeRow][i].current.handleSetWrongOrder();
      }
    }
    setActiveRow(prevRow => prevRow + 1)
    setActiveCol(0)
  }

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
            handleUpdateColumn={handleUpdateColumn}
            references={references}
            activeCol={activeCol}
            activeRow={activeRow}
          />
        )        
      }
    }
    return cells;
  }

  return (
    <section onKeyDown={handleIncrementLevel}>
      {generateCells()}
    </section>
  );
}

// eslint-disable-next-line react/display-name
const Cell = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [wrongOrder, setWrongOrder] = useState(false);
  const [correct, setCorrect] = useState(false);


  const handleChange = (e) => {
    // l('handleChange')
    setValue(e.target.value.toUpperCase());
    props.handleUpdateColumn(1);
  }

  const reset = () => setValue('')

  const handleSetCorrect = () => setCorrect(true)
  const handleSetWrongOrder = () => setWrongOrder(true)

  const handleOnKeyDown = (event) => {
    if (event.key === 'Backspace' && props.activeCol > FIRST_IN_COLUMN) {
      // l('handleOnKeyDown')
      props.handleUpdateColumn(-1, true);
    }
  }

  const getColor = () => {
    let color = 'black'
    if (correct) {
      color = '#538D4E' 
    }
    else if (wrongOrder) {
      color = '#B59F3B'
    }

    return color
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
      disabled={props.isDisabled}
      onKeyDown={handleOnKeyDown}
      maxLength="1"
      color={getColor}
    />
  )
})

export default Wordle
