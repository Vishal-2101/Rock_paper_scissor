// Game state
let playerScore = 0;
let computerScore = 0;
let soundEnabled = false;
let animationsEnabled = true;
let mode = 'endless'; // 'endless' | 'best-of-3' | 'best-of-5'
let requiredToWin = null; // computed from mode
// Single-player only: multiplayer features removed
let socket = null; // reserved for future online play

// Try to import logic if available (node/browser compatible)
let decideFn = null;
let emojiMap = {rock: '✊', paper: '✋', scissors: '✌️'};
try{
  if(typeof require === 'function'){
    const g = require('./game.js');
    decideFn = g.decide;
    emojiMap = g.emojiMap || emojiMap;
  }
}catch(e){
  // ignore in browser
}
if(!decideFn){
  decideFn = function(p,c){
    if(p === c) return 'draw';
    if((p === 'rock' && c === 'scissors') ||
       (p === 'scissors' && c === 'paper') ||
       (p === 'paper' && c === 'rock')) return 'win';
    return 'lose';
  };
}

// Elements
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const playerPickEl = document.getElementById('player-pick');
const computerPickEl = document.getElementById('computer-pick');
const resultEl = document.getElementById('result');
const choiceButtons = Array.from(document.querySelectorAll('.choice'));
const resetBtn = document.getElementById('reset');
const soundToggle = document.getElementById('soundToggle');
const multiCountWrap = null; // multiplayer UI removed
const modal = document.getElementById('matchModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalReset = document.getElementById('modalReset');
const volumeControl = document.getElementById('volume');
const turnIndicator = null;
const nextTurnBtn = null;

// Sounds
// WebAudio synth for short tones
let audioCtx = null;
function beep(freq, time=0.08, type='sine'){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + time);
    o.stop(audioCtx.currentTime + time + 0.02);
  }catch(e){}
}

function computerChoice(){
  const arr = ['rock','paper','scissors'];
  return arr[Math.floor(Math.random()*arr.length)];
}

function decide(p, c){
  return decideFn(p,c);
}

function playRound(playerSel){
  // Single-player round
  const comp = computerChoice();
  // animate picks
  playerPickEl.textContent = emojiMap[playerSel];
  computerPickEl.textContent = '...';
  resultEl.textContent = '...';
  resultEl.className = 'result';

  // small delay for fun
  setTimeout(()=>{
    computerPickEl.textContent = emojiMap[comp];
    const res = decide(playerSel, comp);
    if(res === 'win'){
      playerScore++;
      resultEl.textContent = 'You win!';
      resultEl.classList.add('win');
      if(soundEnabled) beep(880,0.12,'sine');
      if(animationsEnabled) launchConfetti();
    } else if(res === 'lose'){
      computerScore++;
      resultEl.textContent = 'You lose';
      resultEl.classList.add('lose');
      if(soundEnabled) beep(180,0.12,'sawtooth');
    } else {
      resultEl.textContent = "It's a draw";
      resultEl.classList.add('draw');
      if(soundEnabled) beep(440,0.08,'triangle');
    }
    updateScores();
    checkMatchOver();
  }, 550);
}

// Match handling
function setMode(m){
  mode = m;
  if(mode === 'best-of-3') requiredToWin = 2;
  else if(mode === 'best-of-5') requiredToWin = 3;
  else requiredToWin = null;
}

function checkMatchOver(){
  if(!requiredToWin) return;
  if(playerScore >= requiredToWin || computerScore >= requiredToWin){
    const winner = playerScore > computerScore ? 'You won the match!' : 'Computer won the match.';
    resultEl.textContent = winner;
    if(soundEnabled) beep(playerScore>computerScore?1000:160,0.2,'sine');
    // show modal summary and auto-reset after 4s
    showMatchSummary({single:true, winner: winner});
    choiceButtons.forEach(b=>b.disabled=true);
    setTimeout(()=>{ resetBtn.click(); }, 4000);
  }
}

// Multiplayer removed: checkMultiMatchOver not needed

// Multiplayer removed: updateMultiScores not needed

function showMatchSummary({single,winner}){
  modalBody.textContent = winner || 'Match over';
  modal.setAttribute('aria-hidden','false');
  modal.style.display='block';
}

modalClose.addEventListener('click', ()=>{ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
modalReset.addEventListener('click', ()=>{ resetBtn.click(); modal.style.display='none'; });

function updateScores(){
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

choiceButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const choice = btn.dataset.choice;
    playRound(choice);
  });
  btn.addEventListener('keyup', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      btn.click();
    }
  });
});

resetBtn.addEventListener('click', ()=>{
  playerScore = 0; computerScore = 0; updateScores();
  playerPickEl.textContent = '—';
  computerPickEl.textContent = '—';
  resultEl.textContent = 'Make your move';
  resultEl.className = 'result';
  choiceButtons.forEach(b=>b.disabled=false);
});

soundToggle.addEventListener('change', (e)=>{
  soundEnabled = !!e.target.checked;
});

const animToggle = document.getElementById('animToggle');
if(animToggle){
  animationsEnabled = animToggle.checked;
  animToggle.addEventListener('change',(e)=>{ animationsEnabled = !!e.target.checked; });
}

const modeSelect = document.getElementById('modeSelect');
if(modeSelect){
  setMode(modeSelect.value);
  modeSelect.addEventListener('change',(e)=>{ setMode(e.target.value); });
}

// Multiplayer UI and event handlers removed (single-player only)

if(volumeControl){
  volumeControl.addEventListener('input',(e)=>{
    const v = parseFloat(e.target.value);
    if(audioCtx) audioCtx.listener && (audioCtx.destination.gain && (audioCtx.destination.gain.value = v));
  });
}

// keyboard controls
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 'r') document.querySelector('[data-choice="rock"]').click();
  if(e.key.toLowerCase() === 'p') document.querySelector('[data-choice="paper"]').click();
  if(e.key.toLowerCase() === 's') document.querySelector('[data-choice="scissors"]').click();
});

// load persisted score if available
try{
  const saved = JSON.parse(localStorage.getItem('rps-score'));
  if(saved){ playerScore = saved.player||0; computerScore = saved.computer||0; updateScores(); }
}catch(e){}

// persist every few seconds
setInterval(()=>{
  try{ localStorage.setItem('rps-score', JSON.stringify({player:playerScore, computer:computerScore})); }catch(e){}
}, 2000);

// small accessibility focus
choiceButtons[0].setAttribute('tabindex','0');

// Simple confetti burst (lightweight)
// Use canvas-confetti (if loaded) for smoother effects
function launchConfetti(){
  try{
    if(typeof confetti === 'function'){
      confetti({particleCount: 80, spread: 70, origin: { y: 0.4 }});
    } else {
      // fallback lightweight
      for(let i=0;i<16;i++){
        const el = document.createElement('div');
        el.style.position='fixed';
        el.style.left=(50+Math.random()*60-30)+'%';
        el.style.top=(40+Math.random()*20-10)+'%';
        el.style.pointerEvents='none';
        el.style.width='8px'; el.style.height='12px';
        el.style.background=['#7dd3fc','#60a5fa','#f472b6','#34d399'][Math.floor(Math.random()*4)];
        el.style.opacity='0.95'; el.style.borderRadius='2px';
        el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
        el.style.transition = `transform 900ms cubic-bezier(.2,.9,.3,1), opacity 900ms`;
        document.body.appendChild(el);
        requestAnimationFrame(()=>{
          el.style.transform = `translateY(${200+Math.random()*140}px) rotate(${Math.random()*720-360}deg)`;
          el.style.opacity='0';
        });
        setTimeout(()=>el.remove(), 1000);
      }
    }
  }catch(e){console.warn('confetti failed',e)}
}
