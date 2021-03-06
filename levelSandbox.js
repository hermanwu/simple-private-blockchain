/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key, value){
  return new Promise(function(resolve, reject) {
    db.put(key, value, function(err) {
      if (err) {
        return console.log('Block ' + key + ' submission failed', err);
      }
      resolve(value);
    });
  })

}

// Get data from levelDB with key
function getLevelDBData(key){
  return new Promise(function(resolve, reject) {
    db.get(key, function (err, value) {
      if (err) {
        console.log('Not found!', err);
        reject();
      }
      resolve(value);
    })
  });
}

function getHeightFromLevelDB() {
  return new Promise(function(resolve, reject){
    let i = -1;
    db.createReadStream()
      .on('data', function (data) {
        i = i + 1;
      })
      .on('error', function (err) {
        reject(err)
      })
      .on('close', function () {
        //console.log(i);
        resolve(i);
      });
  });
}

module.exports = {
  addLevelDBData: addLevelDBData,
  getLevelDBData: getLevelDBData,
  getHeightFromLevelDB: getHeightFromLevelDB,
}