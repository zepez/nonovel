import { promptProjectKnowledge, promptProjectGenreSelect } from "../prompt";

export interface ChainProjectGenreOptions {
  title: string;
  author: string;
  genres: string[];
}

export const chainProjectGenre = async ({
  title,
  author,
  genres: availableGenres,
}: ChainProjectGenreOptions) => {
  try {
    const knowledgeString = await promptProjectKnowledge({ title, author });

    const knowledge = knowledgeString.toLowerCase() === "true";
    if (!knowledge)
      throw new Error(
        `Can not select genres. Not enough information known about ${title} by ${author}.`
      );

    // convert all available genres to lowercase
    const lowerAvailableGenres = availableGenres.map((g) => g.toLowerCase());

    // prompt ai to select genres
    const generatedGenreString = await promptProjectGenreSelect({
      title,
      author,
      genres: lowerAvailableGenres,
    });

    // convert generated genres to lowercase array
    const lowerGeneratedGenreArray = generatedGenreString
      .split(",")
      .map((s) => s.trim().toLowerCase());

    // filter out any genres that are not in the available genres
    const genreArray = lowerGeneratedGenreArray.filter((g) =>
      lowerAvailableGenres.includes(g)
    );

    // if no genres were selected, throw an error
    if (genreArray.length < 1) {
      throw new Error(
        `Can not select genres. Response returned, but nothing selected for ${title} by ${author}.`
      );
    }

    return genreArray;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    return [];
  }
};
