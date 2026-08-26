// Minimal nanoid implementation (no external dep needed for demo)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function nanoid(len = 21): string {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr, b => chars[b % chars.length]).join('');
}
