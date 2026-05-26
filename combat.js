// ==========================
// PROJECTILES
// ==========================
let projectiles = [];


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
function hurt(player, attacker){

  if(player.hurt ||
     player.dead) return;

  player.hurt = true;

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

  if(player.hp <= 0){

    player.dead = true;

    setAnimation(player,"dead");

    gameOver(player);

    return;

  }

  if(!player.blocking){

    setAnimation(player,"hurt");

  }

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

  if(player.blocking){

    knockback *= 0.35;

  }

  if(attacker.facingLeft){

    player.x -= knockback;

  }else{

    player.x += knockback;

  }

  setTimeout(()=>{

    player.hurt = false;

    if(!player.dead &&
       !player.blocking){

      setAnimation(player,"idle");

    }

  },300);

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

    const jitterX =
      Math.random()*6 - 3;

    const jitterY =
      Math.random()*6 - 3;

    ball.element.style.left =
      (ball.x + jitterX) + "px";

    ball.element.style.top =
      (ball.y + jitterY) + "px";

    if(ball.speed < 0){

      ball.element.style.transform =
        "scaleX(-1)";

    }else{

      ball.element.style.transform =
        "scaleX(1)";

    }

    let target =
      ball.owner === player1
      ? player2
      : player1;

    const xDistance =
      Math.abs(ball.x - target.x);

    const yDistance =
      Math.abs(ball.y - target.y);

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

    if(ball.x < -300 ||
       ball.x > window.innerWidth + 300){

      if(ball.element){

        ball.element.remove();

      }

      projectiles.splice(index,1);

    }

  });

}