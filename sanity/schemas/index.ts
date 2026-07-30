import type { SchemaTypeDefinition } from "sanity";
import { property } from "./property";
import { builder, faq, insight, locality, teamMember, testimonial } from "./documents";
import { homepage, siteSettings } from "./singletons";
import {
  compareRowObject,
  glassFileObject,
  nearbyObject,
  pillarObject,
  priceRowObject,
  processStepObject,
  seoObject,
  socialObject,
  statObject,
} from "./objects";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  property,
  builder,
  locality,
  teamMember,
  testimonial,
  insight,
  faq,
  // Singletons
  homepage,
  siteSettings,
  // Reusable objects
  seoObject,
  statObject,
  pillarObject,
  processStepObject,
  compareRowObject,
  glassFileObject,
  priceRowObject,
  nearbyObject,
  socialObject,
];
