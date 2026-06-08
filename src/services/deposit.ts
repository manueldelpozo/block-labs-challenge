/**
 * Stub: Simulates fetching a deposit address from the backend.
 * Resolves after ~1.5s with a mock address string.
 * Throws 25% of the time to simulate network/server failures.
 */
export async function fetchDepositAddress(currency: string, network: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.25) {
        reject(new Error('Failed to generate deposit address. Please try again.'));
      } else {
        resolve(`bc1q${currency.toLowerCase()}${network}9a7f8g9h0jkl`);
      }
    }, 1500);
  });
}
