const generateTransactionReference = () => {
  // A simple way to create a unique reference using a timestamp and a random string.
  // This helps ensure each transaction has a unique identifier.
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${randomPart}`;
};

module.exports = generateTransactionReference;