import React, { useEffect, useState } from 'react';
import './App.css';
import learningConcept from './assets/images/tutti-girl-headset.jpg';

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
      id: 'free-education',
      title: 'Free education for everyone',
      description: 'Our goal is free education for every child and every person, in their own language and cultural context.',
      detail: 'Spanish-first development is the first practical step toward teaching the world’s knowledge. Initial pilots will test teaching quality, privacy and funded capacity while preserving the universal goal.',
    },
    {
      id: 'community-dao',
      title: 'A community-owned DAO',
      description: 'The intended organization belongs to its community, with NFT members participating in decisions and votes.',
      detail: 'No single owner is intended to control the mission. Membership, voting, proposal rights, delegation and any temporary stewardship need a published constitution. Exact legal, economic and intellectual-property rights are still to be defined.',
    },
    {
      id: 'artist-collections',
      title: 'Artist-created NFT collections',
      description: 'Exclusive collections are intended to raise capital to build the AI teacher and fund free education.',
      detail: 'The Founders Collection begins the fundraising vision. Collaborations with local and renowned artists are planned; confirmed artist agreements, artwork licenses, collection terms and buyer rights must be published before a sale.',
    },
    {
      id: 'transparent-treasury',
      title: 'Transparent use of funds',
      description: 'The plan makes raised funds and spending visible through on-chain records and public budgets.',
      detail: 'Treasury governance should link receipts and payments to approved budgets and evidence of delivery, including reconciled fiat and off-chain expenses. A live treasury, balances and spending history are not displayed as verified here.',
    },
    {
      id: 'reviewed-rlo',
      title: 'AI-created, reviewed lessons',
      description: 'Reusable learning objects combine reviewed knowledge with AI-assisted text, media, practice and feedback.',
      detail: 'AI authoring, including a proposed Higgsfield media workflow, helps create lesson assets. Every RLO needs objectives, source and license information, language and cultural context, version history and educator review. Generated content is reviewed before reaching learners.',
    },
    {
      id: 'learner-credential',
      title: 'A child-owned living transcript',
      description: 'Each child is intended to receive a separate soulbound, evolving learner credential that belongs to them.',
      detail: 'It evolves with completed lessons and separately supported skill attestations. Completion is distinct from mastery. Personal responses, voice and lesson history stay private off-chain; consent, guardian authority, recovery and age-up need a verified design.',
    },
    {
      id: 'language-culture',
      title: 'Language and cultural stewardship',
      description: 'Local educators, speakers and communities help shape lessons that honor how learners live and think.',
      detail: 'The vision includes indigenous and minority languages, with community permission, cultural review and control of contributed knowledge. Language expansion is planned; broad fluency and completed partnerships are not claimed.',
    },
    {
      id: 'school-fees',
      title: 'Reasonable fees for schools',
      description: 'Public and private schools pay reasonable institutional fees to use the AI agent and sustain free learning.',
      detail: 'Institutional service may include classroom use, educator dashboards, family reporting, integration and support. Fees, affordability, scope and operating costs remain to be specified. Individual learning is intended to be free.',
    },
    {
      id: 'member-contributions',
      title: 'Participation and provenance',
      description: 'NFT-wallet members are intended to vote, propose ideas and create lessons with verifiable contribution records.',
      detail: 'On-chain hashes and attestations track submissions, versions and approved decisions. AI-assisted checks need educator review and human appeal. A wallet is not proof of a unique person; recorded activity is not proof of educational quality.',
    },
  ];

  return (
    <div className="container">
      <a className="skip-link" href="#mission">Skip to content</a>
      <nav className="page-nav" aria-label="Main navigation">
        <a href="#mission">Mission</a>
        <a href="#vision">The vision</a>
        <a href="#nft-roles">The two NFT roles</a>
        <a href="#whitepaper">Whitepaper</a>
      </nav>
      <header>
        <h1>Tutti Sapienza</h1>
        <span className="status-badge">Vision and development plan</span>
      </header>

      <main>
      <section id="mission" className="mission-section" aria-labelledby="mission-title">
        <h2 id="mission-title">The world’s knowledge. Every child. Their own language.</h2>
        <p>
          Tutti Sapienza means “Everyone’s Knowledge.” Our central vision is to give every child and every person free,
          culturally and linguistically responsive education through an AI agent that teaches the world’s knowledge.
          We aim to equalize educational opportunity and help people move out of poverty.
        </p>
        <p>
          A community-owned DAO is intended to guide that mission. Exclusive artist-created NFT collections fund
          development of the teacher, while reasonable public and private school fees support continuing free education.
          The first practical step is a reviewed Spanish-learning experience, developed with human educators.
        </p>
        <div className="mission-actions">
          <a className="btn primary-link" href="#whitepaper">Read the revised whitepaper</a>
          <a className="text-link" href="#nft-roles">Understand the two NFT roles</a>
        </div>
        <p className="development-note">
          The full service, artist collaborations, DAO and learner credentials are planned. A Spanish-first prototype
          is the starting point; the mission and poverty-reduction aspiration are not claims of outcomes already achieved.
        </p>
      </section>

      <section id="vision" className="features-section" aria-labelledby="vision-title">
        <h2 id="vision-title">How the vision works</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.id}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <details>
                <summary>Learn about {feature.title.toLowerCase()}</summary>
                <p>{feature.detail}</p>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section id="nft-roles" className="nft-section" aria-labelledby="nft-roles-title">
        <h2 id="nft-roles-title">Two NFT roles. One educational mission.</h2>
        <div className="role-grid">
          <article>
            <h3>Founding and community collections</h3>
            <p>Artist-created collections are intended to raise money and give buyers community membership,
              shared ownership and governance participation. Exact rights and voting rules need definition before a sale.</p>
          </article>
          <article>
            <h3>The child’s soulbound learner credential</h3>
            <p>A separate, non-tradable credential is intended to evolve with the child’s lessons and achievements.
              Its private living transcript distinguishes lesson completion from assessed mastery.</p>
          </article>
        </div>
        <p>Free education requires no supporter-NFT purchase, token acquisition or learner wallet management.</p>
        <div className="nft-preview">
          <div className="nft-image">
            <img src={learningConcept} alt="Tutti Sapienza learning concept: an illustrated child wearing a headset" />
            <p className="image-caption">Learning concept from the project’s existing artwork</p>
          </div>
          <div className="nft-details">
            <h3>Founders Collection — planned</h3>
            <p>Artist agreements, buyer rights, budgets, governance and security review come before a public offering.</p>
            <button className="btn mint-button" disabled>Founders Collection — sale not open</button>
            <p className="development-note">No collection price, supply, launch date or supported payment asset is announced here.</p>
          </div>
        </div>
      </section>

      <section className="hero-section community-wallet" aria-labelledby="wallet-title">
        <h2 id="wallet-title">Optional community wallet connection</h2>
        <p>This existing connection interface displays an address. Membership verification, voting and lesson submission
          are planned; connecting does not establish those rights or make a purchase.</p>
        <div id="wallet-status" role="status" aria-live="polite">
          {isConnected ? (
            <p>
              Connected with {walletType}: {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </p>
          ) : (
            <p>No wallet connected. You can read the vision and whitepaper without one.</p>
          )}
        </div>
        {!isConnected && (
          <div className="wallet-buttons" id="wallet-connect-options">
            <button className="btn connect-button" onClick={() => connectWallet('MetaMask')}>Connect with MetaMask</button>
            <button className="btn connect-button" onClick={() => connectWallet('Rabby')}>Connect with Rabby</button>
          </div>
        )}
      </section>

      <section className="protocol-note" aria-labelledby="protocol-title">
        <h2 id="protocol-title">Protocol decisions under review</h2>
        <p>Token versus no-token design, chains, supported payment assets and treasury-risk policies remain proposals.
          Teaching, privacy and community accountability guide those decisions. No token issuance, investment returns
          or charitable tax treatment is promised.</p>
      </section>

      <section id="whitepaper" className="whitepaper-section" aria-labelledby="whitepaper-title">
        <h2 id="whitepaper-title">The revised whitepaper</h2>
        <p>A working revision of May 2026 v3.1 brings the universal mission, artist funding, community governance,
          AI-created lessons and evolving learner credentials together. It preserves the original structure and marks
          implementation and policy proposals honestly.</p>
        <div className="mission-actions">
          <a className="btn primary-link" href="/docs/Tutti-Sapienza-Whitepaper-review.pdf">Read working whitepaper (PDF)</a>
          <a className="text-link" href="/docs/Tutti-Sapienza-Whitepaper-review.docx" download>Download working copy (Word)</a>
          <a className="text-link" href="/docs/whitepaper-redline.html">Review the changes</a>
        </div>
      </section>
      </main>

      <footer>
        <div className="social-links">
          <a href="https://github.com/Tutti-Sapienza/Tutti-Sapienza-Frontend" target="_blank" rel="noopener noreferrer">Project repository</a>
          <a href="#whitepaper">Whitepaper</a>
        </div>
        <p className="copyright">
          © 2026 Tutti Sapienza. A vision for community-owned education.
        </p>
      </footer>
    </div>
  );
}

export default App;
