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

const startScreen =
  document.getElementById("startScreen");

const startBtn =
  document.getElementById("startBtn");

const roundText =
  document.getElementById("roundText");

const endScreen =
  document.getElementById("endScreen");

const endWinner =
  document.getElementById("endWinner");

const retryBtn =
  document.getElementById("retryBtn");


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
// GAME
// ==========================
let gameStarted = false;


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
// PLAYER FACTORY
// ==========================
function createPlayer(x){

  return {

    x:x,
    y:650,

    velocityY:0,

    hp:150,

    jumping:false,

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
// GAME OVER
// ==========================
function gameOver(loser){

  if(roundOver) return;

  roundOver = true;

  gameOverSound.currentTime = 0.35;
  gameOverSound.play();

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

  setTimeout(()=>{

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

    nextRound();

  },2000);

}


// ==========================
// NEXT ROUND
// ==========================
function nextRound(){

  roundOver = false;

  winnerText.classList.add("hidden");

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

  projectiles.forEach(ball=>{

    if(ball.element){

      ball.element.remove();

    }

  });

  projectiles = [];

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

  if(player.dead){

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

  if(!keys[controls.jump]){

    player.jumpPressed = false;

  }

  if(player.jumping){

    player.y += player.velocityY;

    player.velocityY += gravity;

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

  const minX = 0;
  const maxX = window.innerWidth - 220;

  player1.x =
    Math.max(minX,
    Math.min(player1.x, maxX));

  player2.x =
    Math.max(minX,
    Math.min(player2.x, maxX));

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

  const maxHP = 150;

  const p1Percent =
    (player1.hp / maxHP) * 100;

  const p2Percent =
    (player2.hp / maxHP) * 100;

  p1HPBar.style.width =
    p1Percent + "%";

  p2HPBar.style.width =
    p2Percent + "%";

}


// ==========================
// LOOP
// ==========================
function loop(){

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