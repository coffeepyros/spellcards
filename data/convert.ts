import type { BunFile } from "bun";

// READING SRD MARKDOWN FILE
const mdFile: BunFile = Bun.file("all_spells.md");
const markdown: string = await mdFile.text();
const spells: string[] = markdown.split("#"); // separating spells by headline
spells.shift(); // no info before first "#"

// TAG LIST
const allTags: string[] = ["damage", "acid"];

// CONVERTING MARKDOWN -> JSON
const allSpellsJson = [];

for (let i = 0; i < 5; i++) {
  const spellDetails: string[] = spells[i].trim().split("\r\n\r\n");
  // console.log(spellDetails);

  let level, school, classes: string;

  if (spellDetails[1].includes("Cantrip")) {
    [school, level, classes] = spellDetails[1]
      .replaceAll("*", "")
      .replaceAll(", ", ",")
      .split(" ");
  } else {
    [, level, school, classes] = spellDetails[1]
      .replaceAll("*", "")
      .replaceAll(", ", ",") // remove space from class list, so split works in next step
      .split(" ");
  }

  const components = spellDetails[4].replace("**Components:** ", "");
  const materialStart = spellDetails[4].indexOf("(");

  const spellDetailsJson = {
    spell_name: spellDetails[0],
    level: level != "Cantrip" ? Number(level) : 0,
    school,
    classes: classes.slice(1, -2).replaceAll(",", ", "), // removing "(" and ")"
    casting_time: spellDetails[2].replace("**Casting Time:** ", ""),
    range: spellDetails[3].replace("**Range:** ", ""),
    components: components.includes("M (")
      ? components.slice(0, components.indexOf("M (") + 1)
      : components,
    material: components.includes("M (")
      ? spellDetails[4].slice(materialStart + 1, -1)
      : null,
    duration: spellDetails[5].replace("**Duration:** ", ""),
    description: spellDetails[6],
    tags: "",
  };

  const spellTags: string[] = [];
  allTags.forEach((tag) => {
    if (spellDetailsJson.description.toLocaleLowerCase().includes(tag))
      spellTags.push(tag);
  });
  spellDetailsJson.tags = spellTags.join(", ");

  console.log(spellDetailsJson);
  allSpellsJson.push(spellDetailsJson);
}
const jsonAsString = JSON.stringify(allSpellsJson);
await Bun.write("all_spells.json", jsonAsString);
