// DATA
import type { Spelldata, CardSizeOptions, FilterLevel, Page } from "./types";
import { data } from "./data"; // SRD spells
import { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import Markdown from "markdown-to-jsx";
import "./App.css";

const App = () => {
  const [cardSize, setCardSize] = useState<string>("max"); // "max" | "magic" | "tarot"
  const [cardSizeOptions, setCardSizeOptions] = useState<CardSizeOptions>({
    cardSizePageCss: "page-maxsize",
    cardSizeCardCss: "card-maxsize",
    cardsPerPage: 9,
  });
  const [classFilter, setClassFilter] = useState<string>("wizard");
  const [levelFilter, setLevelFilter] = useState<FilterLevel>({
    min: 0,
    max: 1,
  });

  const filteredSpells: Spelldata[] = data
    .filter(
      (spell) =>
        spell.classes != null &&
        spell.classes.toLocaleLowerCase().includes(classFilter) &&
        spell.level != null &&
        spell.level >= levelFilter.min &&
        spell.level <= levelFilter.max,
    )
    .sort((a, b) => {
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

  // Check if a spellcard has more than 1800 characters. If yes, it needs to have a second card to display the full text.
  // That also shifts all the other cards one position further.
  const bigTextCards: Spelldata[] = filteredSpells.filter(
    (card) => card.description && card.description.length > 1500,
  );
  console.log(bigTextCards);

  // Constructing Page Info (number of pages, which spells to display on which page)
  const pageInfo: Page[] = [];
  const numOfPages: number = Math.ceil(
    filteredSpells.length / cardSizeOptions.cardsPerPage,
  );
  for (let i = 0; i < numOfPages; i++) {
    pageInfo.push({
      page: i,
      spellStart: i * cardSizeOptions.cardsPerPage,
      spellEnd: (i + 1) * cardSizeOptions.cardsPerPage - 1,
    });
  }

  return (
    <>
      {cardSize}
      {numOfPages}
      {pageInfo.map((page) => (
        <article className={"page" + ` ${cardSizeOptions.cardSizePageCss}`}>
          {filteredSpells
            .slice(page.spellStart, page.spellEnd + 1)
            .map((spell) => {
              const ritualOnly: boolean | null =
                !spell.concentration && spell.ritual;
              const ritualAndConcentration: boolean | null =
                spell.concentration && spell.ritual;

              return (
                <section
                  className={"card" + ` ${cardSizeOptions.cardSizeCardCss}`}
                >
                  {spell.concentration && (
                    <span className="concentration">C</span>
                  )}
                  {ritualOnly && <span className="ritual">R</span>}
                  {ritualAndConcentration && (
                    <span className="ritual ritConc">R</span>
                  )}
                  <h2
                    className="name"
                    style={
                      spell.spell_name && spell.spell_name.length > 24
                        ? { transform: "scale(0.80) translateY(-25%)" }
                        : {}
                    }
                  >
                    {spell.spell_name}
                  </h2>
                  <span className="level">{spell.level}</span>
                  <header>
                    <section>
                      <h3>Range</h3>
                      <p>{spell.range}</p>
                    </section>
                    <section>
                      <h3>Components</h3>
                      <p>{spell.components}</p>
                    </section>
                    <section>
                      <h3>Duration</h3>
                      <p>{spell.duration}</p>
                    </section>
                    <section>
                      <h3>Casting Time</h3>
                      <p>{spell.casting_time}</p>
                    </section>
                  </header>
                  <main
                    className={
                      spell.description && spell.description.length > 1000
                        ? "fontSmall"
                        : ""
                    }
                  >
                    <Markdown>{spell.description}</Markdown>
                  </main>
                  <footer>
                    <span>{spell.school}</span>
                    <span>{spell.classes}</span>
                  </footer>
                </section>
              );
            })}
          <ControlPanel
            cardSize={cardSize}
            setCardSize={setCardSize}
            setCardSizeOptions={setCardSizeOptions}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
          />
        </article>
      ))}
    </>
  );
};

export default App;
