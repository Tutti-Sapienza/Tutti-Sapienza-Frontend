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

  const features = [
    {
      title: 'Tutti Sapienza DAO',
      description: 'A decentralized organization governing the protocol. NFT holders vote on proposals to shape the educational future.',
    },
    {
      title: 'DAO Treasury',
      description: 'Funds raised from NFTs go to a transparent, on-chain treasury used to reward educators and fund learning pods.',
    },
    {
      title: 'NFT Collections',
      description: 'Soul-bound NFTs document your learning progress and credentials across the Tutti ecosystem.',
    },
    {
      title: 'Tutti Token',
      description: 'The utility and governance token of the protocol, used for voting, staking, and accessing premium content.',
    },
    {
      title: 'Tutti Vaults',
      description: 'Smart contract vaults that manage curriculum funds, community grants, and scholarship allocations.',
    },
    {
      title: 'Indigenous Language Datasets',
      description: 'AI models trained on native languages to preserve and teach endangered dialects across the world.',
    },
    {
      title: 'Reusable Learning Objects',
      description: 'Modular lessons designed by educators, rated by the DAO, and stored immutably on-chain.',
    },
    {
      title: 'MMLLMs and Adaptive Learning',
      description: 'Multimodal language models personalize content delivery through voice, video, and text formats.',
    },
    {
      title: 'AR/VR Headsets',
      description: 'Immersive learning environments with real-time feedback via AI tutors inside 3D virtual classrooms.',
    },
  ];

  return (
    <div className="container">
      <header>
        <h1>Tutti Sapienza</h1>
        <h2>A Revolution in Education using blockchain technology and Artificial Intelligence</h2>
        <p>
          Tutti Sapienza means "Everyone's Knowledge" in Italian. Our platform integrates blockchain, AI, and immersive technologies to provide equitable, borderless access to global knowledge while preserving each person's cultural and linguistic identity.
          <br /><br />
          Imagine a child, anywhere in the world, stepping into a solar-powered learning pod—connected by satellite, sustained by clean water, and guided by a personal AI teacher. Through immersive AR/VR experiences, AI-driven lessons, and blockchain-secured credentials, Tutti Sapienza delivers personalized, multilingual education stored on soul-bound NFTs and permanently verified on-chain. Built for equity, powered by innovation—this is education for everyone, everywhere.
        </p>
      </header>

      <section className="hero-section">
        <div id="wallet-status">
          {isConnected ? (
            <p>
              Connected with {walletType}: {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </p>
          ) : (
            <p>Connect your wallet to access Tutti Sapienza NFTs</p>
          )}
        </div>
        {!isConnected && (
          <div className="wallet-buttons" id="wallet-connect-options">
            <button className="btn connect-button" onClick={() => connectWallet('MetaMask')}>Connect with MetaMask</button>
            <button className="btn connect-button" onClick={() => connectWallet('Rabby')}>Connect with Rabby</button>
          </div>
        )}
      </section>

      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          ))}
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
          <button className="btn mint-button" disabled>Mint NFT (Coming Soon)</button>
        </div>
      </section>

      <footer>
        <div className="social-links">
          <a href="https://twitter.com/tuttisapienza" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://discord.gg/yourdiscordlink" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://github.com/tuttisapienza" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p className="copyright">
          © 2025 Tutti Sapienza DAO. Powered by Blockchain.
        </p>
      </footer>
    </div>
  );
}

export default App;
