// ==========================
// PROJECTILES
// ==========================
let projectiles = [];

// ==========================
// PASSIVES
// ==========================
function applyPassiveHit(
  attacker,
  target,
  damageObj,
  knockbackObj
){

  // FLAME MONK
  if(
    attacker.fighter?.id ===
    "flameMonk"
  ){

    if(
  !target.burning
  ){

    target.burning = true;

    let burnTicks = 3;

    const burnInterval =
      setInterval(()=>{

        if(
          target.dead ||
          !target.burning
        ){

          clearInterval(
            burnInterval
          );

          return;

        }

        target.hp -= 2;

        burnTicks--;

        if(
          target.hp <= 0
        ){

          target.hp = 0;

          target.dead = true;

          setAnimation(
            target,
            "dead"
          );

          gameOver(
            target
          );

          clearInterval(
            burnInterval
          );

        }

        if(
          burnTicks <= 0
        ){

          target.burning =
            false;

          clearInterval(
            burnInterval
          );

        }

      },1000);

}

  }

  // BANANA WIZARD
  if(
    attacker.fighter?.id ===
    "bananaWizard"
  ){

    if(
      Math.random() < 0.15
    ){

      damageObj.value += 8;

      knockbackObj.value += 10;

    }

  }

}

// ==========================
// PASSIVE PROJECTILE HIT
// ==========================
function applyProjectilePassive(
  attacker,
  target,
  damageObj
){

  // BUFF SHIBA ARMOR
  if(
    target.fighter?.id ===
    "buffShiba"
  ){

      damageObj.value *= 0.9;

  }

  // BANANA WIZARD CHAOS
  if(
    attacker.fighter?.id ===
    "bananaWizard"
  ){

      if(
        Math.random() < 0.15
      ){

        damageObj.value += 8;

      }

  }

}


// ==========================
// HIT PAUSE
// ==========================
var hitPaused = false;

function hitPause(duration = 60){

  hitPaused = true;

  setTimeout(()=>{

    hitPaused = false;

  },duration);

}


// ==========================
// SCREEN SHAKE
// ==========================
let shakeDuration = 0;
let shakeStrength = 0;

function screenShake(
  strength = 8,
  duration = 120
){

  shakeStrength = strength;
  shakeDuration = duration;

}


// ==========================
// ATTACK
// ==========================
function attack(
  attacker,
  target,
  type
){

  if(
    attacker.attacking ||
    attacker.hurt ||
    attacker.dead
  ) return;

  attacker.attacking = true;

  setAnimation(
    attacker,
    type
  );

  // SOUND
  if(type === "punch"){

    punchSound.currentTime = 0;
    punchSound.play();

  }

  if(
    type === "kick" ||
    type === "jumpkick"
  ){

    kickSound.currentTime = 0;
    kickSound.play();

  }

  setTimeout(()=>{

    let range =
      type === "punch"
      ? 120
      : 150;

    let damageObj = {

      value:
        type === "punch"
        ? 10
        : 16

    };

    let knockbackObj = {

      value:
        type === "punch"
        ? 14
        : 24

    };

    let shakePower =
      type === "punch"
      ? 6
      : 10;

    if(type === "jumpkick"){

      damageObj.value = 18;

      knockbackObj.value = 32;

      shakePower = 14;

    }

    damageObj.value *=
      attacker.fighter
      ?.damageMultiplier || 1;

    // REAL HITBOX
    let xDistance =
      Math.abs(
        attacker.x - target.x
      );

    let yDistance =
      Math.abs(
        attacker.y - target.y
      );

    if(
      xDistance < range &&
      yDistance < 120
    ){

      // HIT PAUSE
      hitPause(60);

      screenShake(
        shakePower,
        100 + (
          damageObj.value * 2
        )
      );

      // BLOCK
      if(target.blocking){

        blockSound.currentTime = 0;
        blockSound.play();

        damageObj.value *= 0.2;

        knockbackObj.value *= 0.35;

      }

      applyPassiveHit(
        attacker,
        target,
        damageObj,
        knockbackObj
      );

      // BUFF SHIBA
      if(
        target.fighter?.id ===
        "buffShiba"
      ){

        damageObj.value *= 0.9;

      }

      target.hp -= damageObj.value;

      // COMBO HOOK
      if(
        typeof addCombo ===
        "function"
      ){

        addCombo(attacker);

      }

      if(target.hp < 0){

        target.hp = 0;

      }

      // ==========================
      // SMOOTH KNOCKBACK
      // ==========================
      if(attacker.x < target.x){

        target.velocityX =
          knockbackObj.value;

      }else{

        target.velocityX =
          -knockbackObj.value;

      }

      // AIR POP
      if(type === "jumpkick"){

        target.velocityY =
          -6;

      }

      // HURT
      target.hurt = true;

      setAnimation(
        target,
        "hurt"
      );

      setTimeout(()=>{

        target.hurt = false;

        if(
          !target.dead &&
          !target.blocking
        ){

          setAnimation(
            target,
            "idle"
          );

        }

      },220);

      // DEATH
      if(target.hp <= 0){

        target.dead = true;

        setAnimation(
          target,
          "dead"
        );

        gameOver(target);

      }

    }

  },120);

  // END ATTACK
  setTimeout(()=>{

    attacker.attacking = false;

    if(
      !attacker.dead &&
      !attacker.blocking &&
      !attacker.jumping
    ){

      setAnimation(
        attacker,
        "idle"
      );

    }

  },350);

}


// ==========================
// SPECIAL MOVE
// ==========================
function specialMove(player){

  if(
    player.attacking ||
    player.dead
  ) return;

  player.attacking = true;

  setAnimation(
    player,
    "sp"
  );

  spSound.currentTime = 0;
  spSound.play();

  const projectile =
    document.createElement("div");

  projectile.className =
    "projectile";

  projectile.style.position =
    "absolute";

  projectile.style.width =
    "40px";

  projectile.style.height =
    "40px";

  projectile.style.borderRadius =
    "50%";

  projectile.style.background =
    player.fighter
      ?.projectileColor ||
    "cyan";

  projectile.style.boxShadow =
    `0 0 25px ${
      player.fighter
        ?.projectileColor ||
      "cyan"
    }`;

  projectile.style.left =
    player.x + "px";

  projectile.style.top =
    (player.y + 60) + "px";

  game.appendChild(projectile);

  projectiles.push({

    x:player.x,
    y:player.y + 60,

    speed:
      player.facingLeft
      ? -12
      : 12,

    owner:player,

    element:projectile

  });

  setTimeout(()=>{

    player.attacking = false;

    if(
      !player.dead &&
      !player.blocking &&
      !player.jumping
    ){

      setAnimation(
        player,
        "idle"
      );

    }

  },500);

}


// ==========================
// UPDATE PROJECTILES
// ==========================
function updateProjectiles(){

  projectiles.forEach(
    (ball,index)=>{

      ball.x += ball.speed;

      ball.element.style.left =
        ball.x + "px";

      const target =
        ball.owner === player1
          ? player2
          : player1;

      let xDistance =
        Math.abs(
          ball.x - target.x
        );

      let yDistance =
        Math.abs(
          ball.y - target.y
        );

      if(
        xDistance < 100 &&
        yDistance < 120
      ){

        hitPause(80);

        // STRONGER SPECIAL SHAKE
        screenShake(
          20,
          220
        );

        let damageObj = {

          value:20

        };

        applyProjectilePassive(
          ball.owner,
          target,
          damageObj
        );

        if(
  ball.owner.fighter?.id ===
  "flameMonk"
){

  if(
    !target.burning
  ){

    target.burning = true;

    let burnTicks = 3;

    const burnInterval =
      setInterval(()=>{

        if(
          target.dead ||
          !target.burning
        ){

          clearInterval(
            burnInterval
          );

          return;

        }

        target.hp -= 2;

        burnTicks--;

        if(
          target.hp <= 0
        ){

          target.hp = 0;

          target.dead = true;

          setAnimation(
            target,
            "dead"
          );

          gameOver(
            target
          );

          clearInterval(
            burnInterval
          );

        }

        if(
          burnTicks <= 0
        ){

          target.burning =
            false;

          clearInterval(
            burnInterval
          );

        }

      },1000);

  }

}

        target.hp -=
          damageObj.value;

        // COMBO HOOK
        if(
          typeof addCombo ===
          "function"
        ){

          addCombo(
            ball.owner
          );

        }

        if(target.hp < 0){

          target.hp = 0;

        }

        // SPECIAL KNOCKBACK
        if(
          ball.owner.x <
          target.x
        ){

          target.velocityX =

          ball.owner.fighter?.id ===
          "bananaWizard"

            ? 48

            : 38;

        }else{

          target.velocityX =

          ball.owner.fighter?.id ===
          "bananaWizard"

            ? -48

            : -38;

        }

        target.velocityY = -8;

        target.hurt = true;

        setAnimation(
          target,
          "hurt"
        );

        setTimeout(()=>{

          target.hurt = false;

          if(
            !target.dead &&
            !target.blocking
          ){

            setAnimation(
              target,
              "idle"
            );

          }

        },220);

        ball.element.remove();

        projectiles.splice(
          index,
          1
        );

        if(target.hp <= 0){

          target.dead = true;

          setAnimation(
            target,
            "dead"
          );

          gameOver(target);

        }

      }

      // REMOVE OFFSCREEN
      if(
        ball.x < -100 ||
        ball.x >
          window.innerWidth +
            100
      ){

        ball.element.remove();

        projectiles.splice(
          index,
          1
        );

      }

    }
  );

}