import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/lib/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";
import { leadsTool } from "@/sanity/leadsTool";

/** Documents there should only ever be one of. */
const SINGLETONS = new Set(["homepage", "siteSettings"]);

export default defineConfig({
  name: "roar-realty",
  title: "Roar Realty",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu — they're reachable
    // from their pinned sidebar entries instead.
    templates: (prev) => prev.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "delete")
        : prev,
  },
  tools: (prev) => [leadsTool, ...prev],
  plugins: [
    structureTool({ structure }),
    // GROQ playground — handy for debugging, harmless in production.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
