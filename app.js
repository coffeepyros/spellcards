// DATA
import { data as srdData } from "./data.js";
import { customData } from "./customData.js";
const data = srdData.concat(customData);

// FILTER
const classFilter = "Wizard";
const minLevel = 0;
const maxLevel = 1;

// console.log(data.length);

const spells = data.filter(
  (spell) =>
    spell.classes != null &&
    spell.classes.includes(classFilter) &&
    spell.level >= minLevel &&
    spell.level <= maxLevel,
);

// console.log(spells.length);

// RENDER

const layout = document.getElementById("layout");
const displaySpells = spells.slice(0, 9);

displaySpells.forEach((spell) => {
  const spellElement = document.createElement("section");
  spellElement.classList.add("card");

  const nameElement = document.createElement("h2");
  nameElement.classList.add("name");
  nameElement.innerText = spell.spell_name;

  spellElement.append(nameElement);

  layout.append(spellElement);
});
