import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const firstAccount = '0x1111111111111111111111111111111111111111';
const secondAccount = '0x2222222222222222222222222222222222222222';
function wallet(flags = {}, approved = []) {
  const listeners = new Map();
  return {
    ...flags,
    request: jest.fn(async ({ method }) => {
      if (method === 'eth_accounts') return approved;
      if (method === 'eth_requestAccounts') return [firstAccount];
      if (method === 'eth_chainId') return '0x1';
      throw new Error(`Unexpected wallet request: ${method}`);
    }),
    on: jest.fn((event, callback) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(callback);
    }),
    removeListener: jest.fn((event, callback) => listeners.get(event)?.delete(callback)),
    emit: (event, value) => [...(listeners.get(event) || [])].forEach((callback) => callback(value)),
    listenerCount: () => [...listeners.values()].reduce((total, entries) => total + entries.size, 0),
  };
}
afterEach(() => { delete window.ethereum; });

test('visitors without a wallet can explore the project and cannot mint', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Tutti Sapienza', level: 1 })).toBeInTheDocument();
  expect(screen.getByText(/No browser wallet detected/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Mint NFT/ })).toBeDisabled();
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/Tutti-Sapienza/Tutti-Sapienza-Frontend');
  expect(screen.getByLabelText('Learn more about DAO Treasury').closest('details')).toHaveTextContent('tutti-sapienza.eth');
  expect(screen.getByRole('img').getAttribute('src')).not.toContain('placeholder.com');
});

test('selects Rabby separately from MetaMask and tracks account and network changes', async () => {
  const metamask = wallet({ isMetaMask: true });
  const rabby = wallet({ isRabby: true, isMetaMask: true });
  window.ethereum = { providers: [metamask, rabby] };
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Connect with Rabby' }));
  await screen.findByText(/Connected with Rabby/);
  expect(metamask.request).not.toHaveBeenCalled();
  expect(rabby.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
  await screen.findByText('Network ID: 1');
  act(() => {
    rabby.emit('accountsChanged', [secondAccount]);
    rabby.emit('chainChanged', '0x14a34');
  });
  expect(screen.getByTitle(secondAccount)).toBeInTheDocument();
  expect(screen.getByText('Network ID: 84532')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Disconnect from Tutti' }));
  expect(rabby.listenerCount()).toBe(0);
  act(() => rabby.emit('accountsChanged', [firstAccount]));
  expect(screen.queryByText(/Connected with Rabby/)).not.toBeInTheDocument();
});

test('discovers late announcements and deduplicates them', async () => {
  const announced = wallet();
  render(<App />);
  const announce = () => window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
    detail: { info: { name: 'Rabby', uuid: 'example-wallet', rdns: 'io.rabby' }, provider: announced },
  }));
  act(() => { announce(); announce(); });
  expect(screen.getAllByRole('button', { name: 'Connect with Rabby' })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Connect with Rabby' }));
  await screen.findByText(/Connected with Rabby/);
});

test('restores an authorized wallet without prompting and cleans up in StrictMode', async () => {
  const provider = wallet({ isRabby: true, isMetaMask: true }, [firstAccount]);
  window.ethereum = provider;
  const { unmount } = render(<React.StrictMode><App /></React.StrictMode>);
  await screen.findByTitle(firstAccount);
  await screen.findByText('Network ID: 1');
  expect(provider.request).not.toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
  expect(provider.listenerCount()).toBe(3);
  unmount();
  expect(provider.listenerCount()).toBe(0);
});

test.each([
  [4001, /Connection canceled/],
  [-32002, /request is already open/],
  [4900, /cannot reach its network/],
])('shows an actionable message for wallet error %s', async (code, message) => {
  const provider = wallet({ isMetaMask: true });
  window.ethereum = { providers: [provider, wallet({ isRabby: true })] };
  provider.request.mockRejectedValue({ code });
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Connect with MetaMask' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(message);
  expect(screen.getByRole('button', { name: 'Connect with MetaMask' })).toBeEnabled();
  expect(provider.listenerCount()).toBe(0);
});

test('blocks duplicate requests and ignores approval after disconnection', async () => {
  const provider = wallet({ isMetaMask: true });
  window.ethereum = { providers: [provider, wallet({ isRabby: true })] };
  let approve;
  provider.request.mockImplementation(() => new Promise((resolve) => { approve = resolve; }));
  render(<App />);
  const connect = screen.getByRole('button', { name: 'Connect with MetaMask' });
  fireEvent.click(connect);
  expect(connect).toBeDisabled();
  fireEvent.click(connect);
  expect(provider.request).toHaveBeenCalledTimes(1);
  act(() => provider.emit('disconnect', { code: 4900 }));
  await act(async () => approve([firstAccount]));
  expect(screen.queryByTitle(firstAccount)).not.toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent(/wallet disconnected/);
});

test('newer account and network events take precedence over pending replies', async () => {
  const provider = wallet({ isMetaMask: true });
  window.ethereum = { providers: [provider, wallet({ isRabby: true })] };
  let approve;
  let reportChain;
  provider.request.mockImplementation(({ method }) => new Promise((resolve) => {
    if (method === 'eth_requestAccounts') approve = resolve;
    if (method === 'eth_chainId') reportChain = resolve;
  }));
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Connect with MetaMask' }));
  act(() => provider.emit('accountsChanged', [secondAccount]));
  await act(async () => approve([firstAccount]));
  act(() => provider.emit('chainChanged', '0x14a34'));
  await act(async () => reportChain('0x1'));
  expect(screen.getByTitle(secondAccount)).toBeInTheDocument();
  expect(screen.getByText('Network ID: 84532')).toBeInTheDocument();
});

test('clears the account when wallet access is revoked', async () => {
  const provider = wallet({ isMetaMask: true }, [firstAccount]);
  window.ethereum = provider;
  render(<App />);
  await screen.findByTitle(firstAccount);
  act(() => provider.emit('accountsChanged', []));
  expect(screen.queryByTitle(firstAccount)).not.toBeInTheDocument();
  expect(provider.listenerCount()).toBe(0);
  expect(screen.getByRole('button', { name: 'Connect with MetaMask' })).toBeEnabled();
});
