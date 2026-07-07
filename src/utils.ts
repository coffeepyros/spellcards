import type { Spelldata } from "./types";

// Sorts spell cards first by spell level, then by spell name
export function sortFirstByLevelThenName(a: Spelldata, b: Spelldata) {
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
}

// Self-created Markdown parser - worked for vanilla JS version of this card generator
// but after switching to React it had to be replaced by the markdown-to-jsx npm package
// Kept it here, for who knows what.
export function mdTransform(markdown: string | null) {
  if (markdown == null) return "";
  const numOfStars = markdown.match(/\*\*/g);
  if (numOfStars && numOfStars.length > 0) {
    for (
      let tagNumber: number = 1; // keeps track if opening or closing markdown
      tagNumber <= numOfStars.length;
      tagNumber++
    ) {
      if (tagNumber % 2 != 0) {
        markdown = markdown.replace("**", "<strong>"); // the first ** is replaced by opening strong tag
      } else {
        markdown = markdown.replace("**", "</strong>"); // the second ** is replaced by a closing strong tag
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
