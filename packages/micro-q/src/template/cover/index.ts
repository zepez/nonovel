import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

interface CompileCoverFromTemplateOpts {
  title: string;
  author: string;
  background: string;
  style?: 1 | 2 | 3;
}

export const compileCoverFromTemplate = (
  opts: CompileCoverFromTemplateOpts
) => {
  const { style = Math.floor(Math.random() * 3) + 1 } = opts;
  const partialPath = path.join(__dirname, "..", "partial");

  const tailwindPartialPath = path.join(partialPath, "tailwind.hbs");
  const tailwindPartialFile = fs.readFileSync(tailwindPartialPath, "utf-8");

  const coverTemplatePath = path.join(__dirname, `cover-style-${style}.hbs`);
  const coverTemplateFile = fs.readFileSync(coverTemplatePath, "utf-8");

  Handlebars.registerPartial("tailwind", tailwindPartialFile);
  const coverTemplate = Handlebars.compile(coverTemplateFile);

  return coverTemplate(opts);
};
