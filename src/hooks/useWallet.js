import { useCallback, useEffect, useRef, useState } from 'react';

const getWalletName = (provider) => {
  // Rabby may also expose isMetaMask for compatibility.
  if (provider.isRabby) return 'Rabby';
  if (provider.isMetaMask) return 'MetaMask';
  return 'Browser wallet';
};

const getAccount = (accounts) =>
  Array.isArray(accounts) && typeof accounts[0] === 'string' &&
  /^0x[0-9a-f]{40}$/i.test(accounts[0]) ? accounts[0] : '';

const getChain = (value) =>
  typeof value === 'string' && /^0x[0-9a-f]+$/i.test(value)
    ? window.BigInt(value).toString() : '';

function connectionError(error) {
  if (Number(error?.code) === 4001) return 'Connection canceled. You can try again when you are ready.';
  if (Number(error?.code) === -32002) return 'A connection request is already open. Check your wallet to continue.';
  if ([4900, 4901].includes(Number(error?.code))) return 'Your wallet cannot reach its network. Check the connection in your wallet and try again.';
  return 'Could not connect your wallet. Open your wallet, unlock it, and try again.';
}

export default function useWallet() {
  const [wallets, setWallets] = useState([]);
  const [account, setAccount] = useState('');
  const [walletName, setWalletName] = useState('');
  const [chainId, setChainId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const session = useRef(0);
  const busy = useRef(false);
  const removeListeners = useRef(() => {});

  const disconnectWallet = useCallback(() => {
    session.current += 1;
    removeListeners.current();
    removeListeners.current = () => {};
    busy.current = false;
    setAccount('');
    setWalletName('');
    setChainId('');
    setIsConnecting(false);
    setError('');
  }, []);

  const connectWallet = useCallback(async (wallet, restore = false) => {
    if (busy.current || typeof wallet?.provider?.request !== 'function') return;
    disconnectWallet();
    const requestSession = session.current;
    const provider = wallet.provider;
    const isCurrent = () => session.current === requestSession;
    let accountsChanged = false;
    let chainChanged = false;
    busy.current = true;
    setIsConnecting(true);
    setWalletName(wallet.name);

    const onAccounts = (accounts) => {
      if (!isCurrent()) return;
      accountsChanged = true;
      const nextAccount = getAccount(accounts);
      if (!nextAccount) disconnectWallet();
      else setAccount(nextAccount);
    };
    const onChain = (chain) => {
      if (!isCurrent()) return;
      chainChanged = true;
      setChainId(getChain(chain));
    };
    const onDisconnect = () => {
      if (!isCurrent()) return;
      disconnectWallet();
      setError('Your wallet disconnected. Reconnect when you are ready.');
    };

    // Attach before requesting accounts so events cannot be lost during approval.
    if (typeof provider.on === 'function' && typeof provider.removeListener === 'function') {
      provider.on('accountsChanged', onAccounts);
      provider.on('chainChanged', onChain);
      provider.on('disconnect', onDisconnect);
      removeListeners.current = () => {
        provider.removeListener('accountsChanged', onAccounts);
        provider.removeListener('chainChanged', onChain);
        provider.removeListener('disconnect', onDisconnect);
      };
    }

    try {
      const accounts = await provider.request({
        method: restore ? 'eth_accounts' : 'eth_requestAccounts',
      });
      if (!isCurrent()) return;
      if (!accountsChanged) {
        const nextAccount = getAccount(accounts);
        if (!nextAccount) {
          disconnectWallet();
          if (!restore) setError('No account was shared. Unlock your wallet and choose an account to connect.');
          return;
        }
        setAccount(nextAccount);
      }
      // Network information is useful, but a failed read must not undo account access.
      try {
        const chain = await provider.request({ method: 'eth_chainId' });
        if (isCurrent() && !chainChanged) setChainId(getChain(chain));
      } catch {
        // Leave network unknown until the wallet reports a chain change.
      }
    } catch (err) {
      if (isCurrent()) {
        disconnectWallet();
        if (!restore) setError(connectionError(err));
      }
    } finally {
      if (isCurrent()) {
        busy.current = false;
        setIsConnecting(false);
      }
    }
  }, [disconnectWallet]);

  useEffect(() => {
    const discovered = new Map();
    const addWallet = (provider, name, announced = false) => {
      if (typeof provider?.request !== 'function') return;
      const previous = discovered.get(provider);
      if (previous && !announced) return;
      discovered.set(provider, {
        id: previous?.id || `wallet-${discovered.size}`,
        name: typeof name === 'string' && name.trim() ? name.slice(0, 60) : getWalletName(provider),
        provider,
      });
      setWallets([...discovered.values()]);
    };
    const onAnnouncement = (event) => {
      const detail = event.detail;
      if (detail?.provider && detail?.info) {
        addWallet(detail.provider, detail.info.name, true);
      }
    };
    const addLegacyWallets = () => {
      const injected = window.ethereum;
      const providers = Array.isArray(injected?.providers) && injected.providers.length
        ? injected.providers : [injected];
      providers.forEach((provider) => addWallet(provider));
    };

    window.addEventListener('eip6963:announceProvider', onAnnouncement);
    window.addEventListener('ethereum#initialized', addLegacyWallets);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    addLegacyWallets();
    // Restore approved access when exactly one provider is known at startup.
    if (discovered.size === 1) connectWallet([...discovered.values()][0], true);

    return () => {
      window.removeEventListener('eip6963:announceProvider', onAnnouncement);
      window.removeEventListener('ethereum#initialized', addLegacyWallets);
      session.current += 1;
      busy.current = false;
      removeListeners.current();
      removeListeners.current = () => {};
    };
  }, [connectWallet]);

  return { wallets, account, walletName, chainId, isConnecting, error, connectWallet, disconnectWallet };
}
