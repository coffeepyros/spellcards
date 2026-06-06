import { data as srdData } from "./data.js";
import { customData } from "./customData.js";

const data = srdData.concat(customData);

// FILTER
const classFilter = "Wizard";
const minLevel = 0;
const maxLevel = 1;

const spells = data.filter(
  (spell) =>
    spell.classes != null &&
    spell.classes.includes(classFilter) &&
    spell.level >= minLevel &&
    spell.level <= maxLevel,
);

console.log(spells.length);

// RENDER

const layout = document.getElementById("layout");
