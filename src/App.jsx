import React from 'react';
import Wordle from './Wordle';
import Styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

const Container = Styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #121214;
`

function App() {
  return (
    <Container>
      <GlobalStyle />
      <header>
      </header>
      <Wordle />
    </Container>
  );
}

export default App
