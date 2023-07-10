import { customType } from "drizzle-orm/pg-core";

export const numberNumeric = customType<{
  data: number;
  config: { precision: number; scale: number };
}>({
  dataType(config) {
    if (config?.precision && config?.scale)
      return `numeric(${config.precision}, ${config.scale})`;

    return "numeric";
  },
  fromDriver(value: unknown): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value);

    return 0;
  },
});
