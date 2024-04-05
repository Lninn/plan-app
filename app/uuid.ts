'use client'

export function getUUID() {
  return generateUniqueGlobalID();
}

function generateUniqueGlobalID() {
  if (typeof window === 'undefined') {
    return '';
  }

  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 0xFFFFFFFFFFFFF); // 48-bit random number
  const userAgentHash = hashUserAgent(window.navigator.userAgent); // Hash of the user agent string
  const processId = getProcessId(); // Unique identifier for the current process or instance

  return `${timestamp.toString(36)}_${randomPart.toString(36)}_${(userAgentHash as unknown as number).toString(36)}_${processId.toString(36)}`;
}

// Helper function to hash the user agent string
async function hashUserAgent(userAgent: string) {
  const crypto = window.crypto;
  if (crypto && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(userAgent);

      const buffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return hashHex.slice(0, 16); // Truncate to 16 characters for brevity
  } else {
      // Fallback to a less secure hash function if Web Cryptography API is not available
      return murmurhash3_x86_32(userAgent);
  }
}

// Helper function to obtain a unique process ID (e.g., in a Node.js environment)
function getProcessId() {
  // For Node.js:
  if (typeof process !== 'undefined' && process.pid) {
      return process.pid;
  }

  // For browser environments without access to process.pid:
  // You could use a global counter incremented on each call,
  // but this would not guarantee uniqueness across tabs or browser instances.
  // If you have access to a server-side component, you might consider
  // generating and storing IDs there and fetching them client-side as needed.

  // As a fallback for this example, we'll just use a random number:
  return Math.floor(Math.random() * 0xFFFFFF); // 24-bit random number
}
