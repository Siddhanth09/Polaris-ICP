const express = require('express');
const bodyParser = require('body-parser');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const verifyProof = require('./verifier');
const app = express();
const port = 3000;
const DfinityAgent = require('@dfinity/agent');
app.use(bodyParser.json());
app.post('/verify-proof', (req, res) => {
  try {
    const { proof, leaf, root } = req.body;

    // Verify the proof
    const isValid = verifyProof(proof, leaf, root);
    // Respond with the verification result
    res.json({ isValid });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
