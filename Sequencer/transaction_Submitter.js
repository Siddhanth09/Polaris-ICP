
const { readFileSync } = require('fs');
const { createHash } = require('crypto');
const { Secp256k1KeyIdentity } = require('@dfinity/identity-secp256k1');
const { HttpAgent } = require('@dfinity/agent');
// Function to initialize identity from a private key
const initIdentity = () => {
  const buffer = readFileSync(process.env.PATH_TO_PRIVATE_KEY);
  const key = buffer.toString("utf-8");
  const privateKey = createHash("sha256").update(key).digest("base64");

  const secp = Secp256k1KeyIdentity.fromSecretKey(
    Buffer.from(privateKey, "base64"),
  );
  return secp;
};
const identity = initIdentity();
const host = 'https://ic0.app';
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

  const result = await agent.call(canisterId, methodName, { rootindex, entry });
  return result;
}

// Export the function to be used in the main script

