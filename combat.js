// ==========================
// PROJECTILES
// ==========================
let projectiles = [];


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

  // ==========================
  // SOUND
  // ==========================
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

  // ==========================
  // DAMAGE DELAY
  // ==========================
  setTimeout(()=>{

    let range =
      type === "punch"
      ? 120
      : 150;

    let damage =
      type === "punch"
      ? 10
      : 16;

    if(type === "jumpkick"){

      damage = 18;

    }

    damage *=
      attacker.fighter
      ?.damageMultiplier || 1;

    // ==========================
    // REAL HITBOX CHECK
    // ==========================
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

      // ==========================
      // BLOCK
      // ==========================
      if(target.blocking){

        blockSound.currentTime = 0;
        blockSound.play();

        damage *= 0.2;

      }

      target.hp -= damage;

      if(target.hp < 0){

        target.hp = 0;

      }

      // ==========================
      // HURT FLASH
      // ==========================
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

      },200);

      // ==========================
      // DEATH
      // ==========================
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

  // ==========================
  // END ATTACK
  // ==========================
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
    ?.projectileColor || "cyan";

  projectile.style.boxShadow =
    `0 0 25px ${
      player.fighter
      ?.projectileColor || "cyan"
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

      // ==========================
      // REAL PROJECTILE HITBOX
      // ==========================
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

        target.hp -= 20;

        if(target.hp < 0){

          target.hp = 0;

        }

        // ==========================
        // HURT FLASH
        // ==========================
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

        },200);

        // REMOVE PROJECTILE
        ball.element.remove();

        projectiles.splice(
          index,
          1
        );

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

      // ==========================
      // REMOVE OFFSCREEN
      // ==========================
      if(
        ball.x < -100 ||
        ball.x > window.innerWidth + 100
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