// DATA
import type { CardSizeCss, FilterLevel } from "../types";
import "./ControlPanel.scss";

type Props = {
  // cardSize: string;
  setCardSize: (p: string) => void;
  setCardSizeCssClass: (p: object) => void;
  setClassFilter: (p: string) => void;
  setLevelFilter: (p: object) => void;
};

const ControlPanel = ({
  setCardSize,
  setCardSizeCssClass,
  setClassFilter,
  setLevelFilter,
}: Props) => {
  // CONTROL PANEL
  const charClasses: string[] = [
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

  function changeCardSizeHandler(event: Event) {
    const target: HTMLSelectElement = event.currentTarget;
    console.log("Card size changed!", target.value);

    switch (target.value) {
      case "max":
        setCardSize("max");
        setCardSizeCssClass({
          cardSizePageCss: "page-maxsize",
          cardSizeCardCss: "card-maxsize",
          cardsPerPage: 9,
        });
        break;
      case "magic":
        setCardSize("magic");
        setCardSizeCssClass({
          cardSizePageCss: "page-magic",
          cardSizeCardCss: "card-magic",
          cardsPerPage: 9,
        });
        break;
      case "tarot":
        setCardSize("tarot");
        setCardSizeCssClass({
          cardSizePageCss: "page-tarot",
          cardSizeCardCss: "card-tarot",
          cardsPerPage: 4,
        });
        break;
    }
  }

  return (
    <section id="control-panel">
      <label htmlFor="">Card Size</label>
      <select onChange={changeCardSizeHandler}>
        {charClasses.map((charClass) => (
          <option value={charClass.toLocaleLowerCase()}>{charClass}</option>
        ))}
        <option>Buh</option>
      </select>
    </section>
  );
};

export default ControlPanel;
