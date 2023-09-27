import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges provided class values using clsx and tailwind-merge.
 *
 * @param {...ClassValue} inputs - The class values to be merged.
 * @returns {string} - The merged class string.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Throws an error if any of the provided arguments is an instance of the Error class.
 * If any of the other arguments are truthy, throws a generic "Internal Server Error".
 *
 * @param {...(Error | unknown)} args - Arguments to be checked.
 * @throws {Error} - Throws an error with the message of the provided Error or a generic message.
 */
export const ec = (...args: Array<Error> | Array<unknown>) => {
  for (const arg of args) {
    if (arg instanceof Error) throw new Error(arg.message);
    else if (arg) throw new Error("Internal Server Error");
  }
};
