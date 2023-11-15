
const { readFileSync } = require('fs');
const { createHash } = require('crypto');
const { Secp256k1KeyIdentity } = require('@dfinity/identity-secp256k1');
const { HttpAgent } = require('@dfinity/agent');
const os = require('os');
const path = require('path');
const homeDirectory = os.homedir();
// Function to initialize identity from a private key
const initIdentity = () => {
  // const homeDirectory = os.homedir();
  // const identityPath = path.join(homeDirectory, '.config', 'dfx', 'identity', 'sudeep', 'identity.pem');
  // // Use the resolved path to read the file
  // const buffer = readFileSync(identityPath);
  // const key = buffer.toString("utf-8");
  // const privateKey = createHash("sha256").update(key).digest("base64");
  const seed = "fit aspect voice belt leave slim female mesh jealous weather push cost lucky latin valley chat someone whisper nasty soup march print goddess twist";
   const identity =  Secp256k1KeyIdentity.fromSeedPhrase(seed);
  return identity;
};
identity = initIdentity();
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

  const result = await agent.call(canisterId, methodName, { rootindex, entry });
  return result;
}

// Export the function to be used in the main script
module.exports = { callInsertRoot };