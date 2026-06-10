export function mdTransform(markdown: string | null) {
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
