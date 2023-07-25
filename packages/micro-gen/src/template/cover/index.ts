import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

interface CompileCoverFromTemplateOpts {
  title: string;
  author: string;
  background: string;
}

export const compileCoverFromTemplate = (
  opts: CompileCoverFromTemplateOpts
) => {
  const tailwindTemplatePath = path.join(__dirname, "..", "tailwind.hbs");
  const tailwindTemplateFile = fs.readFileSync(tailwindTemplatePath, "utf-8");

  const coverTemplatePath = path.join(__dirname, "cover.hbs");
  const coverTemplateFile = fs.readFileSync(coverTemplatePath, "utf-8");

  Handlebars.registerPartial("tailwind", tailwindTemplateFile);
  const coverTemplate = Handlebars.compile(coverTemplateFile);

  return coverTemplate(opts);
};
