import "@/lib/zod-compat";
import { zodResolver as baseZodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

export function zodResolver(schema: ZodType<any, any, any>, schemaOptions?: any, resolverOptions?: any) {
  const base = baseZodResolver(schema, schemaOptions, resolverOptions);
  return async (values: any, context: any, options: any) => {
    try {
      return await base(values, context, options);
    } catch (err: any) {
      if (err?.name === "ZodError" && Array.isArray(err.issues)) {
        if (!err.errors) {
          err.errors = err.issues;
        }
        try {
          return await base(values, context, options);
        } catch {
          const errors: Record<string, any> = {};
          for (const issue of err.issues) {
            const key = issue.path.join(".") || "root";
            if (!errors[key]) {
              errors[key] = {
                type: issue.code,
                message: issue.message,
              };
            }
          }
          return { values: {}, errors };
        }
      }
      throw err;
    }
  };
}
