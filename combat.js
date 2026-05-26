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