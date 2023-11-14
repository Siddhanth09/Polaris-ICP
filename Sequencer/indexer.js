const { JsonRpcProvider } = require('ethers');
const merkle = require('merkle-tree-gen');
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const rpcUrl = 'https://automatic-space-rotary-phone-9xgq5r477w6fpq9r-8545.app.github.dev/';
let latestBlockNumber = -1; // Start with -1 to ensure at least one block is fetched

const provider = new JsonRpcProvider(rpcUrl);

async function getLatestBlockNumber() {
  try {
    const blockNumber = await provider.send('eth_blockNumber', []);
    console.log(blockNumber);
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
  // Only fetch the new blocks since the last check
  for (let i = latestBlockNumber + 1; i <= latestBlockNumber+30; i++) {
    try {
      // Convert block number to hex string with 0x prefix
      const blockNumberHex = `0x${i.toString(16)}`;
      const block = await provider.send('eth_getBlockByNumber', [blockNumberHex, true]); // Pass the block number as hex string
      console.log(block.hash);
      blocks.push(block);
    } catch (error) {
      console.error('Error fetching block:', error.message);
    }
  }

  return blocks;
}

function createMerkleTree(data) {
  const leaves = data.map((block) => {
    if (block) {
      return block.hash; // Assuming 'hash' is the property containing the hash of the block
    } else {
      console.error('Skipping invalid block:', block);
      return ''; // Return an empty string to avoid errors
    }
  });

  const tree = new MerkleTree(leaves, SHA256)
  return tree;
}

async function generateRoot() {
  const extraBlocks = await fetchExtraBlocks();
  if (extraBlocks.length === 0) {
    return;
  }

  // Update the latestBlockNumber
  latestBlockNumber = extraBlocks[extraBlocks.length - 1].number;
  console.log(latestBlockNumber);

  const merkleTree = createMerkleTree(extraBlocks);
  const root = merkleTree.getRoot().toString('hex')
  const leaf = SHA256('a')
  console.log('Merkle Root:', root);
  console.log('Number of leaves:', SHA256(merkleTree.leaves));


  // Perform other operations, such as sending the root hash to another service or contract.
}

// Fetch extra blocks and generate root every 10 seconds
setInterval(generateRoot, 10000);
