import { db } from "@nonovel/db";
import { placeholder, sql } from "drizzle-orm";

export const getOmniSearchResultPrepared = db
  .select({
    type: sql<"project">`type`,
    name: sql<string>`name`,
    slug: sql<string>`slug`,
  })
  .from(
    sql`(
      SELECT 'project' AS type, name, slug
      FROM project
      WHERE name ILIKE '%' || ${placeholder("query")} || '%'
    ) as combined_table`
  )
  .prepare("get_omni_search_result_prepared");

// uncomment below for searching by username as well
// this is commented out because there isn't much
// use-case for searching profiles... yet

// export const getOmniSearchResultPrepared = db
//   .select({
//     type: sql<"profile" | "project">`type`,
//     name: sql<string>`name`,
//     slug: sql<string>`slug`,
//   })
//   .from(
//     sql`(
//       SELECT 'profile' AS type, username AS name, username AS slug
//       FROM profile
//       WHERE username ILIKE '%' || ${placeholder("query")} || '%'

//       UNION ALL

//       SELECT 'project' AS type, name, slug
//       FROM project
//       WHERE name ILIKE '%' || ${placeholder("query")} || '%'
//     ) as combined_table`
//   )
//   .prepare("get_omni_search_result_prepared");
