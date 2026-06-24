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
  const [spellsToDisplay, setSpellsToDisplay] = useState<Spelldata[]>(data);

  const numOfPages: number = Math.ceil(
    spellsToDisplay.length / cardSizeCssClass.cardsPerPage,
  );

  console.log(numOfPages);

  function filterSpells() {
    console.log("Filtering spells...");
    const filteredSpells: Spelldata[] = data.filter(
      (spell) =>
        spell.classes != null &&
        spell.classes.includes(classFilter) &&
        spell.level != null &&
        spell.level >= levelFilter.min &&
        spell.level <= levelFilter.max,
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
    setSpellsToDisplay(filteredSpells);
  }

  return (
    <>
      {cardSize}
      {numOfPages}
      <ControlPanel
        cardSize={cardSize}
        setCardSize={setCardSize}
        setCardSizeCssClass={setCardSizeCssClass}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
      />
    </>
  );
};

export default App;
