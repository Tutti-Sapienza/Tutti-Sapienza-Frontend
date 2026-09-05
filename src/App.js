import React from 'react';
import useWallet from './hooks/useWallet';
import tuttiArtwork from './assets/images/tutti-girl-headset.jpg';
import './App.css';

function App() {
  const {
    wallets, account, walletName, chainId, isConnecting, error,
    connectWallet, disconnectWallet,
  } = useWallet();

  const features = [
    {
      title: 'Tutti Sapienza DAO',
      description: 'A decentralized organization governing the protocol. NFT holders vote on proposals to shape the educational future.',
      detail: 'The goal is to let educators, families, and community members help shape the protocol. Proposal creation and on-chain voting are planned; voting is not available here yet.',
    },
    {
      title: 'DAO Treasury',
      description: 'Funds raised from NFTs go to a transparent, on-chain treasury used to reward educators and fund learning pods.',
      detail: 'The planned treasury will make funding and spending visible to the community. Project ENS name: tutti-sapienza.eth. A verified treasury address and live balance are not available here yet.',
    },
    {
      title: 'NFT Collections',
      description: 'Soul-bound NFTs document your learning progress and credentials across the Tutti ecosystem.',
      detail: 'The first planned collection is the Whitepaper NFT for early community members. Learner credentials and evolving attributes are later goals. Minting is not open yet.',
    },
    {
      title: 'Tutti Token',
      description: 'The utility and governance token of the protocol, used for voting, staking, and accessing premium content.',
      detail: 'TUTTI is part of the protocol roadmap. Token distribution, utility, and governance rules still need to be defined. No token sale or staking is available on this site.',
    },
    {
      title: 'Tutti Vaults',
      description: 'Smart contract vaults that manage curriculum funds, community grants, and scholarship allocations.',
      detail: 'Vaults are intended to separate funds for curriculum, grants, and scholarships. Allocation rules and community oversight must be established before these funds can be managed here.',
    },
    {
      title: 'Indigenous Language Datasets',
      description: 'AI models trained on native languages to preserve and teach endangered dialects across the world.',
      detail: 'The vision is to support culturally and linguistically inclusive learning. Language resources should be developed with the communities whose knowledge and languages they represent.',
    },
    {
      title: 'Reusable Learning Objects',
      description: 'Modular lessons designed by educators, rated by the DAO, and stored immutably on-chain.',
      detail: 'Reusable lessons are intended to help educators share and adapt learning materials. The educator publishing tools, review process, and decentralized storage integration remain to be built.',
    },
    {
      title: 'MMLLMs and Adaptive Learning',
      description: 'Multimodal language models personalize content delivery through voice, video, and text formats.',
      detail: 'Personal AI teachers are intended to adapt lessons to a learner’s language, pace, and needs. Tutoring sessions and learner progress tracking are not available in this frontend yet.',
    },
    {
      title: 'AR/VR Headsets',
      description: 'Immersive learning environments with real-time feedback via AI tutors inside 3D virtual classrooms.',
      detail: 'Immersive classrooms are part of the longer-term vision. This site introduces the project; it does not currently include a working virtual classroom or headset experience.',
    },
  ];

  return (
    <div className="container">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header>
        <h1>Tutti Sapienza</h1>
        <h2>A Revolution in Education using blockchain technology and Artificial Intelligence</h2>
        <p>
          Tutti Sapienza means "Everyone's Knowledge" in Italian. Our platform integrates blockchain, AI, and immersive technologies to provide equitable, borderless access to global knowledge while preserving each person's cultural and linguistic identity.
          <br /><br />
          Imagine a child, anywhere in the world, stepping into a solar-powered learning pod—connected by satellite, sustained by clean water, and guided by a personal AI teacher. Through immersive AR/VR experiences, AI-driven lessons, and blockchain-secured credentials, Tutti Sapienza delivers personalized, multilingual education stored on soul-bound NFTs and permanently verified on-chain. Built for equity, powered by innovation—this is education for everyone, everywhere.
        </p>
      </header>

      <main id="main-content">
      <section className="hero-section" aria-label="Wallet connection">
        <div id="wallet-status" role="status" aria-live="polite">
          {account ? (
            <p>
              Connected with {walletName}: <span title={account}>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
              {chainId && <span className="network-label">Network ID: {chainId}</span>}
            </p>
          ) : (
            <p>{isConnecting ? 'Check your wallet to continue…' : 'Connect your wallet to Tutti Sapienza'}</p>
          )}
        </div>
        {account ? (
          <button className="btn disconnect-button" onClick={disconnectWallet}>Disconnect from Tutti</button>
        ) : wallets.length ? (
          <div className="wallet-buttons" id="wallet-connect-options">
            {wallets.map((wallet) => (
              <button key={wallet.id} className="btn connect-button" disabled={isConnecting} onClick={() => connectWallet(wallet)}>
                Connect with {wallet.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="wallet-help">No browser wallet detected. Use a browser with MetaMask or Rabby, or open this site in your wallet’s browser. You can explore the project without connecting.</p>
        )}
        {isConnecting && !account && (
          <button className="btn disconnect-button" onClick={disconnectWallet}>Cancel connection</button>
        )}
        {error && <p className="wallet-error" role="alert">{error}</p>}
      </section>

      <section className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading">Explore the Tutti vision</h2>
        <p>These are the capabilities we are working toward.</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <details className="feature-details">
                <summary aria-label={`Learn more about ${feature.title}`}>Learn more</summary>
                <p>{feature.detail}</p>
              </details>
            </div>
          ))}
        </div>
      </section>

      <section className="nft-section">
        <h2>Mint Your Educational NFT</h2>
        <p>The Whitepaper NFT is planned as the first step for early community members. Minting is not available yet.</p>
        <div className="nft-preview">
          <div className="nft-image">
            <img src={tuttiArtwork} width="1024" height="768" alt="Tutti Sapienza DAO artwork showing a child wearing a virtual reality headset" loading="lazy" />
          </div>
          <div className="nft-details">
            <h4>Whitepaper NFT</h4>
            <p>Your gateway to the Tutti Sapienza ecosystem</p>
          </div>
          <button className="btn mint-button" disabled>Mint NFT (Coming Soon)</button>
        </div>
      </section>
      </main>

      <footer>
        <div className="social-links">
          <a href="https://twitter.com/tuttisapienza" target="_blank" rel="noopener noreferrer">Twitter</a>
          <span className="community-pending">Discord invite coming soon</span>
          <a href="https://github.com/Tutti-Sapienza/Tutti-Sapienza-Frontend" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} Tutti Sapienza DAO.
        </p>
      </footer>
    </div>
  );
}

export default App;
