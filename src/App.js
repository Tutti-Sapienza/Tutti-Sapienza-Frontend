import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState('');

  // Check if any wallet is already connected
  const checkIfWalletIsConnected = async () => {
    try {
      // Check for Ethereum provider (works for both MetaMask and Rabby)
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Please install a Web3 wallet like MetaMask or Rabby!");
        return;
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setAccount(account);
        setIsConnected(true);
        
        // Try to detect which wallet is being used
        if (ethereum.isMetaMask) {
          setWalletType('MetaMask');
        } else if (ethereum.isRabby) {
          setWalletType('Rabby');
        } else {
          setWalletType('Web3 Wallet');
        }
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Connect wallet button function
  const connectWallet = async (walletType) => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert(`Please install ${walletType}!`);
        return;
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      console.log(`Connected with ${walletType}:`, accounts[0]);
      setAccount(accounts[0]);
      setIsConnected(true);
      setWalletType(walletType);
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
            <p>Connected with {walletType}: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            <button className="mint-button" disabled>
              Mint NFT (Coming Soon)
            </button>
          </div>
        ) : (
          <div className="wallet-buttons">
            <button onClick={() => connectWallet('MetaMask')} className="connect-button metamask">
              Connect with MetaMask
            </button>
            <button onClick={() => connectWallet('Rabby')} className="connect-button rabby">
              Connect with Rabby
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
