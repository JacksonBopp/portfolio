import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Lazy on purpose: constructing the client at module scope would run
// during Next's build-time "collect page data" step for any route that
// imports a module using it, including in environments (like a plain CI
// build) that never set DATABASE_URL. Deferring until the first actual
// query means importing this module is always safe; only calling it
// requires the env var.
let cached: NeonQueryFunction<false, false> | null = null;

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!cached) {
    cached = neon(process.env.DATABASE_URL!);
  }
  return cached(strings, ...values);
}
