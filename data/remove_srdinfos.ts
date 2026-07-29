import type { BunFile } from "bun";

// READING SRD MARKDOWN FILE
const source: BunFile = Bun.file("./pure_de_data.txt");
const markdown: string = await source.text();
const lines: string[] = markdown.split("\n"); // separating spells by headline
console.log(lines[0], lines[1]);

// await Bun.write("source_without_srd.txt", jsonAsString);
