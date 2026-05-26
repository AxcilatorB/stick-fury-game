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

const vsScreen =
  document.getElementById("vsScreen");

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

const categoryTitle =
  document.getElementById("categoryTitle");

const backToMenuBtn =
  document.getElementById("backToMenuBtn");

const backToCategoryBtn =
  document.getElementById("backToCategoryBtn");

const p1Name =
  document.getElementById("p1Name");

const p2Name =
  document.getElementById("p2Name");


// ==========================
// PLAYER SELECT
// ==========================
let selectingPlayer = 1;

let selectedCategoryP1 = null;
let selectedCategoryP2 = null;

let selectedFighterP1 = null;
let selectedFighterP2 = null;


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

  openCategorySelect();

});


// ==========================
// OPEN CATEGORY SELECT
// ==========================
function openCategorySelect(){

  categorySelect.classList.add(
    "activeScreen"
  );

  categoryTitle.innerHTML =
    `PLAYER ${selectingPlayer} CATEGORY`;

  gameState = "CATEGORY_SELECT";

}


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

  resetSelections();

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
// CATEGORY BUTTONS
// ==========================
elementalBtn.addEventListener("click",()=>{

  if(selectingPlayer === 1){

    selectedCategoryP1 =
      "elemental";

  }else{

    selectedCategoryP2 =
      "elemental";

  }

  openCharacterSelect();

});

memeBtn.addEventListener("click",()=>{

  if(selectingPlayer === 1){

    selectedCategoryP1 =
      "meme";

  }else{

    selectedCategoryP2 =
      "meme";

  }

  openCharacterSelect();

});


// ==========================
// OPEN CHARACTER SELECT
// ==========================
function openCharacterSelect(){

  categorySelect.classList.remove(
    "activeScreen"
  );

  characterSelect.classList.add(
    "activeScreen"
  );

  renderCharacterCards();

}


// ==========================
// RENDER CARDS
// ==========================
function renderCharacterCards(){

  fighterGrid.innerHTML = "";

  characterTitle.innerHTML =
    `PLAYER ${selectingPlayer} SELECT`;

  let currentCategory =
    selectingPlayer === 1
    ? selectedCategoryP1
    : selectedCategoryP2;

  for(let key in fighters){

    let fighter = fighters[key];

    if(fighter.category !==
       currentCategory) continue;

    const card =
      document.createElement("div");

    card.className =
      "fighterCard";

    card.style.borderColor =
      fighter.color;

    card.innerHTML = `

      <div
        class="fighterPlaceholder"
        style="
          color:${fighter.color};
          text-shadow:0 0 15px ${fighter.color};
        "
      >
        ${fighter.name.split(" ")[0]}
      </div>

      <h2 style="color:${fighter.color}">
        ${fighter.name}
      </h2>

      <p>
        ${fighter.description}
      </p>
    `;

    card.addEventListener("mouseenter",()=>{

      if(
        !card.classList.contains(
          "selectedP1"
        ) &&
        !card.classList.contains(
          "selectedP2"
        )
      ){

        card.style.boxShadow =
          `0 0 35px ${fighter.color}`;

      }

    });

    card.addEventListener("mouseleave",()=>{

      if(
        !card.classList.contains(
          "selectedP1"
        ) &&
        !card.classList.contains(
          "selectedP2"
        )
      ){

        card.style.boxShadow =
          "";

      }

    });

    card.addEventListener("click",()=>{

      selectFighter(
        fighter,
        card
      );

    });

    fighterGrid.appendChild(card);

  }

}


// ==========================
// SELECT FIGHTER
// ==========================
function selectFighter(
  fighter,
  card
){

  // ==========================
  // PLAYER 1
  // ==========================
  if(selectingPlayer === 1){

    selectedFighterP1 =
      fighter;

    card.classList.add(
      "selectedP1"
    );

    card.style.boxShadow =
      "0 0 40px #3b82f6";

    setTimeout(()=>{

      selectingPlayer = 2;

      characterSelect.classList.remove(
        "activeScreen"
      );

      openCategorySelect();

    },700);

    return;

  }

  // ==========================
  // PLAYER 2
  // ==========================
  selectedFighterP2 =
    fighter;

  card.classList.add(
    "selectedP2"
  );

  card.style.boxShadow =
    "0 0 40px #ef4444";

  setTimeout(()=>{

    openVSscreen();

  },700);

}


// ==========================
// VS SCREEN
// ==========================
function openVSscreen(){

  characterSelect.classList.remove(
    "activeScreen"
  );

  vsScreen.classList.add(
    "activeScreen"
  );

  p1Name.innerHTML =
    selectedFighterP1.name;

  p2Name.innerHTML =
    selectedFighterP2.name;

  p1Name.style.color =
    selectedFighterP1.color;

  p2Name.style.color =
    selectedFighterP2.color;

  setTimeout(()=>{

    vsScreen.classList.remove(
      "activeScreen"
    );

    applySelectedFighters();

    startGame();

  },2500);

}


// ==========================
// APPLY FIGHTERS
// ==========================
function applySelectedFighters(){

  // PLAYER 1
  player1.fighter =
    selectedFighterP1;

  player1.hp =
    selectedFighterP1.hp;

  player1.maxHP =
    selectedFighterP1.hp;

  player1.speed =
    selectedFighterP1.speed;

  p1.style.filter =
    selectedFighterP1.aura;

  // PLAYER 2
  player2.fighter =
    selectedFighterP2;

  player2.hp =
    selectedFighterP2.hp;

  player2.maxHP =
    selectedFighterP2.hp;

  player2.speed =
    selectedFighterP2.speed;

  p2.style.filter =
    selectedFighterP2.aura;

}


// ==========================
// RESET
// ==========================
function resetSelections(){

  selectingPlayer = 1;

  selectedCategoryP1 = null;
  selectedCategoryP2 = null;

  selectedFighterP1 = null;
  selectedFighterP2 = null;

}


// ==========================
// START GAME
// ==========================
function startGame(){

  gameStarted = true;

  gameState = "FIGHTING";

}


// ==========================
// RETRY BUTTON
// ==========================
retryBtn.addEventListener("click",()=>{

  location.reload();

});