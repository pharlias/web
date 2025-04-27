export const formatDate = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getTimeRemaining = (expires: string) => {
  const now = Date.now();
  const expiry = parseInt(expires) * 1000;
  const timeLeft = expiry - now;
  if (timeLeft <= 0) return 'Expired';
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  return days > 30 ? `${Math.floor(days / 30)} months left` : `${days} days left`;
};

export const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;