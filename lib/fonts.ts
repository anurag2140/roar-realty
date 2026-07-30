import { Marcellus, Cormorant_Garamond, Jost } from "next/font/google";

/** Display face — headlines, property names, stat figures. */
export const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/** Editorial italic — chapter labels, pull quotes, testimonials. */
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Body and UI. The prototype used weights 200–500. */
export const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

export const fontVariables = `${marcellus.variable} ${cormorant.variable} ${jost.variable}`;
