const { readFileSync } = require('fs');
const { createHash } = require('crypto');
const { id } = require('@dfinity/identity');
const { Secp256k1KeyIdentity } = require('@dfinity/identity-secp256k1');

const { HttpAgent } = require('@dfinity/agent');
const { Principal } = require('@dfinity/principal'); // Add this import
const os = require('os');

const path = require('path');

// Function to initialize identity from a private key
const initIdentity = () => {
  // Use the seed phrase to initialize the identity
  const seed = "test test test";
  const identity = Secp256k1KeyIdentity.fromSeedPhrase(seed);
  return identity;
};

const identity = initIdentity();
const host = 'https://automatic-space-rotary-phone-9xgq5r477w6fpq9r-4943.app.github.dev/';
const agent = new HttpAgent({
  identity,
  // fetch and host need to be defined or imported appropriately
  fetch,
  host,
});

// Replace 'your_canister_id' with the actual canister ID
const canisterId = 'bd3sg-teaaa-aaaaa-qaaba-cai';

// Example function to call the 'insertRoot' method on the canister
async function callInsertRoot(rootindex, entry) {
  const methodName = 'insertRoot';
  const sender = identity.getPublicKey;
  const result = await agent.call(canisterId, methodName, { rootindex, entry }, { sender: sender });
  return result;
}

// Export the function to be used in the main script
module.exports = { callInsertRoot };
