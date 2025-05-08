import React from 'react';
import { Web3Provider } from './context/Web3Context';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <LandingPage />
    </Web3Provider>
  );
}

export default App;
