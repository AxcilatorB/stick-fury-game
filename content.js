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
// FIGHTERS
// ==========================
const fighters = {

  // ==========================
  // GENERIC
  // ==========================
  defaultStickman:{
    id:"defaultStickman",

    name:"STICKMAN",

    category:"elemental",

    color:"#ffffff",

    description:
      "THE CLASSIC FIGHTER",

    image:
      "assets/idle1.png",

    aura:
      "drop-shadow(0 0 12px white)",

    projectileColor:
      "cyan",

    speed:5,

    damageMultiplier:1,

    hp:150
  },

  // ==========================
  // ELEMENTAL
  // ==========================
  thunderRonin:{
    id:"thunderRonin",

    name:"THUNDER RONIN",

    category:"elemental",

    color:"#67e8f9",

    description:
      "FAST LIGHTNING SWORDSMAN",

    image:
      "assets/thunderronin.png",

    aura:
      "drop-shadow(0 0 16px cyan)",

    projectileColor:
      "#67e8f9",

    speed:6,

    damageMultiplier:1,

    hp:145
  },

  flameMonk:{
    id:"flameMonk",

    name:"FLAME MONK",

    category:"elemental",

    color:"#fb923c",

    description:
      "AGGRESSIVE FIRE FIGHTER",

    image:
      "assets/flamemonk.png",

    aura:
      "drop-shadow(0 0 16px orange)",

    projectileColor:
      "#fb923c",

    speed:5,

    damageMultiplier:1.15,

    hp:150
  },

  // ==========================
  // MEME
  // ==========================
  bananaWizard:{
    id:"bananaWizard",

    name:"BANANA WIZARD",

    category:"meme",

    color:"#facc15",

    description:
      "CHAOTIC BANANA MAGIC",

    image:
      "assets/bananawizard.png",

    aura:
      "drop-shadow(0 0 16px yellow)",

    projectileColor:
      "#facc15",

    speed:5,

    damageMultiplier:1,

    hp:150
  },

  buffShiba:{
    id:"buffShiba",

    name:"BUFF SHIBA",

    category:"meme",

    color:"#f59e0b",

    description:
      "THE ALMIGHTY DOGE",

    image:
      "assets/buffshiba.png",

    aura:
      "drop-shadow(0 0 16px orange)",

    projectileColor:
      "#f59e0b",

    speed:4,

    damageMultiplier:1.2,

    hp:175
  }

};