import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

afterEach(() => { delete window.ethereum; });

test('keeps the founding sale disabled and offers the whitepaper without a wallet', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /founders collection.*sale not open/i })).toBeDisabled();
  expect(screen.getByRole('link', { name: /read working whitepaper/i })).toHaveAttribute('href', '/docs/Tutti-Sapienza-Whitepaper-review.pdf');
  expect(screen.getByRole('heading', { name: /child’s soulbound learner credential/i })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent(/no wallet connected/i);
});

test('preserves optional connection with account requests and no signature or transaction', async () => {
  const address = '0x1111111111111111111111111111111111111111';
  const request = jest.fn(async ({ method }) => method === 'eth_accounts' ? [] : [address]);
  window.ethereum = { request, isMetaMask: true };
  render(<App />);
  await waitFor(() => expect(request).toHaveBeenCalledWith({ method: 'eth_accounts' }));
  userEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/0x1111.*1111/));
  expect(request.mock.calls.map(([args]) => args.method)).toEqual(['eth_accounts', 'eth_requestAccounts']);
  expect(screen.getByRole('button', { name: /founders collection.*sale not open/i })).toBeDisabled();
});

test('restores a previously permitted address without requesting new permission', async () => {
  const request = jest.fn(async () => ['0x2222222222222222222222222222222222222222']);
  window.ethereum = { request, isMetaMask: true };
  render(<App />);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/0x2222.*2222/));
  expect(request.mock.calls.map(([args]) => args.method)).toEqual(['eth_accounts']);
  expect(screen.queryByRole('button', { name: /connect with metamask/i })).not.toBeInTheDocument();
});
