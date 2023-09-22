import { db, genre } from "./index";

const genres = [
  {
    name: "Science Fiction",
    slug: "science-fiction",
    description:
      "Science fiction is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life. Science fiction can trace its roots to ancient mythology. <a href='https://en.wikipedia.org/wiki/Science_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Mystery",
    slug: "mystery",
    description:
      "Mystery is a fiction genre where the nature of an event, usually a murder or other crime, remains mysterious until the end of the story. Often within a closed circle of suspects, each suspect is usually provided with a credible motive and a reasonable opportunity for committing the crime. <a href='https://en.wikipedia.org/wiki/Mystery_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Historical Fiction",
    slug: "historical-fiction",
    description:
      "Historical fiction is a literary genre in which the plot takes place in a setting related to the past events, but is fictional. <a href='https://en.wikipedia.org/wiki/Historical_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Romance",
    slug: "romance",
    description:
      "A romance novel or romantic novel generally refers to a type of genre fiction novel which places its primary focus on the relationship and romantic love between two people, and usually has an 'emotionally satisfying and optimistic ending.' <a href='https://en.wikipedia.org/wiki/Romance_novel' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    description:
      "Fantasy literature is literature set in an imaginary universe, often but not always without any locations, events, or people from the real world. Magic, the supernatural and magical creatures are common in many of these imaginary worlds. Fantasy literature may be directed at both children and adults. <a href='https://en.wikipedia.org/wiki/Fantasy_literature' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Thriller",
    slug: "thriller",
    description:
      "Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction. Thrillers are characterized and defined by the moods they elicit, giving their audiences heightened feelings of suspense, excitement, surprise, anticipation and anxiety. <a href='https://en.wikipedia.org/wiki/Thriller_(genre)' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Young Adult",
    slug: "young-adult",
    description:
      "Young adult fiction is fiction written for readers from 12 to 18 years of age. The term YA was first used regularly in the 1960s in the United States. The YA category includes most of the genres found in adult fiction, with themes that include friendship, sexuality, drugs and alcohol, and sexual and gender identity. <a href='https://en.wikipedia.org/wiki/Young_adult_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Horror",
    slug: "horror",
    description:
      "Horror is a genre of fiction that is intended to disturb, frighten or scare. Horror is often divided into the sub-genres of psychological horror and supernatural horror, which are in the realm of speculative fiction. <a href='https://en.wikipedia.org/wiki/Horror_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Short story",
    slug: "short-story",
    description:
      "A short story, also known as a nouvelle, is a piece of prose fiction that can typically be read in a single sitting and focuses on a self-contained incident or series of linked incidents, with the intent of evoking a single effect or mood. <a href='https://en.wikipedia.org/wiki/Short_story' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Comedy",
    slug: "comedy",
    description:
      "Comedy is a genre that prioritizes humor and laughter, aiming to entertain and amuse the audience. The stories often revolve around funny situations, comedic misunderstandings, witty dialogue, or humorous characters.",
  },
  {
    name: "Action",
    slug: "action",
    description:
      "Action fiction is a literary genre that focuses on stories that involve high-stakes, high-energy, and fast-paced events. This genre includes a wide range of subgenres, such as spy novels, adventure stories, tales of terror and intrigue and mysteries. <a href='https://en.wikipedia.org/wiki/Action_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Adventure",
    slug: "adventure",
    description:
      "Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement. Some adventure fiction also satisfies the literary definition of romance fiction. <a href='https://en.wikipedia.org/wiki/Adventure_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Poetry",
    slug: "poetry",
    description:
      "A genre of literature that uses aesthetic and rhythmic qualities of language to evoke meanings in addition to, or in place of, prosaic ostensible meaning. It traditionally follows specific forms but can also be free-form.",
  },
  {
    name: "Philosophy",
    slug: "philosophy",
    description:
      "A genre that explores fundamental questions about existence, reality, knowledge, values, reason, mind, and ethics. It originates from the works of ancient philosophers.",
  },
  {
    name: "Spiritual",
    slug: "spiritual",
    description:
      "This genre includes sacred texts, spiritual guides, and works of religious philosophy. It may explore belief systems, personal development, and existential questions.",
  },
  {
    name: "Classic Literature",
    slug: "classic-iterature",
    description:
      "A genre that includes works of high literary merit, widely studied in academic institutions, often originating from ancient or traditional literary canon.",
  },
  {
    name: "Political",
    slug: "Political",
    description:
      "A genre that explores political systems, ideologies, and movements.",
  },
  {
    name: "Satire",
    slug: "satire",
    description:
      "A genre of literature that uses humor, irony, exaggeration, or ridicule to expose and criticize people's stupidity or vices, often in the context of contemporary politics and other topical issues.",
  },
  {
    name: "Folklore",
    slug: "folklore",
    description:
      "This genre includes traditional stories, myths, and legends passed down within a culture. These works often contain moral or philosophical lessons.",
  },
  {
    name: "Western",
    slug: "western",
    description:
      "A genre set in the American West during the late 18th to late 19th century. These stories often focus on rugged individualism and the frontier spirit.",
  },
  {
    name: "Crime",
    slug: "crime",
    description:
      "This genre focuses on the dramatization of crimes, their detection, criminals, and their motives. It's distinguished from mainstream fiction and other genres by its focus on criminal acts and the pursuit of justice.",
  },
  {
    name: "Tragedy",
    slug: "tragedy",
    description:
      "A genre of dramatic works that is characterized by its serious and dignified style, and typically presents the downfall of its main character(s) due to their own errors or flaws.",
  },
  {
    name: "Magical Realism",
    slug: "magical-realism",
    description:
      "A genre in which fantastical elements blend with the real world. The narrative remains grounded in reality, but expands to incorporate aspects of the magical or the extraordinary.",
  },
  {
    name: "Dystopian",
    slug: "dystopian",
    description:
      "Dystopian and Utopian genres are characterized by their exploration of hypothetical societies, with dystopian narratives typically featuring oppressive, nightmarish settings, and utopian narratives presenting idyllic, harmonious environments.",
  },
  {
    name: "Paranormal",
    slug: "paranormal",
    description:
      "The Paranormal genre encompasses stories that introduce elements beyond scientific understanding, often involving supernatural creatures or occurrences, like ghosts, vampires, and werewolves.",
  },
  {
    name: "Detective",
    slug: "detective",
    description:
      "Detective genre revolves around a central character, often a detective or private investigator, who undertakes the task of solving a crime or unraveling a mystery.",
  },
  {
    name: "Post-Apocalyptic",
    slug: "post-apocalyptic",
    description:
      "Post-Apocalyptic genre features narratives set in the aftermath of a global catastrophe, exploring themes of survival, societal rebuilding, and human resilience.",
  },
];

const main = async () => {
  console.log("Seeding data...");

  await db
    .insert(genre)
    .values(genres)
    .onConflictDoNothing({ target: genre.slug });
};

void main();
