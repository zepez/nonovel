type TruncatedObject = {
  [key: string]:
    | string
    | number
    | boolean
    | TruncatedObject
    | undefined
    | null
    | Date;
};

export function truncateLog(
  input: TruncatedObject,
  limit = 100
): TruncatedObject {
  const output: TruncatedObject = {};

  for (const key in input) {
    if (typeof input[key] === "string") {
      output[key] =
        (input[key] as string).length > limit
          ? (input[key] as string).substr(0, limit) + "..."
          : input[key];
    } else if (typeof input[key] === "object" && input[key] !== null) {
      output[key] = truncateLog(input[key] as TruncatedObject, limit);
    } else {
      output[key] = input[key];
    }
  }

  return output;
}
