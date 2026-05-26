// ==========================
// ELEMENTS
// ==========================
const game = document.getElementById("game");

const p1 = document.getElementById("player1");
const p2 = document.getElementById("player2");

const p1HPBar = document.getElementById("p1HP");
const p2HPBar = document.getElementById("p2HP");

const winnerText =
  document.getElementById("winnerText");

const controlsMenu =
  document.getElementById("controlsMenu");

const menuBtn =
  document.getElementById("menuBtn");

const p1Indicator =
  document.getElementById("p1Indicator");

const p2Indicator =
  document.getElementById("p2Indicator");


// ==========================
// MENU TOGGLE
// ==========================
let menuVisible = true;

menuBtn.addEventListener("click",()=>{

  menuVisible = !menuVisible;

  if(menuVisible){

    controlsMenu.style.display = "block";

    menuBtn.innerHTML =
      "Hide Controls";

  }else{

    controlsMenu.style.display = "none";

    menuBtn.innerHTML =
      "Show Controls";

  }

});

// ==========================
// START SCREEN
// ==========================
const startScreen =
  document.getElementById("startScreen");

const startBtn =
  document.getElementById("startBtn");

const roundText =
  document.getElementById("roundText");

// GAME STARTS DISABLED
let gameStarted = false;

// START BUTTON
startBtn.addEventListener("click",()=>{

  // HIDE MENU
  startScreen.style.display = "none";

  // START GAME
  gameStarted = true;

});

// ==========================
// END SCREEN
// ==========================
const endScreen =
  document.getElementById("endScreen");

const endWinner =
  document.getElementById("endWinner");

const retryBtn =
  document.getElementById("retryBtn");


// ==========================
// RETRY BUTTON
// ==========================
retryBtn.addEventListener("click",()=>{

  // HIDE END SCREEN
  endScreen.style.display = "none";

  // RESET SCORES
  p1Rounds = 0;
  p2Rounds = 0;

  // RESET ROUND
  roundOver = false;

  // RESET TEXT
  winnerText.classList.add("hidden");

  roundText.innerHTML =
    "ROUND 1";

  // RESET PLAYERS
  player1.x = 450;
  player1.y = ground;

  player2.x = 1050;
  player2.y = ground;

  player1.hp = 150;
  player2.hp = 150;

  player1.dead = false;
  player2.dead = false;

  player1.hurt = false;
  player2.hurt = false;

  player1.attacking = false;
  player2.attacking = false;

  player1.blocking = false;
  player2.blocking = false;

  player1.jumpCount = 0;
  player2.jumpCount = 0;

  player1.velocityY = 0;
  player2.velocityY = 0;

  player1.jumping = false;
  player2.jumping = false;

  setAnimation(player1,"idle");
  setAnimation(player2,"idle");

  // CLEAR PROJECTILES
  projectiles.forEach(ball=>{

    if(ball.element){

      ball.element.remove();

    }

  });

  projectiles = [];

  // START GAME AGAIN
  gameStarted = true;

});


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
const speed = 5;
const frameSpeed = 8;


// ==========================
// INPUT
// ==========================
let keys = {};

window.addEventListener("keydown",(e)=>{
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup",(e)=>{

  keys[e.key.toLowerCase()] = false;

  let key = e.key.toLowerCase();

  if(key === "r"){

    player1.blocking = false;

    if(!player1.dead){

      setAnimation(player1,"idle");

    }

  }

  if(key === "/"){

    player2.blocking = false;

    if(!player2.dead){

      setAnimation(player2,"idle");

    }

  }

});


// ==========================
// SPRITES
// ==========================
const sprites = {

  idle:[
    "assets/idle1.png",
    "assets/idle2.png",
    "assets/idle3.png",
    "assets/idle4.png",
    "assets/idle5.png"
  ],

  walk:[
    "assets/walk1.png",
    "assets/walk2.png",
    "assets/walk3.png",
    "assets/walk4.png",
    "assets/walk5.png"
  ],

  punch:[
    "assets/punch1.png",
    "assets/punch2.png",
    "assets/punch3.png"
  ],

  kick:[
    "assets/kick1.png",
    "assets/kick2.png",
    "assets/kick3.png"
  ],

  jump:[
    "assets/jump1.png",
    "assets/jump2.png",
    "assets/jump3.png"
  ],

  jumpkick:[
    "assets/airkick1.png"
  ],

  hurt:[
    "assets/hurt1.png",
    "assets/hurt2.png"
  ],

  block:[
    "assets/block1.png"
  ],

  dead:[
    "assets/ded1.png",
    "assets/ded2.png",
    "assets/ded3.png",
    "assets/ded4.png"
  ],

  sp:[
    "assets/sp1.png",
    "assets/sp2.png"
  ]

};


// ==========================
// PLAYER FACTORY
// ==========================
// ==========================
// PLAYER FACTORY
// ==========================
function createPlayer(x){

  return {

    x:x,
    y:650,

    velocityY:0,

    // MORE HP
    hp:150,

    jumping:false,

    // DOUBLE JUMP
    jumpCount:0,

    attacking:false,
    hurt:false,
    blocking:false,
    dead:false,

    facingLeft:false,

    currentAnimation:"idle",

    frame:0,
    frameTimer:0

  };

}


// ==========================
// PLAYERS
// ==========================
const player1 = createPlayer(450);

const player2 = createPlayer(1050);

player2.facingLeft = true;


// ==========================
// PROJECTILES
// ==========================
let projectiles = [];
// ==========================
// ROUND SYSTEM
// ==========================
let p1Rounds = 0;
let p2Rounds = 0;

let roundOver = false;



// ==========================
// SET ANIMATION
// ==========================
function setAnimation(data, animation){

  if(data.currentAnimation !== animation){

    data.currentAnimation = animation;

    data.frame = 0;

    data.frameTimer = 0;

  }

}


// ==========================
// SCREEN SHAKE
// ==========================
function screenShake(power = 8){

  game.style.transform =
    `translate(
      ${Math.random()*power-power/2}px,
      ${Math.random()*power-power/2}px
    )`;

  setTimeout(()=>{

    game.style.transform =
      "translate(0px,0px)";

  },50);

}


// ==========================
// SPECIAL MOVE
// ==========================
function specialMove(player){

  if(player.attacking ||
     player.hurt ||
     player.blocking ||
     player.dead) return;

  player.attacking = true;

  setAnimation(player,"sp");

  spSound.currentTime = 0;
  spSound.play();

  setTimeout(()=>{

    projectiles.push({

      x: player.facingLeft
        ? player.x - 40
        : player.x + 140,

      y: player.y - 10,

      speed: player.facingLeft
        ? -14
        : 14,

      owner: player

    });

  },150);

  setTimeout(()=>{

    player.attacking = false;

    if(!player.dead){

      setAnimation(player,"idle");

    }

  },500);

}


// ==========================
// ATTACK
// ==========================
function attack(attacker, victim, type){

  if(attacker.attacking ||
     attacker.hurt ||
     attacker.blocking ||
     attacker.dead) return;

  attacker.attacking = true;

  setAnimation(attacker, type);

  if(type === "punch"){

    punchSound.currentTime = 0;
    punchSound.play();

  }

  if(type === "kick" ||
     type === "jumpkick"){

    kickSound.currentTime = 0;
    kickSound.play();

  }

  let range = 120;

  if(type === "kick"){
    range = 150;
  }

  if(type === "jumpkick"){
    range = 180;
  }

  let xDistance =
    Math.abs(attacker.x - victim.x);

  let yDistance =
    Math.abs(attacker.y - victim.y);

  let victimInFront = false;

  if(attacker.facingLeft &&
     victim.x < attacker.x){

    victimInFront = true;

  }

  if(!attacker.facingLeft &&
      victim.x > attacker.x){

    victimInFront = true;

  }

  if(
    xDistance < range &&
    yDistance < 140 &&
    victimInFront
  ){

    hurt(victim, attacker);

  }

  setTimeout(()=>{

    attacker.attacking = false;

    if(!attacker.dead &&
       !attacker.blocking){

      setAnimation(attacker,"idle");

    }

  },300);

}


// ==========================
// HURT
// ==========================
// ==========================
// HURT
// ==========================
function hurt(player, attacker){

  if(player.hurt ||
     player.dead) return;

  player.hurt = true;

  // BALANCED DAMAGE
  let damage = 8;

  if(attacker.currentAnimation === "kick"){
    damage = 12;
  }

  if(attacker.currentAnimation === "jumpkick"){
    damage = 14;
  }

  if(attacker.currentAnimation === "sp"){
    damage = 18;
  }

  // BLOCK CHIP DAMAGE
  if(player.blocking){

    damage = Math.floor(damage * 0.25);

    blockSound.currentTime = 0;
    blockSound.play();

  }

  player.hp -= damage;

  if(player.hp < 0){
    player.hp = 0;
  }

  if(!player.blocking){

    screenShake(10);

  }

  // DEATH
  if(player.hp <= 0){

    player.dead = true;

    setAnimation(player,"dead");

    gameOver(player);

    return;

  }

  // HURT ANIMATION
  if(!player.blocking){

    setAnimation(player,"hurt");

  }

  // KNOCKBACK
  let knockback = 40;

  if(attacker.currentAnimation === "kick"){
    knockback = 60;
  }

  if(attacker.currentAnimation === "jumpkick"){
    knockback = 90;
  }

  if(attacker.currentAnimation === "sp"){
    knockback = 120;
  }

  // BLOCK REDUCTION
  if(player.blocking){

    knockback *= 0.35;

  }

  // APPLY KNOCKBACK
  if(attacker.facingLeft){

    player.x -= knockback;

  }else{

    player.x += knockback;

  }

  // RECOVERY
  setTimeout(()=>{

    player.hurt = false;

    if(!player.dead &&
       !player.blocking){

      setAnimation(player,"idle");

    }

  },300);

}


// ==========================
// GAME OVER
// ==========================
function gameOver(loser){

  if(roundOver) return;

  roundOver = true;

  gameOverSound.currentTime = 0.35;
  gameOverSound.play();

  // ==========================
  // GIVE ROUND WIN
  // ==========================
  if(loser === player1){

    p2Rounds++;

    winnerText.innerHTML =
      "PLAYER 2 WINS ROUND";

  }else{

    p1Rounds++;

    winnerText.innerHTML =
      "PLAYER 1 WINS ROUND";

  }

  winnerText.classList.remove("hidden");

  // ==========================
  // CHECK MATCH WINNER
  // ==========================
  setTimeout(()=>{

    // BEST OF 3
    if(p1Rounds >= 2){

      endScreen.style.display = "flex";
      gameStarted = false;

      endWinner.innerHTML =
        "PLAYER 1<br>WINS";

      return;

    }

    if(p2Rounds >= 2){

      endScreen.style.display = "flex";
      gameStarted = false;

      endWinner.innerHTML =
        "PLAYER 2<br>WINS";

      return;

    }

    // ==========================
    // NEXT ROUND
    // ==========================
    nextRound();

  },2000);

}
// ==========================
// NEXT ROUND
// ==========================
// ==========================
// NEXT ROUND
// ==========================
function nextRound(){

  roundOver = false;

  winnerText.classList.add("hidden");

  // RESET PLAYERS
  player1.x = 450;
  player1.y = ground;

  player2.x = 1050;
  player2.y = ground;

  player1.hp = 150;
  player2.hp = 150;

  player1.dead = false;
  player2.dead = false;

  player1.hurt = false;
  player2.hurt = false;

  player1.attacking = false;
  player2.attacking = false;

  player1.blocking = false;
  player2.blocking = false;

  player1.jumpCount = 0;
  player2.jumpCount = 0;

  player1.velocityY = 0;
  player2.velocityY = 0;

  player1.jumping = false;
  player2.jumping = false;

  setAnimation(player1,"idle");
  setAnimation(player2,"idle");

  // CLEAR PROJECTILES
  projectiles.forEach(ball=>{

    if(ball.element){

      ball.element.remove();

    }

  });

  projectiles = [];

  // UPDATE ROUND TEXT
  const currentRound =
    p1Rounds + p2Rounds + 1;

  roundText.innerHTML =
    `ROUND ${currentRound}`;

}

// ==========================
// KEY INPUTS
// ==========================
window.addEventListener("keydown",(e)=>{

  let key = e.key.toLowerCase();

  if(key === "r"){

    player1.blocking = true;
    setAnimation(player1,"block");

  }

  if(key === "/"){

    player2.blocking = true;
    setAnimation(player2,"block");

  }

  if(key === "f"){

    attack(player1,player2,"punch");

  }

  if(key === "g"){

    if(player1.jumping){

      attack(player1,player2,"jumpkick");

    }else{

      attack(player1,player2,"kick");

    }

  }

  if(key === ","){

    attack(player2,player1,"punch");

  }

  if(key === "."){

    if(player2.jumping){

      attack(player2,player1,"jumpkick");

    }else{

      attack(player2,player1,"kick");

    }

  }

  if(key === "t"){

    specialMove(player1);

  }

  if(key === "p"){

    specialMove(player2);

  }

});


// ==========================
// UPDATE PLAYER
// ==========================
function updatePlayer(player, controls){

  let moving = false;

  // ==========================
  // DEAD PHYSICS
  // ==========================
  if(player.dead){

    // STILL FALL IF DEAD
    if(player.y < ground){

      player.y += player.velocityY;

      player.velocityY += gravity;

      if(player.y >= ground){

        player.y = ground;

        player.velocityY = 0;

      }

    }

    return;

  }

  // ==========================
  // MOVE
  // ==========================
  if(!player.attacking &&
     !player.hurt &&
     !player.blocking){

    if(keys[controls.left]){

      player.x -= speed;

      moving = true;

      player.facingLeft = true;

    }

    if(keys[controls.right]){

      player.x += speed;

      moving = true;

      player.facingLeft = false;

    }

  }

  // ==========================
  // DOUBLE JUMP
  // ==========================
  if(keys[controls.jump] &&
     player.jumpCount < 2 &&
     !player.blocking &&
     !player.jumpPressed){

    player.jumpPressed = true;

    player.jumping = true;

    player.jumpCount++;

    player.velocityY = -15;

    jumpSound.currentTime = 0;
    jumpSound.play();

    setAnimation(player,"jump");

  }

  // RESET PRESS
  if(!keys[controls.jump]){

    player.jumpPressed = false;

  }

  // ==========================
  // GRAVITY
  // ==========================
  if(player.jumping){

    player.y += player.velocityY;

    player.velocityY += gravity;

    // JUMP FRAMES
    if(!player.attacking){

      if(player.velocityY < -5){

        player.frame = 0;

      }
      else if(player.velocityY < 5){

        player.frame = 1;

      }
      else{

        player.frame = 2;

      }

    }

    // LAND
    if(player.y >= ground){

      player.y = ground;

      player.jumping = false;

      player.velocityY = 0;

      player.jumpCount = 0;

      if(!player.attacking &&
         !player.blocking){

        setAnimation(player,"idle");

      }

    }

  }

  // ==========================
  // WALK/IDLE
  // ==========================
  if(!player.jumping &&
     !player.attacking &&
     !player.hurt &&
     !player.blocking){

    if(moving){

      setAnimation(player,"walk");

    }else{

      setAnimation(player,"idle");

    }

  }

}


// ==========================
// PROJECTILES
// ==========================
function updateProjectiles(){

  projectiles.forEach((ball,index)=>{

    ball.x += ball.speed;

    if(!ball.element){

      const el =
        document.createElement("div");

      el.style.position = "absolute";

      el.style.width = "180px";
      el.style.height = "180px";

      el.style.backgroundImage =
        "url('assets/ball.png')";

      el.style.backgroundSize = "contain";

      el.style.backgroundRepeat = "no-repeat";

      el.style.pointerEvents = "none";

      el.style.filter =
        "drop-shadow(0 0 25px cyan)";

      game.appendChild(el);

      ball.element = el;

    }

    // LIGHTNING JITTER
    const jitterX =
      Math.random()*6 - 3;

    const jitterY =
      Math.random()*6 - 3;

    ball.element.style.left =
      (ball.x + jitterX) + "px";

    ball.element.style.top =
      (ball.y + jitterY) + "px";

    // FLIP
    if(ball.speed < 0){

      ball.element.style.transform =
        "scaleX(-1)";

    }else{

      ball.element.style.transform =
        "scaleX(1)";

    }

    // TARGET
    let target =
      ball.owner === player1
      ? player2
      : player1;

    // REAL HITBOX
    const xDistance =
      Math.abs(ball.x - target.x);

    const yDistance =
      Math.abs(ball.y - target.y);

    // HIT CHECK
    if(
      xDistance < 100 &&
      yDistance < 80 &&
      !target.dead
    ){

      hurt(target, ball.owner);

      screenShake(18);

      ball.element.remove();

      projectiles.splice(index,1);

    }

    // REMOVE OFFSCREEN
    if(ball.x < -300 ||
       ball.x > window.innerWidth + 300){

      if(ball.element){

        ball.element.remove();

      }

      projectiles.splice(index,1);

    }

  });

}


// ==========================
// ANIMATE
// ==========================
function animate(element, player){

  let currentFrameSpeed =
    frameSpeed;

  if(player.currentAnimation === "dead"){

    currentFrameSpeed = 20;

  }

  if(player.currentAnimation !== "jump"){

    player.frameTimer++;

    if(player.frameTimer >= currentFrameSpeed){

      player.frame++;

      player.frameTimer = 0;

      if(player.currentAnimation === "dead"){

        if(player.frame >=
           sprites.dead.length){

          player.frame =
            sprites.dead.length - 1;

        }

      }

      else if(player.currentAnimation === "sp"){

        if(player.frame >=
           sprites.sp.length){

          player.frame =
            sprites.sp.length - 1;

        }

      }

      else{

        if(player.frame >=
           sprites[player.currentAnimation].length){

          player.frame = 0;

        }

      }

    }

  }

  element.style.backgroundImage =
    `url(${sprites[player.currentAnimation][player.frame]})`;

}


// ==========================
// POSITIONS
// ==========================
function applyPositions(){

  // SCREEN LIMITS
  const minX = 0;
  const maxX = window.innerWidth - 220;

  // PREVENT OFFSCREEN
  player1.x =
    Math.max(minX,
    Math.min(player1.x, maxX));

  player2.x =
    Math.max(minX,
    Math.min(player2.x, maxX));

  // APPLY PLAYER POSITIONS
  p1.style.left =
    player1.x + "px";

  p1.style.top =
    player1.y + "px";

  p2.style.left =
    player2.x + "px";

  p2.style.top =
    player2.y + "px";

  // FLIP
  p1.style.transform =
    player1.facingLeft
    ? "scaleX(-1)"
    : "scaleX(1)";

  p2.style.transform =
    player2.facingLeft
    ? "scaleX(-1)"
    : "scaleX(1)";

  // ==========================
  // INDICATORS
  // ==========================
  p1Indicator.style.left =
    (player1.x + 65) + "px";

  p1Indicator.style.top =
    (player1.y - 80) + "px";

  p2Indicator.style.left =
    (player2.x + 65) + "px";

  p2Indicator.style.top =
    (player2.y - 80) + "px";

}


// ==========================
// HP
// ==========================
function updateHP(){

  // MAX HP
  const maxHP = 150;

  // CONVERT TO PERCENT
  const p1Percent =
    (player1.hp / maxHP) * 100;

  const p2Percent =
    (player2.hp / maxHP) * 100;

  // APPLY WIDTH
  p1HPBar.style.width =
    p1Percent + "%";

  p2HPBar.style.width =
    p2Percent + "%";

}


// ==========================
// LOOP
// ==========================
function loop(){

  // ONLY RUN GAME AFTER START
  if(gameStarted){

    updatePlayer(player1,{
      left:"a",
      right:"d",
      jump:"w"
    });

    updatePlayer(player2,{
      left:"arrowleft",
      right:"arrowright",
      jump:"arrowup"
    });

    updateProjectiles();

    animate(p1,player1);
    animate(p2,player2);

    applyPositions();

    updateHP();

  }

  requestAnimationFrame(loop);

}

loop();

