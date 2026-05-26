// ==========================
// UI
// ==========================
let menuVisible = true;

// MENU TOGGLE
menuBtn.addEventListener("click",()=>{

  menuVisible = !menuVisible;

  if(menuVisible){

    controlsMenu.style.display = "block";
    menuBtn.innerHTML = "Hide Controls";

  }else{

    controlsMenu.style.display = "none";
    menuBtn.innerHTML = "Show Controls";

  }

});

// START BUTTON
startBtn.addEventListener("click",()=>{

  startScreen.style.display = "none";
  gameStarted = true;

});

// RETRY
retryBtn.addEventListener("click",()=>{

  location.reload();

});