# Polaris-ICP
Polaris is a modular rollup framework with an ABCI-compatible client interface. Thereby seperating Application layer and the consensus layer. It has a specific plug and play system which allows for EVM Execution engine to be plugged with any consensus engine.
I have made a very simple implementation of a sequencer using Polaris and commiting the transactions happening on it to ICP mainet.
## Purpose
- To enable EVM smart Contract layer on ICP
- To reduce execution cost and keep it offchain
- To simplify Interoperability between ICP and EVM
## Architeture 


Here the transactions are packed into blocks and the sequencer Signs the root of the merkel tree formed with these Blocks as roots and is committed to the Canister on ICP.
The canister has a proof validation function aswell which accepts block hash , Merkel root and proof and verifies the validity of the merkel tree.
## Mainet canister id
`cdytg-5iaaa-aaaag-acaya-cai`
## Implementation and usage
![1_e5zHMgnjYCtva6B2khpRSA](https://github.com/muskbuster/Polaris-ICP/assets/81789395/620c2f7d-3e80-4af5-92ec-61f8f34e3283)

- First clone the polaris repository using  Clone [`polaris`](https://github.com/berachain/polaris) to act as our EVM smartContract layer (Ran locally).
- run the following `cd polaris` and `make start`. This will start a localhost at port 8545 in your localhost.
- now open a new terminal and install [`dfx`]([https://github.com/berachain/polaris](https://internetcomputer.org/docs/current/developer-docs/setup/install/)https://internetcomputer.org/docs/current/developer-docs/setup/install/).
- run `cd Canister/StateRoot_backend` and run `dfx compile` then `dfx build`
- Now start your local dfx environment usind `dfx start`
- This will start a local dfx instance now let us deploy the canister
- Run `dfx deploy` this will deploy our Canister to which we will commit the Merkel Root to(do this after you run the sequencer and update it with your localhost URL under verifyRoot).
- Copy the canister ID and paste it in `Sequencer/transaction_Submitter.js` under 
```javascript
 const canisterId = 'bd3sg-teaaa-aaaaa-qaaba-cai';
```
- Change the URl for host to localhost from mainet in the same file
- Also change the Identity seed phrase to your seed phrase 
```javascript 
const seed = "test test test test";
```
- Now change the RPC endpint in `Sequencer/indexer.js` to your Polaris localHost and it will start polling the transactions
- Now host your Verifier endpoint using `node index.js` and run the sequencer using `node indexer.js`
- This will start indexing the blocks being mined on polaris and commits it to your StateRoot contract.
- You can query the merkelRoot of a block by taking the block number and querying the contract through `lookupCommit` in dfx or candid UI
- You can also call the verify_tree with the rootHash the leaf blockhash and the proof to verify the validity of block


![WhatsApp Image 2023-11-16 at 6 30 18 PM](https://github.com/muskbuster/Polaris-ICP/assets/81789395/ba7f5cf2-b86a-415f-b0a7-b91ff46b23e7)
![image](https://github.com/muskbuster/Polaris-ICP/assets/81789395/6d5d8d5b-84d0-4b49-9ce1-2203ae4bb10a)

## Tech stack
- Polaris
- Motoko
- Express
- ICP
- dfx

## Video 

https://www.loom.com/share/3ad81484691c4775823d8b7c7ccd9b70
## Further developments
- Implementation of a more robust sequencer with proper MPC signing for additional security
- Adding a DA layer to the rollup
- Creating a powerfull Fraudproof Mechanism considering this is an optimistic approach to offchain computation
  
