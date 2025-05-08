import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

const LandingPage = () => {
  const { account, contract, isConnecting, error, connectWallet, mintWhitepaper } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [ensDomain, setEnsDomain] = useState('');
  
  useEffect(() => {
    // Fetch ENS domain from contract if connected
    const fetchEnsDomain = async () => {
      if (contract) {
        try {
          const domain = await contract.getENSDomain();
          setEnsDomain(domain);
        } catch (error) {
          console.error("Error fetching ENS domain:", error);
          // Fallback to hardcoded domain if contract call fails
          setEnsDomain("tutti-sapienza.eth");
        }
      } else {
        // Fallback to hardcoded domain if no contract
        setEnsDomain("tutti-sapienza.eth");
      }
    };
    
    fetchEnsDomain();
  }, [contract]);

  // Handle minting the whitepaper NFT
  const handleMint = async () => {
    if (isMinting) return;
    
    setIsMinting(true);
    setMintError(null);
    setMintSuccess(false);
    
    try {
      // IPFS URI for your whitepaper metadata
      const metadataURI = "ipfs://YOUR_METADATA_URI";
      await mintWhitepaper(metadataURI);
      setMintSuccess(true);
    } catch (err) {
      setMintError(err.message || "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="landing-page">
      <header>
        <h1>Tutti Sapienza</h1>
        <h2>Decentralized Education for All</h2>
        
        <p>
          Democratizing education through AI voice agents, dynamic NFTs, and immersive 3D learning experiences.
        </p>
        
        {/* ENS Domain Display */}
        <div className="ens-domain-display">
          <h3>Project ENS Domain:</h3>
          <p className="ens-domain">{ensDomain}</p>
          <p className="ens-info">This domain is connected to our smart contract at {contract ? contract.address : "0x5b5bdC053F77127AA067dDCfa9C7eFf38Ca2c31A"}</p>
        </div>
        
        <div className="connect-section">
          {!account ? (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="connect-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="account-section">
              <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
              <button 
                onClick={handleMint}
                disabled={isMinting}
                className="mint-button"
              >
                {isMinting ? 'Minting...' : 'Mint Free Whitepaper NFT'}
              </button>
              
              {mintSuccess && (
                <p className="success-message">Successfully minted your Tutti Sapienza Whitepaper NFT!</p>
              )}
              
              {mintError && (
                <p className="error-message">Error: {mintError}</p>
              )}
            </div>
          )}
          
          {error && (
            <p className="error-message">Error: {error}</p>
          )}
        </div>
      </header>

      <section className="vision-section">
        <h2>Our Vision</h2>
        
        <div className="vision-grid">
          <div className="vision-item">
            <h3>AI Voice Agents</h3>
            <p>Personalized AI teachers that adapt to each child's learning style, native language, and pace.</p>
          </div>
          
          <div className="vision-item">
            <h3>EIP-3664 Dynamic NFTs</h3>
            <p>Learning credentials that evolve as children progress, storing their educational journey securely on the blockchain.</p>
          </div>
          
          <div className="vision-item">
            <h3>3D Immersive Learning</h3>
            <p>Engaging AR/VR experiences that make abstract concepts concrete and knowledge accessible to all.</p>
          </div>
          
          <div className="vision-item">
            <h3>Decentralized Governance</h3>
            <p>Community-driven education platform where teachers, parents, and learners shape the future of learning.</p>
          </div>
        </div>
      </section>

      <section className="community-section">
        <h2>Join Our Community</h2>
        
        <p>
          We're looking for developers, educators, AI specialists, and 3D designers to help build the future of education.
        </p>
        
        <div className="social-buttons">
          <button className="discord-button">Discord</button>
          <button className="github-button">GitHub</button>
          <button className="twitter-button">Twitter</button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;