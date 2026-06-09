// DATA
import "./style.css";
import { data as srdData } from "./data";
import { customData } from "./customData"; // custom spells
import type { Spelldata } from "./types";
const data = srdData.concat(customData);

// FILTER
const classFilter: string = "Wizard"; // my personal character class
const minLevel: number = 0; // cantrips
const maxLevel: number = 1; // max level ... for now

// console.log(data.length);

const spells: Spelldata[] = data.filter(
  (spell) =>
    spell.classes != null &&
    spell.classes.includes(classFilter) &&
    spell.level != null &&
    spell.level >= minLevel &&
    spell.level <= maxLevel,
);

// console.log(spells.length);

// TOOLS

function mdTransform(markdown: string | null) {
  if (markdown == null) return "";
  const numOfStars = markdown.match(/\*\*/g);
  if (numOfStars && numOfStars.length > 0) {
    for (
      let tagNumber: number = 1;
      tagNumber <= numOfStars.length;
      tagNumber++
    ) {
      if (tagNumber % 2 != 0) {
        markdown = markdown.replace("**", "<strong>");
      } else {
        markdown = markdown.replace("**", "</strong>");
      }
    }
  }

  const numOfNewlines = markdown.match(/\n\n/g);
  if (numOfNewlines && numOfNewlines.length > 0) {
    for (let i: number = 1; i <= numOfNewlines.length; i++) {
      markdown = markdown.replace("\n\n", "<br>");
    }
  }

  const numOfBreaks = markdown.match(/\n/g);
  if (numOfBreaks && numOfBreaks.length > 0) {
    for (let i: number = 1; i <= numOfBreaks.length; i++) {
      markdown = markdown.replace("\n", "<br>");
    }
  }

  const numOfBullets = markdown.match(/\*\s/g);
  if (numOfBullets && numOfBullets.length > 0) {
    for (let i: number = 1; i <= numOfBullets.length; i++) {
      markdown = markdown.replace("*", "⁍");
    }
  }

  return markdown;
}

// RENDER

const app = document.querySelector<HTMLDivElement>("#app");

// rausfinden wieviele seiten (displaySpells / 9)
// console.log(Math.ceil(spells.length / 9));

for (let page: number = 1; page <= Math.ceil(spells.length / 9); page++) {
  const pageElement: HTMLElement = document.createElement("article");
  pageElement.classList.add("page", "page-maxsize");

  const displaySpells = spells.slice((page - 1) * 9, page * 9); // pagination hard coded

  displaySpells.forEach((spell) => {
    const spellElement: HTMLElement = document.createElement("section");
    spellElement.classList.add("card", "card-maxsize");

    const ritualOnly = !spell.concentration && spell.ritual;
    const ritualAndConcentration = spell.concentration && spell.ritual;

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
