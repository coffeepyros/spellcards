import type { Spelldata, CardSizeOptions, FilterLevel, Page } from "./types";
import { useState } from "react";
import Markdown from "markdown-to-jsx";
import ControlPanel from "./components/ControlPanel";
import { data } from "./data"; // SRD spells
import { sortFirstByLevelThenName } from "./utils";
import "./App.scss";

const App = () => {
  const [cardSize, setCardSize] = useState<string>("max"); // "max" | "magic" | "tarot"
  const [lang, setLang] = useState<string>("en"); // "en" | "de"
  const [cardSizeOptions, setCardSizeOptions] = useState<CardSizeOptions>({
    pageCss: "page-maxsize",
    cardCss: "card-maxsize",
    cardsPerPage: 9,
  });
  const [classFilter, setClassFilter] = useState<string>("wizard");
  const [levelFilter, setLevelFilter] = useState<FilterLevel>({
    min: 0,
    max: 2,
  });

  const filteredSpells: Spelldata[] = data.filter(
    (spell) =>
      spell.classes != null &&
      spell.classes.toLocaleLowerCase().includes(classFilter) &&
      spell.level != null &&
      spell.level >= levelFilter.min &&
      spell.level <= levelFilter.max,
  );

  // Check if a spellcard has more than 1500 characters. If yes, it needs to have a second card to display the full text.
  // That also shifts all the other cards one position further.
  // const bigTextCards: Spelldata[] = filteredSpells.filter((card) => {
  filteredSpells.forEach((card) => {
    if (card.description && card.description.length > 1500) {
      const secondCard: Spelldata = { ...card };
      secondCard.spell_name += " (2/2)";
      if (secondCard.description) {
        const descriptionLines: string[] = secondCard.description.split("\n");
        const halfOfLines: number = Math.ceil(descriptionLines.length / 2);
        secondCard.halfDescription = descriptionLines
          .slice(halfOfLines)
          .join("\n");
        card.halfDescription = descriptionLines
          .slice(0, halfOfLines)
          .join("\n");
      }
      filteredSpells.push(secondCard);
      // return true;
    }
  });
  // console.log("Cards with too much text, split into two cards:", bigTextCards);

  // Sort spell cards first by Spell Level, then by Spell Name
  filteredSpells.sort(sortFirstByLevelThenName);

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
      <ControlPanel
        cardSize={cardSize}
        setCardSize={setCardSize}
        setCardSizeOptions={setCardSizeOptions}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        lang={lang}
        setLang={setLang}
      />

      {pageInfo.map((page) => (
        <article
          key={page.page}
          className={"page" + ` ${cardSizeOptions.pageCss}`}
        >
          {filteredSpells
            .slice(page.spellStart, page.spellEnd + 1)
            .map((spell) => {
              const ritualOnly: boolean | null =
                !spell.concentration && spell.ritual;
              const ritualAndConcentration: boolean | null =
                spell.concentration && spell.ritual;

              return (
                <section
                  key={spell.spell_name}
                  className={"card" + ` ${cardSizeOptions.cardCss}`}
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
                    {/* If description was split (= too long text, needed extra card, then display "1/2" next to spell name */}
                    {/* I tried to add it directly*/}
                    {spell.halfDescription && !spell.spell_name?.includes("2/2")
                      ? " (1/2)"
                      : null}
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
                      !spell.halfDescription && // if card is already split into two cards because of long text, don't decrease font size
                      spell.description &&
                      // description lengths are eye-balled for the moment
                      ((cardSize == "magic" &&
                        spell.description.length > 1100) ||
                        (cardSize == "max" && spell.description.length > 1200))
                        ? "fontSmall"
                        : ""
                    }
                  >
                    <Markdown>
                      {spell.halfDescription
                        ? spell.halfDescription
                        : spell.description}
                    </Markdown>
                  </main>
                  <footer>
                    {spell.material ? (
                      <span className="material">
                        <em>{spell.material}</em>
                      </span>
                    ) : null}
                    <span>{spell.school}</span>
                    {/* some spells can be cast by ALL classes. the list is too long to fit into one line, so decrease the font size in that case */}
                    <span className={spell.classes && spell.classes.split(",").length > 8 ? "fontSmall" : ""}>{spell.classes}</span>
                  </footer>
                </section>
              );
            })}
        </article>
      ))}
    </>
  );
};

export default App;
