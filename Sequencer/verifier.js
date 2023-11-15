const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

function verifyProof(proof, leaf, root) {
  // Convert the leaf and root to buffers
  const leafBuffer = Buffer.from(leaf, 'hex');
  const rootBuffer = Buffer.from(root, 'hex');

  // Create a Merkle tree with a single leaf
  const tree = new MerkleTree([leafBuffer], SHA256);

  // Convert the proof to an array of buffers
  const proofBuffers = proof.map((item) => Buffer.from(item, 'hex'));

  // Verify the proof against the root
  const isValid = tree.verify(proofBuffers, leafBuffer, rootBuffer);

  return isValid;
}

// Example usage:
const proof = JSON.parse(stringProof); // Assuming stringProof is the proof in JSON format
const leaf = leaves[0]; // Assuming leaves is an array of leaf hashes in hex format
const root = '...'; // Replace with the actual Merkle root

const isValid = verifyProof(proof, leaf, root);
console.log('Proof Verification Result:', isValid);
