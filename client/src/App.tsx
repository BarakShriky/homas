import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Flex, TextField, Text, Button} from "@radix-ui/themes";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Flex direction="column" gap="2">
          <Text>ברוכים הבאים לחומ״ס</Text>
          <TextField.Input variant="classic" placeholder="שם משתמש" />
          <TextField.Input variant="classic" placeholder="סיסמה" />
          <Button color='orange' variant='soft'>התחברות</Button>
        </Flex>
      </header>
    </div>
  );
}

export default App;
