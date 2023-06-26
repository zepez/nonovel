import { z } from "zod";
import { serializeError } from "serialize-error";

export type ServerErrorName = "GetResourceError" | "UpdateResourceError";
export type ServerErrorType = Error | ServerError | z.ZodError | string;
export type ServerStatusCode = 400 | 401 | 404 | 500;

export class ServerError extends Error {
  name: ServerErrorName;
  status: ServerStatusCode;
  validation: z.ZodIssue[] | [];

  constructor(
    name: ServerErrorName,
    err?: ServerErrorType,
    status?: ServerStatusCode
  ) {
    super();
    Object.setPrototypeOf(this, ServerError.prototype);

    this.name = name;
    this.status = status ?? 500;
    this.validation = [];

    if (typeof err === "string") {
      this.message = err;
    } else if (err instanceof z.ZodError) {
      this.message = "Validation Error";
      this.status = 400;
      this.validation = err.issues;
    } else if (err instanceof ServerError) {
      Object.keys(err).forEach((key: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (this as any)[key] = (err as any)[key];
      });
    } else if (err instanceof Error) {
      this.message = err.message.length ? err.message : "Unknown Error";
    }
  }

  serialize() {
    return serializeError(this);
  }
}
