const assert = require('assert');
const {decide, bestOfWinner} = require('../game.js');

function testDecide(){
  assert.strictEqual(decide('rock','scissors'),'win');
  assert.strictEqual(decide('rock','paper'),'lose');
  assert.strictEqual(decide('paper','paper'),'draw');
  assert.strictEqual(decide('scissors','paper'),'win');
}

function testBestOf(){
  assert.strictEqual(bestOfWinner(2,0,2),'player');
  assert.strictEqual(bestOfWinner(0,3,3),'computer');
  assert.strictEqual(bestOfWinner(1,1,2),null);
}

function run(){
  testDecide();
  testBestOf();
  console.log('All tests passed');
}

if(require.main === module) run();
