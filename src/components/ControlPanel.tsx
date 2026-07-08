// DATA
import type { CardSizeOptions, FilterLevel } from "../types";
import { charClasses } from "../customData";
import "./ControlPanel.scss";

type Props = {
  cardSize: string;
  setCardSize: (state: string) => void;
  setCardSizeOptions: (state: CardSizeOptions) => void;
  classFilter: string;
  setClassFilter: (state: string) => void;
  levelFilter: FilterLevel;
  setLevelFilter: (state: FilterLevel) => void;
};

const ControlPanel = ({
  cardSize,
  setCardSize,
  setCardSizeOptions,
  classFilter,
  setClassFilter,
  levelFilter,
  setLevelFilter,
}: Props) => {
  // CONTROL PANEL

  function changeCardSizeHandler(event: React.ChangeEvent) {
    const changedSize: string = (event.currentTarget as HTMLSelectElement)
      .value;
    console.log("Card size changed!", changedSize);

    switch (changedSize) {
      case "max":
        setCardSize("max");
        setCardSizeOptions({
          pageCss: "page-maxsize",
          cardCss: "card-maxsize",
          cardsPerPage: 9,
        });
        break;
      case "magic":
        setCardSize("magic");
        setCardSizeOptions({
          pageCss: "page-magic",
          cardCss: "card-magic",
          cardsPerPage: 9,
        });
        break;
      case "tarot":
        setCardSize("tarot");
        setCardSizeOptions({
          pageCss: "page-tarot",
          cardCss: "card-tarot",
          cardsPerPage: 4,
        });
        break;
    }
  }

  function filterClassHandler(event: React.ChangeEvent) {
    const selectedClass: string = (event.currentTarget as HTMLSelectElement)
      .value;
    setClassFilter(selectedClass);
  }

  function filterLevelHandler(event: React.ChangeEvent) {
    const target = event.currentTarget as HTMLSelectElement;
    const selectedLevel: string = target.value;
    const minOrMax: string = target.name;
    // if (
    //   (minOrMax == "min" && Number(selectedLevel) <= levelFilter.max) ||
    //   (minOrMax == "max" && Number(selectedLevel) >= levelFilter.min)
    // )
    setLevelFilter({ ...levelFilter, [minOrMax]: Number(selectedLevel) });
  }

  const levelOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (num: number | string) => (
      <option key={num} value={num}>
        {num}
      </option>
    ),
  );

  return (
    <section id="control-panel">
      <label htmlFor="card-size">Card Size</label>
      <select
        id="card-size"
        onChange={changeCardSizeHandler}
        defaultValue={cardSize}
      >
        <option value="max">Maximum Size (A4)</option>
        <option value="magic">Magic Card</option>
        <option value="tarot">Tarot Card</option>
      </select>
      <label htmlFor="filter-class">Class</label>
      <select
        id="filter-class"
        defaultValue={classFilter}
        onChange={filterClassHandler}
      >
        {charClasses.map((charClass) => (
          <option key={"option-" + charClass} value={charClass.toLowerCase()}>
            {charClass}
          </option>
        ))}
      </select>{" "}
      {classFilter}
      <label htmlFor="filter-level-start">Level</label>
      <select
        id="filter-level-start"
        name="min"
        defaultValue={levelFilter.min}
        onChange={filterLevelHandler}
      >
        {levelOptions}
      </select>
      <select
        id="filter-level-end"
        name="max"
        defaultValue={levelFilter.max}
        onChange={filterLevelHandler}
      >
        {levelOptions}
      </select>
      {levelFilter.min > levelFilter.max ? (
        <p className="error">
          Error! {levelFilter.min + " > " + levelFilter.max}
        </p>
      ) : null}
      <button onClick={() => window.print()}>Print</button>
    </section>
  );
};

export default ControlPanel;
