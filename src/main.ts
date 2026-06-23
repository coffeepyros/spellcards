// DATA
import type { Spelldata } from "./types";
import { data as srdData } from "./data"; // SRD spells
import { customData } from "./customData"; // custom spells
import { mdTransform } from "./utils"; // my own markdown -> html
const data = srdData.concat(customData); // all spells
import "./style.css";
import "./control-panel.scss";

// VITE HTML ELEMENT
const app = document.querySelector<HTMLDivElement>("#app");

// UI STATES
// max - 3x3 grid on A4, with 0.5cm border - max size for Copy Shops
// magic - 6.3 x 8.8 cm Magic The Gathering size, for foils / organization
// tarot - 7 x 12 cm, only 2x2 on a A4 page, but a lot more space per card
// card sizes are hard coded in the style.css
let cardSize: string = "max"; // "max" | "magic" | "tarot"

// FILTER
let classFilter: string = "Wizard"; // my personal character class
const minLevel: number = 0; // cantrips
const maxLevel: number = 1; // max level ... for now

// console.log(data.length);

// console.log(spells.length);

// DISPLAY TOOLS

// RENDER

// rausfinden wieviele seiten (displaySpells / 9)
// console.log(Math.ceil(spells.length / 9));

// RENDER FUNCTION
function render() {
  // default setting = A4 Max
  let cardSizePageCss: string = "page-maxsize",
    cardSizeCardCss: string = "card-maxsize",
    cardsPerPage: number = 9;
  // response to UI input
  switch (cardSize) {
    case "max":
      cardSizePageCss = "page-maxsize";
      cardSizeCardCss = "card-maxsize";
      cardsPerPage = 9;
      break;
    case "magic":
      cardSizePageCss = "page-magic";
      cardSizeCardCss = "card-magic";
      cardsPerPage = 9;
      break;
    case "tarot":
      cardSizePageCss = "page-tarot";
      cardSizeCardCss = "card-tarot";
      cardsPerPage = 4;
      break;
  }

  // CLEAR CONTENT FOR RE-RENDER
  const pagesToBeRemoved = document.querySelectorAll<HTMLDivElement>(".page");
  pagesToBeRemoved.forEach((page) => page.remove());

  const filteredSpells: Spelldata[] = data.filter(
    (spell) =>
      spell.classes != null &&
      spell.classes.includes(classFilter) &&
      spell.level != null &&
      spell.level >= minLevel &&
      spell.level <= maxLevel,
  );
  // SORT SPELLS BY LEVEL - CANTRIPS FIRST, THEN SPELL NAME
  filteredSpells.sort((a, b) => {
    if (
      a.level == null ||
      b.level == null ||
      a.spell_name == null ||
      b.spell_name == null
    )
      return 0;
    if (a.level < b.level) return -1;
    if (a.level > b.level) return 1;
    if (a.spell_name < b.spell_name) return -1;
    if (a.spell_name > b.spell_name) return 1;
    return 0;
  });

  // Pagination
  for (
    let page: number = 1;
    page <= Math.ceil(filteredSpells.length / cardsPerPage);
    page++
  ) {
    const pageElement: HTMLElement = document.createElement("article");
    pageElement.classList.add("page", cardSizePageCss);

    const displaySpells: Spelldata[] = filteredSpells.slice(
      (page - 1) * cardsPerPage,
      page * cardsPerPage,
    );

    displaySpells.forEach((spell) => {
      const spellElement: HTMLElement = document.createElement("section");
      spellElement.classList.add("card", cardSizeCardCss);

      const ritualOnly: boolean | null = !spell.concentration && spell.ritual;
      const ritualAndConcentration: boolean | null =
        spell.concentration && spell.ritual;

      spellElement.innerHTML = `
      ${spell.concentration ? '<span class="concentration">C</span>' : ""}
      ${ritualOnly ? '<span class="ritual">R</span>' : ""}
      ${ritualAndConcentration ? '<span class="ritual ritConc">R</span>' : ""}
      <h2 class="name" ${spell.spell_name && spell.spell_name.length > 24 ? 'style="transform: scale(0.80) translateY(-25%)"' : ""}>${spell.spell_name}</h2>
    <span class="level">${spell.level}</span>
    <header>
        <section>
            <h3>Range</h3>
            <p>${spell.range}</p>
        </section>
        <section>
            <h3>Components</h3>
            <p>${spell.components}</p>
        </section>
        <section>
            <h3>Duration</h3>
            <p>${spell.duration}</p>
        </section>
        <section>
            <h3>Casting Time</h3>
            <p>${spell.casting_time}</p>
        </section>
    </header>
    <main>
        ${mdTransform(spell.description)}
    </main>
    <footer>
        <span>${spell.school}</span>
        <span>${spell.classes}</span>
    </footer>`;

      pageElement.append(spellElement);
    });

    if (app) app.append(pageElement);
  }
}

// CONTROL PANEL
const classes: string[] = [
  "",
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

const controlElement: HTMLElement = document.createElement("section");
controlElement.id = "control-panel";

const labelCardSize: HTMLLabelElement = document.createElement("label");
labelCardSize.innerText = "Card Sizes";
labelCardSize.htmlFor = "card-size";

const selectCardSize: HTMLSelectElement = document.createElement("select");
selectCardSize.id = "card-size";
selectCardSize.innerHTML = `<option value="max">Maximum Size (A4)</option>
  <option value="magic">Magic Card</option>
  <option value="tarot">Tarot Card</option>`;

const labelClass: HTMLLabelElement = document.createElement("label");
labelClass.innerText = "Class";
labelClass.htmlFor = "filter-class";

const selectFilterClass: HTMLSelectElement = document.createElement("select");
selectFilterClass.id = "filter-class";
classes.forEach((charClass) => {
  selectFilterClass.innerHTML += `<option value="${charClass.toLowerCase()}">${charClass}</option>`;
});
selectFilterClass.addEventListener("change", (e) => {
  const target = e.currentTarget as HTMLSelectElement;
  if (target) classFilter = target.value;
  render();
});

const labelLevel: HTMLLabelElement = document.createElement("label");
labelLevel.innerText = "Level";
labelLevel.htmlFor = "filter-level-start";

const selectFilterLevelStart: HTMLSelectElement =
  document.createElement("select");
const selectFilterLevelEnd: HTMLSelectElement =
  document.createElement("select");

controlElement.append(
  labelCardSize,
  selectCardSize,
  labelClass,
  selectFilterClass,
  labelLevel,
  selectFilterLevelStart,
  selectFilterLevelEnd,
);

if (app) app.append(controlElement);

const sizeSelect = document.querySelector<HTMLSelectElement>("#card-size");
sizeSelect &&
  sizeSelect.addEventListener("change", (e) => {
    const target = e.currentTarget as HTMLSelectElement;
    if (e.currentTarget) cardSize = target.value;
    render();
  });

// INIT
render();
