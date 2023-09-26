// https://github.com/blakeembrey/change-case/blob/master/packages/title-case/src/index.ts

const SMALL_WORDS =
  /\b(?:an?d?|a[st]|because|but|by|en|for|i[fn]|neither|nor|o[fnr]|only|over|per|so|some|tha[tn]|the|to|up|upon|vs?\.?|versus|via|when|with|without|yet)\b/i;
const TOKENS = /[^.\s:–]+|—|-|[.]+|[.;:!?]|\s+/g;
const WHITESPACE = /\s/;
const ALPHANUMERIC_PATTERN = /[A-Za-z0-9\u00C0-\u00FF]/;
const ROMAN_NUMERAL =
  /^M*(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})(?!\.)$/;
const PUNCTUATION = /[.;:!?–—-]/;

const isRomanNumeral = (token: string) => {
  return (
    ROMAN_NUMERAL.test(token.toUpperCase()) ||
    (ROMAN_NUMERAL.test(token.slice(0, -1).toUpperCase()) &&
      token.endsWith("."))
  );
};

const capitalizeToken = (token: string) => {
  return token.replace(ALPHANUMERIC_PATTERN, (m) => m.toUpperCase());
};

export const toTitleCase = (input: string) => {
  let result = "";
  let m: RegExpExecArray | null;
  let capitalizeNext = false;

  while ((m = TOKENS.exec(input.toLowerCase())) !== null) {
    const { 0: token, index } = m;

    // Ignore / preserve whitespace
    if (WHITESPACE.test(token)) {
      result += token;
      continue;
    }

    // Uppercase roman numerals
    if (isRomanNumeral(token) && token !== ".") {
      result += token.toUpperCase();
      continue;
    }

    // Always capitalize the first word in a title
    if (!input[index - 1]) {
      result += capitalizeToken(token);
      continue;
    }

    // Handle punctuation
    if (PUNCTUATION.test(token)) {
      capitalizeNext = true;

      // remove trailing period
      if (token.length + index === input.length && token === ".") continue;
      // remove duplicate punctuation
      if (input[index - 1] && PUNCTUATION.test(input[index - 1])) continue;

      result += capitalizeToken(token);
      continue;
    }

    // The previous token was punctuation
    if (capitalizeNext) {
      result += capitalizeToken(token);
      capitalizeNext = false;
      continue;
    }

    // Do not capitalize small words
    if (SMALL_WORDS.test(token.toLowerCase())) {
      result += token.toLowerCase();
      continue;
    }

    // If all else fails, capitalize the token
    result += capitalizeToken(token);
    continue;
  }

  return result;
};
