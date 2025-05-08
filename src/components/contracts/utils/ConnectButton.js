import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const ConnectButton = () => {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div>
      {!account ? (
        <button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="connect-button"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="account-info">
          <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          <button 
            onClick={disconnectWallet}
            className="disconnect-button"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;