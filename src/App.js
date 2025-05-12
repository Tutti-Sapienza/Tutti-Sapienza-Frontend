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
      desc: 'A decentralized organization where community members govern and shape the future of the Tutti platform through NFT ownership and voting rights.'
    },
    {
      title: 'DAO Treasury',
      desc: 'Funds collected from NFT sales and protocol usage are transparently held in the treasury for grants, development, and community rewards.'
    },
    {
      title: 'NFT Collections',
      desc: 'Dynamic NFTs that store learning credentials, evolve with progress, and verify educational achievements on-chain.'
    },
    {
      title: 'Tutti Token',
      desc: 'The utility and governance token that fuels the ecosystem—used for transactions, voting, and rewarding educational contributions.'
    },
    {
      title: 'Tutti Vaults',
      desc: 'On-chain vaults that manage token economics, distribute funding, and power educational incentives based on community participation.'
    },
    {
      title: 'Indigenous Language Datasets',
      desc: 'Preserving and promoting underrepresented languages by building datasets and AI tools tailored to native linguistic communities.'
    },
    {
      title: 'Reusable Learning Objects',
      desc: 'Modular educational units—videos, games, quizzes—created by teachers and rewarded via smart contracts when reused or rated highly.'
    },
    {
      title: 'MMLLMs and Adaptive Learning',
      desc: 'Multimodal language models personalize content delivery based on student pace, behavior, and engagement to improve outcomes.'
    },
    {
      title: 'AR/VR Headsets',
      desc: 'Immersive experiences delivered through headsets for remote learners to engage with hands-on simulations and cultural environments.'
    }
  ];

  return (
    <div className="container">
      <header>
        <h1>Tutti Sapienza</h1>
        <h2 className="tagline">A Revolution in Education using blockchain technology and Artificial Intelligence</h2>
        <p>
          Tutti Sapienza means "Everyone's Knowledge" in Italian. Our platform integrates blockchain, AI, and immersive technologies to provide equitable, borderless access to global knowledge while preserving each person's cultural and linguistic identity.
        </p>
      </header>

      <section className="wallet-status">
        {isConnected ? (
          <p>
            Connected with {walletType}: {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </p>
        ) : (
          <>
            <p>Connect your wallet to access Tutti Sapienza NFTs</p>
            <button onClick={() => connectWallet('MetaMask')}>Connect MetaMask</button>
            <button onClick={() => connectWallet('Rabby')}>Connect Rabby</button>
          </>
        )}
      </section>

      <section className="features-section">
        <h2>Explore the Ecosystem</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <button className="learn-more">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="social-links">
          <a href="https://x.com/tuttisapienza" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://discord.gg/tuttisapienza" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="https://github.com/tuttisapienza" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p>© 2025 Tutti Sapienza DAO. Powered by Blockchain.</p>
      </footer>
    </div>
  );
}

export default App;
