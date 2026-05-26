// ==========================
// GAME STATE
// ==========================
let gameState = "MENU";


// ==========================
// UI ELEMENTS
// ==========================
const mainMenu =
  document.getElementById("mainMenu");

const resultScreen =
  document.getElementById("resultScreen");

const playBtn =
  document.getElementById("playBtn");


// ==========================
// MENU TOGGLE
// ==========================
let menuVisible = true;

menuBtn.addEventListener("click",()=>{

  menuVisible = !menuVisible;

  if(menuVisible){

    controlsMenu.style.display =
      "block";

    menuBtn.innerHTML =
      "Hide Controls";

  }else{

    controlsMenu.style.display =
      "none";

    menuBtn.innerHTML =
      "Show Controls";

  }

});


// ==========================
// PLAY BUTTON
// ==========================
playBtn.addEventListener("click",()=>{

  mainMenu.classList.remove(
    "activeScreen"
  );

  gameStarted = true;

  gameState = "FIGHTING";

});


// ==========================
// RETRY BUTTON
// ==========================
retryBtn.addEventListener("click",()=>{

  location.reload();

});