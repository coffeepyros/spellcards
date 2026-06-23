// DATA
import type { Spelldata, CardSizeCss, FilterLevel } from "./types";
import { data as srdData } from "./data"; // SRD spells
import { customData } from "./customData"; // custom spells
import { mdTransform } from "./utils"; // my own markdown -> html
import { useState } from "react";
import "./App.css";
import ControlPanel from "./components/ControlPanel";

const App = () => {
  const data: Spelldata[] = srdData.concat(customData); // all spells
  const [cardSize, setCardSize] = useState<string>("max"); // "max" | "magic" | "tarot"
  const [cardSizeCssClass, setCardSizeCssClass] = useState<CardSizeCss>({
    cardSizePageCss: "page-maxsize",
    cardSizeCardCss: "card-maxsize",
    cardsPerPage: 9,
  });
  const [classFilter, setClassFilter] = useState<string>("wizard");
  const [levelFilter, setLevelFilter] = useState<FilterLevel>({
    min: 0,
    max: 0,
  });

  return (
    <>
      {cardSize}
      <ControlPanel
        cardSize={cardSize}
        setCardSize={setCardSize}
        setCardSizeCssClass={setCardSizeCssClass}
        setClassFilter={setClassFilter}
        setLevelFilter={setLevelFilter}
      />
    </>
  );
};

export default App;
