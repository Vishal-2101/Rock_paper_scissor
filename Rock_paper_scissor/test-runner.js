const {execSync} = require('child_process');
try{
  console.log('Running tests...');
  execSync('node test/game.test.js', {stdio:'inherit'});
  console.log('Tests finished successfully');
}catch(e){
  console.error('Tests failed');
  process.exit(1);
}
