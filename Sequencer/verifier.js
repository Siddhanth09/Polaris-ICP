// TO write verifier for merkel tree root 
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const { JsonRpcProvider } = require('ethers');

// take inputs 