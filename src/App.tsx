// DATA
import type { Spelldata, CardSizeCss, FilterLevel } from "./types";
import { data as srdData } from "./data"; // SRD spells
import { customData } from "./customData"; // custom spells
import { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import { mdTransform } from "./utils"; // my own markdown -> html
import "./App.css";

const App = () => {
  const [cardSize, setCardSize] = useState<string>("max"); // "max" | "magic" | "tarot"
  const [cardSizeCssClass, setCardSizeCssClass] = useState<CardSizeCss>({
    cardSizePageCss: "page-maxsize",
    cardSizeCardCss: "card-maxsize",
    cardsPerPage: 9,
  });
  const [classFilter, setClassFilter] = useState<string>("wizard");
  const [levelFilter, setLevelFilter] = useState<FilterLevel>({
    min: 0,
    max: 1,
  });
  const data: Spelldata[] = srdData.concat(customData); // all spells

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

  const numOfPages: number = Math.ceil(
    filteredSpells.length / cardSizeCssClass.cardsPerPage,
  );

  return (
    <>
      {cardSize}
      {numOfPages}
      <article className={"page" + ` ${cardSizeCssClass.cardSizePageCss}`}>
        {filteredSpells.map((spell) => {
          const ritualOnly: boolean | null =
            !spell.concentration && spell.ritual;
          const ritualAndConcentration: boolean | null =
            spell.concentration && spell.ritual;

          return (
            <section
              className={"card" + ` ${cardSizeCssClass.cardSizeCardCss}`}
            >
              {spell.concentration && <span className="concentration">C</span>}
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
              <main>{mdTransform(spell.description)}</main>
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
          setCardSizeCssClass={setCardSizeCssClass}
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
        />
      </article>
    </>
  );
};

export default App;
