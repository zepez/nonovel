import { db, genre } from "./index";

const genres = [
  {
    name: "Fiction",
    slug: "fiction",
    description:
      "Fiction is any creative work, chiefly any narrative work, portraying individuals, events, or places that are imaginary, or in ways that are imaginary. Fictional portrayals are thus inconsistent with history, fact, or plausibility. <a href='https://en.wikipedia.org/wiki/Fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Narrative",
    slug: "narrative",
    description:
      "A narrative, story, or tale is any account of a series of related events or experiences, whether nonfictional or fictional. Narratives can be presented through a sequence of written or spoken words, through still or moving images, or through any combination of these. <a href='https://en.wikipedia.org/wiki/Narrative' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
    description:
      "Science fiction is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life. Science fiction can trace its roots to ancient mythology. <a href='https://en.wikipedia.org/wiki/Science_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Non-fiction",
    slug: "non-fiction",
    description:
      "Non-fiction is any document or media content that attempts, in good faith, to convey information only about the real world, rather than being grounded in imagination. Non-fiction typically aims to present topics objectively based on historical, scientific, and empirical information. <a href='https://en.wikipedia.org/wiki/Non-fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
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
    name: "Memoir",
    slug: "memoir",
    description:
      "A memoir is any nonfiction narrative writing based on the author's personal memories. The assertions made in the work are thus understood to be factual. <a href='https://en.wikipedia.org/wiki/Memoir' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Self-help",
    slug: "self-help",
    description:
      "A self-help book is one that is written with the intention to instruct its readers on solving personal problems. The books take their name from Self-Help, an 1859 best-seller by Samuel Smiles, but are also known and classified under 'self-improvement', a term that is a modernized version of self-help. <a href='https://en.wikipedia.org/wiki/Self-help_book' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Autobiography",
    slug: "autobiography",
    description:
      "An autobiography, sometimes informally called an autobio, is a self-written biography of one's own life. <a href='https://en.wikipedia.org/wiki/Autobiography' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Short story",
    slug: "short-story",
    description:
      "A short story, also known as a nouvelle, is a piece of prose fiction that can typically be read in a single sitting and focuses on a self-contained incident or series of linked incidents, with the intent of evoking a single effect or mood. <a href='https://en.wikipedia.org/wiki/Short_story' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Humor",
    slug: "humor",
    description:
      "Humour or humor is the tendency of experiences to provoke laughter and provide amusement. The term derives from the humoral medicine of the ancient Greeks, which taught that the balance of fluids in the human body, known as humours, controlled human health and emotion. <a href='https://en.wikipedia.org/wiki/Humour' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Action",
    slug: "action",
    description:
      "Action fiction is a literary genre that focuses on stories that involve high-stakes, high-energy, and fast-paced events. This genre includes a wide range of subgenres, such as spy novels, adventure stories, tales of terror and intrigue and mysteries. <a href='https://en.wikipedia.org/wiki/Action_fiction' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Children's Literature",
    slug: "childrens-literature",
    description:
      "Children's literature or juvenile literature includes stories, books, magazines, and poems that are created for children. Modern children's literature is classified in two different ways: genre or the intended age of the reader. <a href='https://en.wikipedia.org/wiki/Children's_literature' target='_blank' rel='noreferrer'>Wikipedia</a>",
  },
  {
    name: "Biography",
    slug: "biography",
    description:
      "A biography, or simply bio, is a detailed description of a person's life. It involves more than just basic facts like education, work, relationships, and death; it portrays a person's experience of these life events. <a href='https://en.wikipedia.org/wiki/Biography' target='_blank' rel='noreferrer'>Wikipedia</a>",
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
    name: "Play",
    slug: "play",
    description:
      "A genre that is intended to be performed in front of an audience. It involves the representation of the actions, deeds, and dialogue of characters in a dramatic structure.",
  },
  {
    name: "Philosophy",
    slug: "philosophy",
    description:
      "A genre that explores fundamental questions about existence, reality, knowledge, values, reason, mind, and ethics. It originates from the works of ancient philosophers.",
  },
  {
    name: "Literary Criticism",
    slug: "literary-criticism",
    description:
      "A genre encompassing works that analyze, interpret, or critique other works of literature. It focuses on studying, evaluating, and interpreting literary art.",
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
    name: "Essay",
    slug: "essay",
    description:
      "This genre is characterized by brief, non-fiction compositions that explore a particular topic or theme from the author's personal perspective.",
  },
  {
    name: "Political",
    slug: "Political",
    description:
      "A genre that explores political systems, ideologies, and movements.",
  },
  {
    name: "Science",
    slug: "science",
    description:
      "This genre includes works that systematically study the structure and behavior of the physical and natural world through observation and experiment.",
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
    name: "Gothic",
    slug: "gothic",
    description:
      "A genre that combines elements of both horror and romance, often set against dark and brooding environments like old castles or manors, and featuring complex, sometimes supernatural, narratives.",
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
    name: "Educational",
    slug: "educational",
    description:
      "This genre includes works primarily intended to educate the reader about a particular subject or skill.",
  },
  {
    name: "Magical Realism",
    slug: "magical-realism",
    description:
      "A genre in which fantastical elements blend with the real world. The narrative remains grounded in reality, but expands to incorporate aspects of the magical or the extraordinary.",
  },
];

const main = async () => {
  console.log("Seeding data...");

  await db.transaction(async (tx) => {
    await tx
      .insert(genre)
      .values(genres)
      .onConflictDoNothing({ target: genre.slug });
  });
};

void main();
