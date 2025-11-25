// Pure game logic for Rock-Paper-Scissors
const choices = ['rock','paper','scissors'];
const emojiMap = {rock: '✊', paper: '✋', scissors: '✌️'};

function decide(player, computer){
  if(player === computer) return 'draw';
  if((player === 'rock' && computer === 'scissors') ||
     (player === 'scissors' && computer === 'paper') ||
     (player === 'paper' && computer === 'rock')) return 'win';
  return 'lose';
}

// For best-of matches, determine whether someone reached required wins
function bestOfWinner(playerWins, computerWins, required){
  if(playerWins >= required) return 'player';
  if(computerWins >= required) return 'computer';
  return null;
}

// Evaluate multiplayer picks. `picks` is an array of moves (strings) in player order.
// Returns { winners: [indexes], winningMove: 'rock'|'paper'|'scissors'|null, draw: boolean }
function evaluateMulti(picks){
  const uniq = Array.from(new Set(picks));
  // If all same or all three present => draw
  if(uniq.length === 1 || uniq.length === 3) return {winners: [], winningMove: null, draw: true};
  // If two moves present, determine which wins
  // rock beats scissors, scissors beats paper, paper beats rock
  const present = new Set(uniq);
  let winMove = null;
  if(present.has('rock') && present.has('scissors')) winMove = 'rock';
  else if(present.has('scissors') && present.has('paper')) winMove = 'scissors';
  else if(present.has('paper') && present.has('rock')) winMove = 'paper';
  if(!winMove) return {winners: [], winningMove: null, draw: true};
  const winners = [];
  picks.forEach((mv, idx)=>{ if(mv === winMove) winners.push(idx); });
  return {winners, winningMove: winMove, draw: false};
}

if(typeof module !== 'undefined'){
  module.exports = {decide, bestOfWinner, choices, emojiMap};
}
