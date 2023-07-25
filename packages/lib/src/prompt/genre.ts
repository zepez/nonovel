import { aiText } from "../ai";

export interface PromptSelectGenreOptions {
  title: string;
  author: string;
  genres: string[];
}

export const promptSelectGenre = ({
  title,
  author,
  genres,
}: PromptSelectGenreOptions) => {
  return aiText(
    `
    Given the following genres, please select the genres that fundamentally define
    ${title} by ${author}.
    
    ${genres.join(", ")} 
    
    Please consider the main themes, narrative, character development, 
    and the author's intent when choosing the genres. 
    
    Only select a genre if removing it would significantly 
    alter the book's identity or understanding.`
  );
};
