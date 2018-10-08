let Blockchain = require('./simpleChain.js').Blockchain;
let Block = require('./simpleChain.js').Block;
const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.text({type: '*/*'}));
app.use(bodyParser.json());

app.get('/block/:blockHeight',
  (req, res) => {
    const height = req.params.blockHeight;

    let myBlockChain = new Blockchain();

    myBlockChain.getBlock(height).then((response) => {
      return res.json(response);
    });
  })

app.post('/block',
  (req, res) => {

    if (!req.body) {
      throw new Error("Request does not have payload");
    }

    const requestObject = JSON.parse(req.body);
    console.log(requestObject);
    const myBlockChain = new Blockchain();
    if (!requestObject || !requestObject.body) {
      throw new Error("Request does not contain required properties");
    }

    const newBlock = new Block(requestObject.body);
    myBlockChain.addBlock(newBlock).then((result) => {
      return res.json(JSON.parse(result));
    });

})

app.listen(8000, () => console.log('Example app listening on port 8000!'))