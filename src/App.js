import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [walletType, setWalletType] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        setAccount(accounts[0]);
        setIsConnected(true);

        if (ethereum.isMetaMask) {
          setWalletType('MetaMask');
        } else if (ethereum.isRabby) {
          setWalletType('Rabby');
        } else {
          setWalletType('Web3 Wallet');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async (walletName) => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert(`Please install ${walletName}!`);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setWalletType(walletName);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">Tutti Sapienza</h1>
        <h2 className="subtitle">A Technological Revolution in Education</h2>
        <p className="description">
          Tutti Sapienza means "Everyone's Knowledge" in Italian. Our platform integrates blockchain, AI, and immersive technologies to provide equitable, borderless access to global knowledge while preserving each person's cultural and linguistic identity.
        </p>
      </header>

      <section className="hero-section">
        <div id="wallet-status">
          {isConnected ? (
            <p>
              Connected with {walletType}:{' '}
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </p>
          ) : (
            <p>Connect your wallet to access Tutti Sapienza NFTs</p>
          )}
        </div>
        {!isConnected && (
          <div className="wallet-buttons" id="wallet-connect-options">
            <button className="btn connect-button" onClick={() => connectWallet('MetaMask')}>
              Connect with MetaMask
            </button>
            <button className="btn connect-button" onClick={() => connectWallet('Rabby')}>
              Connect with Rabby
            </button>
          </div>
        )}
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Blockchain Education</h3>
            <p>Student credentials and content are secured and verified on the blockchain, providing immutable educational records.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI-Powered Tutors</h3>
            <p>Voice-based AI teachers that adapt to your learning style and language—anytime, anywhere.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Mintable NFT Identity</h3>
            <p>Start your journey by minting a Tutti Sapienza Whitepaper NFT—your entry into our decentralized learning community.</p>
          </div>
        </div>
      </section>

      <section className="nft-section">
        <h2>Mint Your Educational NFT</h2>
        <p>Join our community by minting the Tutti Sapienza Whitepaper NFT. This dynamic token evolves as you interact with our platform.</p>
        <div className="nft-preview">
          <div className="nft-image">
            <img src="https://via.placeholder.com/300x300/6a11cb/ffffff?text=Tutti+Sapienza" alt="Tutti Sapienza NFT" />
          </div>
          <div className="nft-details">
            <h4>Whitepaper NFT</h4>
            <p>Your gateway to the Tutti Sapienza ecosystem</p>
          </div>
          <button className="btn mint-button" disabled>
            Mint NFT (Coming Soon)
          </button>
        </div>
      </section>

      <footer>
        <div className="social-links">
          <a href="https://x.com/tuttisapienza" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://discord.gg/tuttisapienza" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://github.com/tuttisapienza" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p className="copyright">© 2025 Tutti Sapienza DAO. Powered by Blockchain.</p>
      </footer>
    </div>
  );
}

export default App;
