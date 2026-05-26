// ==========================
// GAME STATE
// ==========================
let gameState = "MENU";


// ==========================
// UI ELEMENTS
// ==========================
const mainMenu =
  document.getElementById("mainMenu");

const categorySelect =
  document.getElementById("categorySelect");

const characterSelect =
  document.getElementById("characterSelect");

const resultScreen =
  document.getElementById("resultScreen");

const playBtn =
  document.getElementById("playBtn");

const elementalBtn =
  document.getElementById("elementalBtn");

const memeBtn =
  document.getElementById("memeBtn");

const fighterGrid =
  document.getElementById("fighterGrid");

const characterTitle =
  document.getElementById("characterTitle");

const backToMenuBtn =
  document.getElementById("backToMenuBtn");

const backToCategoryBtn =
  document.getElementById("backToCategoryBtn");


// ==========================
// CATEGORY
// ==========================
let selectedCategory = null;

let selectedFighter = null;


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

  categorySelect.classList.add(
    "activeScreen"
  );

  gameState = "CATEGORY_SELECT";

});


// ==========================
// BACK TO MENU
// ==========================
backToMenuBtn.addEventListener("click",()=>{

  categorySelect.classList.remove(
    "activeScreen"
  );

  mainMenu.classList.add(
    "activeScreen"
  );

  gameState = "MENU";

});


// ==========================
// BACK TO CATEGORY
// ==========================
backToCategoryBtn.addEventListener("click",()=>{

  characterSelect.classList.remove(
    "activeScreen"
  );

  categorySelect.classList.add(
    "activeScreen"
  );

  gameState = "CATEGORY_SELECT";

});


// ==========================
// ELEMENTAL CATEGORY
// ==========================
elementalBtn.addEventListener("click",()=>{

  selectedCategory =
    "elemental";

  openCharacterSelect();

});


// ==========================
// MEME CATEGORY
// ==========================
memeBtn.addEventListener("click",()=>{

  selectedCategory =
    "meme";

  openCharacterSelect();

});


// ==========================
// CHARACTER SELECT
// ==========================
function openCharacterSelect(){

  categorySelect.classList.remove(
    "activeScreen"
  );

  characterSelect.classList.add(
    "activeScreen"
  );

  fighterGrid.innerHTML = "";

  characterTitle.innerHTML =
    selectedCategory.toUpperCase();

  for(let key in fighters){

    let fighter = fighters[key];

    if(fighter.category !==
       selectedCategory) continue;

    const card =
      document.createElement("div");

    card.className =
      "fighterCard";

    card.style.borderColor =
      fighter.color;

    card.innerHTML = `

      <img
        src="${fighter.image}"
        class="fighterImage"
      >

      <h2 style="color:${fighter.color}">
        ${fighter.name}
      </h2>

      <p>
        ${fighter.description}
      </p>
    `;

    card.addEventListener("mouseenter",()=>{

      card.style.boxShadow =
        `0 0 35px ${fighter.color}`;

    });

    card.addEventListener("mouseleave",()=>{

      card.style.boxShadow =
        "";

    });

    card.addEventListener("click",()=>{

      selectedFighter =
        fighter;

      applySelectedFighter();

      startGame();

    });

    fighterGrid.appendChild(card);

  }

}


// ==========================
// APPLY FIGHTER
// ==========================
function applySelectedFighter(){

  // PLAYER 1
  player1.fighter =
    selectedFighter;

  player1.hp =
    selectedFighter.hp;

  player1.maxHP =
    selectedFighter.hp;

  player1.speed =
    selectedFighter.speed;

  p1.style.filter =
    selectedFighter.aura;

  // PLAYER 2 DEFAULT
  player2.fighter =
    fighters.defaultStickman;

  player2.hp =
    player2.fighter.hp;

  player2.maxHP =
    player2.fighter.hp;

  player2.speed =
    player2.fighter.speed;

  p2.style.filter =
    player2.fighter.aura;

}


// ==========================
// START GAME
// ==========================
function startGame(){

  characterSelect.classList.remove(
    "activeScreen"
  );

  gameStarted = true;

  gameState = "FIGHTING";

}


// ==========================
// RETRY BUTTON
// ==========================
retryBtn.addEventListener("click",()=>{

  location.reload();

});