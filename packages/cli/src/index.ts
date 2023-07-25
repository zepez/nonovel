import { Command } from "commander";
import { version } from "../package.json";
import { epubCommand } from "./epub";

const program = new Command();

program.name("nn").description("NoNovel internal CLI").version(version);

program
  .command("epub")
  .description("Parse an epub file and push it to a database")
  .argument("<path>", "absolute path to epub file")
  .action(epubCommand);

program.parse(process.argv);
