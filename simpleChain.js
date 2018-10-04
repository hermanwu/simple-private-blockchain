let addLevelDBData = require('./levelSandbox.js').addLevelDBData;
let getLevelDBData = require('./levelSandbox.js').getLevelDBData;
let getHeightFromLevelDB = require('./levelSandbox.js').getHeightFromLevelDB;

/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/


const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
      this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.chain = [];
  }

  // Add new block
  addBlock(newBlock) {
    return this.getBlockHeight().then((height) => {
      // If no block exists, create a genesis block
      if (height === -1) {
        let genesisBlock = new Block("First block in the chain - Genesis block");
        genesisBlock.height = 0;
        genesisBlock.time = new Date().getTime().toString().slice(0, -3);
        console.log('this is gensis block');

        console.log(genesisBlock);

        genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
        return addLevelDBData(genesisBlock.height, JSON.stringify(genesisBlock).toString()).then(() => {
          return this.addBlock(newBlock);
        });
      }

      newBlock.height = height + 1;
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0, -3);
      // previous block hash

      return this.getBlock(height).then((response) => {
        newBlock.previousBlockHash = response.hash;
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        return addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
      })
    });
  }

  // Get block height
  getBlockHeight() {
    return getHeightFromLevelDB();
  }

  // get block
  getBlock(blockHeight) {
    return getLevelDBData(blockHeight).then(response => JSON.parse(response));
  }

  // validate block
  validateBlock(blockHeight) {
    // get block hash
    return this.getBlock(blockHeight).then((response) => {
      let blockHash = response.hash;

      // remove block hash to test block integrity
      response.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(response)).toString();

      // Compare
      if (blockHash === validBlockHash) {
        return true;
      } else {
        console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
        return false;
      }
    })
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    let promise = Promise.resolve();
    let tempBlockHash = '';

    return this.getBlockHeight().then((height) => {
      for (let i = 0; i <= height; i++) {
        promise = promise.then(() => {
          return this.validateBlock(i).then((response) => {
            console.log(i);
            console.log(response);
            if (response === false) {
              errorLog.push(i);
            }
          })
        }).then(() => {
          this.getBlock(i).then((response) => {
             if (response.previousBlockHash !== tempBlockHash) {
               errorLog.push(i);
             }
             tempBlockHash = response.hash;
          })
        })
      }

      promise.then(() => {
        if (errorLog.length > 0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: ' + errorLog);
        } else {
          console.log('No errors detected');
        }
      })
    });
  }
}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |                                         |
|  ===========================================================================*/

let myBlockChain = new Blockchain();

let theLoop = (i) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      myBlockChain.addBlock(blockTest).then((result) => {
        console.log(result);
        i++;
        if (i < 10) {
          theLoop(i).then(resolve);
        } else {
          resolve('done');
        }
        ;
      });
    }, 1000);
  });
}

theLoop(0).then(() => {
  // get height
  myBlockChain.getBlockHeight().then((response) => {
    console.log(response);
  });

  // validate specific block
  myBlockChain.validateBlock(0).then((response) => {
    console.log(response);
  });

  // validate whole chain
  myBlockChain.validateChain();
});