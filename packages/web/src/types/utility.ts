export type NotUndefinedOrNull<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined | null>;
};
