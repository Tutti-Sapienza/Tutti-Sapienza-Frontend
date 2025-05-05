import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Check if MetaMask is installed
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Please install MetaMask!");
        return;
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setAccount(account);
        setIsConnected(true);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Connect wallet button function
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Run once when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tutti Sapienza NFT</h1>
        <p>Web3 NFT Minting Platform</p>
        
        {isConnected ? (
          <div>
            <p>Connected Account: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            <button className="mint-button" disabled>
              Mint NFT (Coming Soon)
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
