// ==========================
// ELEMENTS
// ==========================
const game = document.getElementById("game");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");

const p1HPBar =
  document.getElementById("p1HP");

const p2HPBar =
  document.getElementById("p2HP");

const winnerText =
  document.getElementById("winnerText");

const p1Indicator =
  document.getElementById("p1Indicator");

const p2Indicator =
  document.getElementById("p2Indicator");

const roundText =
  document.getElementById("roundText");

const comboText =
  document.getElementById("comboText");


// ==========================
// PAUSE MENU
// ==========================
const pauseScreen =
  document.getElementById(
    "pauseScreen"
  );

const resumeBtn =
  document.getElementById(
    "resumeBtn"
  );

const restartBtn =
  document.getElementById(
    "restartBtn"
  );

const returnMenuBtn =
  document.getElementById(
    "returnMenuBtn"
  );


// ==========================
// SOUNDS
// ==========================
const punchSound =
  new Audio("sounds/punch.mp3");

const kickSound =
  new Audio("sounds/kick.mp3");

const blockSound =
  new Audio("sounds/block.mp3");

const jumpSound =
  new Audio("sounds/jump.mp3");

const gameOverSound =
  new Audio("sounds/gameover.mp3");

const spSound =
  new Audio("sounds/sp.mp3");


// ==========================
// SETTINGS
// ==========================
const gravity = 0.8;

const ground = 650;

// ==========================
// PLATFORMS
// ==========================
const platforms = [

  {
    x: 350,
    y: 620,
    width: 220,
    height: 20
  },

  {
    x: 780,
    y: 580,
    width: 260,
    height: 20
  },

  {
    x: 1210,
    y: 620,
    width: 220,
    height: 20
  }

];

const frameSpeed = 8;


// ==========================
// GAME
// ==========================
let gameStarted = false;


// ==========================
// INPUT
// ==========================
let keys = {};

window.addEventListener(
  "keydown",
  (e)=>{

    keys[e.key.toLowerCase()] = true;

  }
);

window.addEventListener(
  "keyup",
  (e)=>{

    keys[e.key.toLowerCase()] = false;

    let key =
      e.key.toLowerCase();

    if(key === "r"){

      player1.blocking = false;

      if(!player1.dead){

        setAnimation(
          player1,
          "idle"
        );

      }

    }

    if(key === "/"){

      player2.blocking = false;

      if(!player2.dead){

        setAnimation(
          player2,
          "idle"
        );

      }

    }

  }
);


// ==========================
// PLAYER FACTORY
// ==========================
function createPlayer(x){

  return {

    x:x,
    y:650,

    velocityY:0,

    velocityX:0,

    hp:150,
    maxHP:150,

    fighter:null,

    speed:5,

    jumping:false,

    jumpCount:0,

    attacking:false,
    hurt:false,
    blocking:false,
    dead:false,

    facingLeft:false,

    currentAnimation:"idle",

    frame:0,
    frameTimer:0,

    dashCooldown:0,

    landingRecovery:0,

    airMomentum:0

  };

}


// ==========================
// PLAYERS
// ==========================
const player1 =
  createPlayer(450);

const player2 =
  createPlayer(1050);

player2.facingLeft = true;


// ==========================
// ROUND SYSTEM
// ==========================
let p1Rounds = 0;
let p2Rounds = 0;

let roundOver = false;

let p1Combo = 0;
let p2Combo = 0;

let comboTimer = null;

let roundStarting = false;

let paused = false;

let matchFinished = false;


// ==========================
// SET ANIMATION
// ==========================
function setAnimation(
  data,
  animation
){

  if(
    data.currentAnimation !==
    animation
  ){

    data.currentAnimation =
      animation;

    data.frame = 0;

    data.frameTimer = 0;

  }

}


// ==========================
// COMBO SYSTEM
// ==========================
function addCombo(player){

  if(!comboText) return;

  if(player === player1){

    p1Combo++;
    p2Combo = 0;

    if(p1Combo >= 2){

      comboText.innerHTML =
        `${p1Combo} HIT COMBO`;

      comboText.classList.remove(
        "hidden"
      );

    }

  }else{

    p2Combo++;
    p1Combo = 0;

    if(p2Combo >= 2){

      comboText.innerHTML =
        `${p2Combo} HIT COMBO`;

      comboText.classList.remove(
        "hidden"
      );

    }

  }

  clearTimeout(comboTimer);

  comboTimer = setTimeout(()=>{

    p1Combo = 0;
    p2Combo = 0;

    comboText.classList.add(
      "hidden"
    );

  },1500);

}


// ==========================
// ROUND INTRO
// ==========================
async function startRoundIntro(){

  if(!gameStarted){
    return;
  }

  roundStarting = true;

  const currentRound =
    p1Rounds +
    p2Rounds +
    1;

  roundText.innerHTML =
    `ROUND ${currentRound}`;

  await new Promise(
    r=>setTimeout(r,1000)
  );

  if(!gameStarted){
    roundStarting = false;
    return;
  }

  roundText.innerHTML =
    "READY";

  await new Promise(
    r=>setTimeout(r,1000)
  );

  if(!gameStarted){
    roundStarting = false;
    return;
  }

  roundText.innerHTML =
    "FIGHT!";

  await new Promise(
    r=>setTimeout(r,800)
  );

  if(!gameStarted){
    roundStarting = false;
    return;
  }

  roundText.innerHTML = "";

  roundStarting = false;

}

// ==========================
// PAUSE SYSTEM
// ==========================
function togglePause(){

  if(
    !gameStarted ||
    roundOver ||
    matchFinished
  ){
    return;
  }

  paused = !paused;

  if(paused){

    freezeGame();

  }

  if(paused){

    pauseScreen.classList.add(
      "activeScreen"
    );

  }else{

    pauseScreen.classList.remove(
      "activeScreen"
    );

  }

}


function restartMatch(){

  paused = false;

  matchFinished = false;

  pauseScreen.classList.remove(
    "activeScreen"
  );

  winnerText.classList.add(
    "hidden"
  );

  p1Rounds = 0;
  p2Rounds = 0;

  nextRound();

}


function returnToMenu(){

  paused = false;

  matchFinished = false;

  gameStarted = false;

  freezeGame();

  roundStarting = false;

  pauseScreen.classList.remove(
    "activeScreen"
  );

  winnerText.classList.add(
    "hidden"
  );

  roundText.innerHTML = "";

  p1Rounds = 0;
  p2Rounds = 0;

  p1Combo = 0;
  p2Combo = 0;

  if(comboText){

    comboText.classList.add(
      "hidden"
    );

  }

  projectiles.forEach(
    ball=>{

      if(ball.element){

        ball.element.remove();

      }

    }
  );

  projectiles = [];

  roundStarting = false;

  roundText.innerHTML = "";

if(
  typeof resetSelections ===
  "function"
){

  resetSelections();

}

if(
  typeof gameState !==
  "undefined"
){

  gameState = "MENU";

}

if(
  typeof categorySelect !==
  "undefined"
){

  categorySelect.classList.remove(
    "activeScreen"
  );

}

if(
  typeof characterSelect !==
  "undefined"
){

  characterSelect.classList.remove(
    "activeScreen"
  );

}

if(
  typeof vsScreen !==
  "undefined"
){

  vsScreen.classList.remove(
    "activeScreen"
  );

}

if(
  typeof resultScreen !==
  "undefined"
){

  resultScreen.classList.remove(
    "activeScreen"
  );

}

if(
  typeof mainMenu !==
  "undefined"
){

  mainMenu.classList.add(
    "activeScreen"
  );

}

}

// ==========================
// PAUSE BUTTON EVENTS
// ==========================
if(resumeBtn){

  resumeBtn.onclick = ()=>{

    togglePause();

  };

}

if(restartBtn){

  restartBtn.onclick = ()=>{

    restartMatch();

  };

}

if(returnMenuBtn){

  returnMenuBtn.onclick = ()=>{

    returnToMenu();

  };

}


// ==========================
// DASH
// ==========================
function dash(player,direction){

  if(player.dashCooldown > 0)
  return;

  if(
    player.attacking ||
    player.hurt ||
    player.blocking ||
    player.dead
  ) return;

  player.dashCooldown =
  player.fighter?.id ===
  "thunderRonin"
    ? 22
    : 30;

  player.x += direction * 160;

}

// ==========================
// DOUBLE TAP DASH
// ==========================
let lastA = 0;
let lastD = 0;

let lastLeft = 0;
let lastRight = 0;

window.addEventListener(
  "keydown",
  (e)=>{

    if(e.repeat) return;

    let key =
      e.key.toLowerCase();

    let now = Date.now();

    // PLAYER 1
    if(key === "a"){

      if(now - lastA < 250){

        dash(player1,-1);

      }

      lastA = now;

    }

    if(key === "d"){

      if(now - lastD < 250){

        dash(player1,1);

      }

      lastD = now;

    }

    // PLAYER 2
    if(key === "arrowleft"){

      if(now - lastLeft < 250){

        dash(player2,-1);

      }

      lastLeft = now;

    }

    if(key === "arrowright"){

      if(now - lastRight < 250){

        dash(player2,1);

      }

      lastRight = now;

    }

  }
);


// ==========================
// GAME OVER
// ==========================
function gameOver(loser){

  if(
    roundOver ||
    matchFinished
  ) return;

  roundOver = true;

  gameOverSound.currentTime =
    0.35;

  gameOverSound.play();

  if(loser === player1){

    p2Rounds++;

    winnerText.innerHTML =
      "PLAYER 2 WINS ROUND";

  }

  else{

    p1Rounds++;

    winnerText.innerHTML =
      "PLAYER 1 WINS ROUND";

  }

  winnerText.classList.remove(
    "hidden"
  );

  // ==========================
  // MATCH WIN
  // ==========================
  if(p1Rounds >= 2){

    matchFinished = true;

    winnerText.innerHTML =
      "PLAYER 1 WINS MATCH";

    setTimeout(()=>{

      gameStarted = false;

      resultScreen.classList.add(
        "activeScreen"
      );

      endWinner.innerHTML =
        "PLAYER 1<br>WINS";

    },2500);

    return;

  }

  if(p2Rounds >= 2){

    matchFinished = true;

    winnerText.innerHTML =
      "PLAYER 2 WINS MATCH";

    setTimeout(()=>{

      gameStarted = false;

      resultScreen.classList.add(
        "activeScreen"
      );

      endWinner.innerHTML =
        "PLAYER 2<br>WINS";

    },2500);

    return;

  }

  // ==========================
  // NEXT ROUND
  // ==========================
  setTimeout(()=>{

    nextRound();

  },2500);

}


// ==========================
// NEXT ROUND
// ==========================
function nextRound(){

  roundOver = false;

  paused = false;

  winnerText.classList.add(
    "hidden"
  );

  if(comboText){

    comboText.classList.add(
      "hidden"
    );

  }

  clearTimeout(
    comboTimer
  );

  p1Combo = 0;
  p2Combo = 0;

  player1.x = 450;
  player1.y = ground;

  player2.x = 1050;
  player2.y = ground;

  player1.velocityX = 0;
  player2.velocityX = 0;

  player1.velocityY = 0;
  player2.velocityY = 0;

  player1.hp =
    player1.maxHP;

  player2.hp =
    player2.maxHP;

  player1.dead = false;
  player2.dead = false;

  player1.hurt = false;
  player2.hurt = false;

  player1.attacking = false;
  player2.attacking = false;

  player1.blocking = false;
  player2.blocking = false;

  player1.jumping = false;
  player2.jumping = false;

  player1.jumpCount = 0;
  player2.jumpCount = 0;

  player1.airMomentum = 0;
  player2.airMomentum = 0;

  player1.landingRecovery = 0;
  player2.landingRecovery = 0;

  setAnimation(
    player1,
    "idle"
  );

  setAnimation(
    player2,
    "idle"
  );

  projectiles.forEach(
    ball=>{

      if(ball.element){

        ball.element.remove();

      }

    }
  );

  projectiles = [];

  freezeGame();

  startRoundIntro();

}


// ==========================
// KEY INPUTS
// ==========================
window.addEventListener(
  "keydown",
  (e)=>{

    if(roundStarting)
      return;

    let key =
      e.key.toLowerCase();

    if(key === "escape"){

      togglePause();

      return;

    }

    if(paused){

      return;

    }

    if(key === "r"){

      player1.blocking = true;

      setAnimation(
        player1,
        "block"
      );

    }

    if(key === "/"){

      player2.blocking = true;

      setAnimation(
        player2,
        "block"
      );

    }

    if(key === "f"){

      attack(
        player1,
        player2,
        "punch"
      );

    }

    if(key === "g"){

      if(player1.jumping){

        attack(
          player1,
          player2,
          "jumpkick"
        );

      }else{

        attack(
          player1,
          player2,
          "kick"
        );

      }

    }

    if(key === ","){

      attack(
        player2,
        player1,
        "punch"
      );

    }

    if(key === "."){

      if(player2.jumping){

        attack(
          player2,
          player1,
          "jumpkick"
        );

      }else{

        attack(
          player2,
          player1,
          "kick"
        );

      }

    }

    if(key === "t"){

      specialMove(player1);

    }

    if(key === "p"){

      specialMove(player2);

    }

  }
);

// ==========================
// PLATFORM COLLISION
// ==========================
function checkPlatforms(player){

  if(!player.jumping)
    return;

  const playerBottom =
    player.y + 220;

  const previousBottom =
    playerBottom -
    player.velocityY;

  for(
    const platform
    of platforms
  ){

    const feetLeft =
      player.x + 100;

    const feetRight =
      player.x + 120;

    const withinX =

      feetRight >
      platform.x &&

      feetLeft <
      platform.x +
      platform.width;

    const crossingTop =

      previousBottom <=
      platform.y &&

      playerBottom >=
      platform.y;

    if(
      withinX &&
      crossingTop &&
      player.velocityY > 0
    ){

      player.y =
        platform.y - 220;

      player.velocityY = 0;

      player.jumping = false;

      player.jumpCount = 0;

      player.airMomentum = 0;

      return;

    }

  }

}
// ==========================
// UPDATE PLAYER
// ==========================
function updatePlayer(
  player,
  controls
){

  if(
    paused ||
    roundStarting ||
    matchFinished
  ){
    return;
  }

  let moving = false;

  // ==========================
  // KNOCKBACK PHYSICS
  // ==========================
  player.x += player.velocityX;

  player.velocityX *= 0.82;

  if(
    Math.abs(
      player.velocityX
    ) < 0.2
  ){

    player.velocityX = 0;

  }

  if(
    player.dashCooldown > 0
  ){

    player.dashCooldown--;

  }

  if(
    player.landingRecovery > 0
  ){

    player.landingRecovery--;

  }

  if(player.dead){

    return;

  }

  if(
    !player.attacking &&
    !player.hurt &&
    !player.blocking &&
    player.landingRecovery <= 0
  ){

    if(
      keys[
        controls.left
      ]
    ){

      player.x -=
        player.speed;

      if(player.jumping){

        player.airMomentum =
          -player.speed;

      }

      moving = true;

      player.facingLeft =
        true;

    }

    if(
      keys[
        controls.right
      ]
    ){

      player.x +=
        player.speed;

      if(player.jumping){

        player.airMomentum =
          player.speed;

      }

      moving = true;

      player.facingLeft =
        false;

    }

  }

  // ==========================
  // JUMP
  // ==========================
  if(
    keys[
      controls.jump
    ] &&
    player.jumpCount < 2 &&
    !player.blocking &&
    !player.jumpPressed
  ){

    player.jumpPressed =
      true;

    player.jumping =
      true;

    player.jumpCount++;

    player.airMomentum = 0;

    player.velocityY =
      -15;

    jumpSound.currentTime =
      0;

    jumpSound.play();

    setAnimation(
      player,
      "jump"
    );

  }

  if(
    !keys[
      controls.jump
    ]
  ){

    player.jumpPressed =
      false;

  }

  // ==========================
  // PLATFORM EDGE CHECK
  // ==========================
  if(!player.jumping){

    let standingOnPlatform = false;

    for(const platform of platforms){

      const feetLeft =
        player.x + 100;

      const feetRight =
        player.x + 120;

      const withinX =

        feetRight >
        platform.x &&

        feetLeft <
        platform.x +
        platform.width;
      const onTop =

        Math.abs(
          (player.y + 220) -
          platform.y
        ) < 5;

      if(
        withinX &&
        onTop
      ){

        standingOnPlatform = true;

        break;

      }

    }

    if(
      !standingOnPlatform &&
      player.y < ground
    ){

      player.jumping = true;

    }

  }
  // ==========================
  // AIR PHYSICS
  // ==========================
  if(player.jumping){

    player.x +=
      player.airMomentum;

    player.airMomentum *=
      0.96;

    player.y +=
      player.velocityY;

    player.velocityY +=
      gravity;
    
    checkPlatforms(
      player
    );

    if(
      !player.attacking
    ){

      if(
        player.velocityY < -5
      ){

        player.frame = 0;

      }

      else if(
        player.velocityY < 5
      ){

        player.frame = 1;

      }

      else{

        player.frame = 2;

      }

    }

    if(
      player.y >= ground
    ){

      const landingSpeed =
        player.velocityY;

      player.y = ground;

      player.jumping = false;

      player.velocityY = 0;

      player.jumpCount = 0;

      if(
        Math.abs(
          landingSpeed
        ) > 10
      ){

        player.landingRecovery =
          12;

      }
      if(
        !player.attacking &&
        !player.blocking
      ){

        setAnimation(
          player,
          "idle"
        );

      }

    }

  }

  // ==========================
  // WALK / IDLE
  // ==========================
  if(
    !player.jumping &&
    !player.attacking &&
    !player.hurt &&
    !player.blocking
  ){

    if(moving){

      setAnimation(
        player,
        "walk"
      );

    }

    else{

      setAnimation(
        player,
        "idle"
      );

    }

  }

}


// ==========================
// ANIMATE
// ==========================
function animate(
  element,
  player
){

  element.style.width =
    "220px";

  element.style.height =
    "220px";

  element.style.position =
    "absolute";

  element.style.backgroundSize =
    "contain";

  element.style.backgroundRepeat =
    "no-repeat";

  element.style.backgroundPosition =
    "center";

  element.style.imageRendering =
    "pixelated";

  // ==========================
  // DEFAULT STICKMAN
  // ==========================
  if(
    player.fighter &&
    player.fighter.id ===
    "defaultStickman"
  ){

    let currentFrameSpeed =
      frameSpeed;

    if(
      player.currentAnimation ===
      "dead"
    ){

      currentFrameSpeed =
        20;

    }

    if(
      player.currentAnimation !==
      "jump"
    ){

      player.frameTimer++;

      if(
        player.frameTimer >=
        currentFrameSpeed
      ){

        player.frame++;

        player.frameTimer =
          0;

        if(
          player.currentAnimation ===
          "dead"
        ){

          if(
            player.frame >=
            sprites.dead.length
          ){

            player.frame =
              sprites.dead.length - 1;

          }

        }

        else if(
          player.currentAnimation ===
          "sp"
        ){

          if(
            player.frame >=
            sprites.sp.length
          ){

            player.frame =
              sprites.sp.length - 1;

          }

        }

        else{

          if(
            player.frame >=
            sprites[
              player.currentAnimation
            ].length
          ){

            player.frame = 0;

          }

        }

      }

    }

    element.style.backgroundImage =
      `url(${
        sprites[
          player.currentAnimation
        ][player.frame]
      })`;

    element.style.backgroundColor =
      "transparent";

    element.innerHTML = "";

    return;

  }

  // ==========================
  // PLACEHOLDER FIGHTERS
  // ==========================
  element.style.backgroundImage =
    "none";

  element.style.background =
    player.hurt
    ? "white"
    : player.fighter?.color ||
      "white";

  element.style.display =
    "flex";

  element.style.alignItems =
    "center";

  element.style.justifyContent =
    "center";

  element.style.borderRadius =
    "14px";

  element.style.fontWeight =
    "bold";

  element.style.fontSize =
    "18px";

  element.style.color =
    "black";

  element.innerHTML =
    player.currentAnimation
      .toUpperCase();

}

// ==========================
// POSITIONS
// ==========================
function applyPositions(){

  const minX = 0;

  const maxX =
    window.innerWidth - 220;

  player1.x =
    Math.max(
      minX,
      Math.min(
        player1.x,
        maxX
      )
    );

  player2.x =
    Math.max(
      minX,
      Math.min(
        player2.x,
        maxX
      )
    );

  // ==========================
  // SCREEN SHAKE
  // ==========================
  if(
    shakeDuration > 0
  ){

    shakeDuration -= 16;

    const offsetX =
      (Math.random() - 0.5)
      * shakeStrength;

    const offsetY =
      (Math.random() - 0.5)
      * shakeStrength;

    game.style.transform =
      `translate(${offsetX}px, ${offsetY}px)`;

  }

  else{

    game.style.transform =
      "translate(0px,0px)";

  }

  p1.style.left =
    player1.x + "px";

  p1.style.top =
    player1.y + "px";

  p2.style.left =
    player2.x + "px";

  p2.style.top =
    player2.y + "px";

  p1.style.transform =
    player1.facingLeft
      ? "scaleX(-1)"
      : "scaleX(1)";

  p2.style.transform =
    player2.facingLeft
      ? "scaleX(-1)"
      : "scaleX(1)";

  p1Indicator.style.left =
    (
      player1.x + 65
    ) + "px";

  p1Indicator.style.top =
    (
      player1.y - 80
    ) + "px";

  p2Indicator.style.left =
    (
      player2.x + 65
    ) + "px";

  p2Indicator.style.top =
    (
      player2.y - 80
    ) + "px";

}


// ==========================
// HP
// ==========================
function updateHP(){

  const p1Percent =
    (
      player1.hp /
      player1.maxHP
    ) * 100;

  const p2Percent =
    (
      player2.hp /
      player2.maxHP
    ) * 100;

  p1HPBar.style.width =
    p1Percent + "%";

  p2HPBar.style.width =
    p2Percent + "%";

}
// ==========================
// FREEZE GAME
// ==========================
function freezeGame(){

  player1.velocityX = 0;
  player2.velocityX = 0;

  player1.velocityY = 0;
  player2.velocityY = 0;

}



// ==========================
// LOOP
// ==========================
function loop(){

  if(hitPaused){

    requestAnimationFrame(
      loop
    );

    return;

  }

  if(paused){

    requestAnimationFrame(
      loop
    );

    return;

  }

  if(
  gameStarted &&
  !matchFinished
  ){

    updatePlayer(
      player1,
      {
        left:"a",
        right:"d",
        jump:"w"
      }
    );

    updatePlayer(
      player2,
      {
        left:"arrowleft",
        right:"arrowright",
        jump:"arrowup"
      }
    );

    if(
      !roundStarting &&
      !paused
    ){

      updateProjectiles();

    }

    animate(
      p1,
      player1
    );

    animate(
      p2,
      player2
    );

    applyPositions();

    updateHP();

  }

  requestAnimationFrame(
    loop
  );

}
// ==========================
// SAFETY RESET
// ==========================
window.addEventListener(
  "blur",
  ()=>{

    keys = {};

  }
);
loop();