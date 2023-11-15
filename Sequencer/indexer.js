const { JsonRpcProvider } = require('ethers');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const {callInsertRoot}=require('./transaction_Submitter');

const rpcUrl = 'https://automatic-space-rotary-phone-9xgq5r477w6fpq9r-8545.app.github.dev/';
let latestBlockNumber = -1; // Start with -1 to ensure at least one block is fetched

const provider = new JsonRpcProvider(rpcUrl);

async function getLatestBlockNumber() {
  try {
    const blockNumber = await provider.send('eth_blockNumber', []);
    console.log('newblocknumber',blockNumber);
    return Number(blockNumber); // Convert to hex string
  } catch (error) {
    console.error('Error getting latest block number:', error.message);
    return 0; // Return 0 if error
  }
}

async function fetchExtraBlocks() {
  const latestBlock = await getLatestBlockNumber();

  // Check if there are new blocks since the last check
  if (latestBlock <= latestBlockNumber) {
    console.log('No new blocks.');
    return [];
  }

  const blocks = [];
  const batchSize = 100;
  const startBlock = latestBlockNumber + 1;
  const endBlock = Math.min(startBlock + batchSize - 1, latestBlock);

  // Only fetch blocks in batches of 100
  for (let i = startBlock; i <= endBlock; i++) {
    try {
      // Convert block number to hex string with 0x prefix
      const blockNumberHex = `0x${i.toString(16)}`;
      const block = await provider.send('eth_getBlockByNumber', [blockNumberHex, true]); // Pass the block number as hex string
      console.log('blockhashes',block.hash);
      blocks.push(block);
    } catch (error) {
      console.error('Error fetching block:', error.message);
    }
  }

  // Update the latestBlockNumber only if blocks are fetched
  if (blocks.length > 0) {
    latestBlockNumber = blocks[blocks.length - 1].number;
  }

  return blocks;
}

function createMerkleTree(data) {
  const leaves = data.map((block) => {
    if (block) {
      return ('blockhash',block.hash);
    } else {
      console.error('Skipping invalid block:', block);
      return ''; // Return an empty string to avoid errors
    }
  });

  const tree = new MerkleTree(leaves, SHA256);
  return tree;
}

async function generateRoot() {
  const extraBlocks = await fetchExtraBlocks();
  if (extraBlocks.length === 0) {
    return;
  }

  console.log('Latest Block Number:', latestBlockNumber);

  const merkleTree = createMerkleTree(extraBlocks);
  const leaves = merkleTree.getLeaves().map((leaf) => leaf.toString('hex'));
  const proof = merkleTree.getProof(leaves[0]);
  stringProof = JSON.stringify(proof);
  const root = merkleTree.getRoot().toString('hex');
  const result = await callInsertRoot(latestBlockNumber, root);
  console.log('Result:', result);
  console.log('Merkle Root:', root);
  console.log('Merkle Leaves:', leaves);
  console.log('Merkle Proof:', stringProof);

  // Perform other operations, such as sending the root hash to another service or contract.
}

// Fetch extra blocks and generate root every 10 seconds
setInterval(generateRoot, 100); // Change interval to 10 seconds