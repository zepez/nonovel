import fs from "fs";
import path from "path";
import { ReactElement, JSXElementConstructor } from "react";
import { compileMDX } from "next-mdx-remote/rsc";

const rootDirectory = path.join(process.cwd(), "src", "articles");

interface CompileMDXResult {
  meta: Frontmatter;
  content: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}

interface Frontmatter {
  slug: string;
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
}

export const getPostBySlug = async (
  slug: string
): Promise<CompileMDXResult> => {
  const realSlug = slug.replace(/\.mdx$/, "");
  const filePath = path.join(rootDirectory, `${realSlug}.mdx`);

  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });

  const { frontmatter, content } = (await compileMDX({
    source: fileContent,
    options: { parseFrontmatter: true },
  })) as { frontmatter: Frontmatter; content: ReactElement };

  return { meta: { ...frontmatter, slug: realSlug }, content };
};

export const getAllPostsMeta = async () => {
  const directories = fs
    .readdirSync(rootDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const posts = [];

  for (const directory of directories) {
    const dirPath = path.join(rootDirectory, directory);
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullFileName = `${directory}/${file}`;
      const { meta } = await getPostBySlug(fullFileName);
      posts.push(meta);
    }
  }

  return posts;
};
