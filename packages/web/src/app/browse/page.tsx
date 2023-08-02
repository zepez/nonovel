import { Metadata } from "next";
import BrowsePage from "./[genre]/page";

export function generateMetadata(): Metadata {
  return {
    title: "Browse all novels",
    description: "Browse all novels on NoNovel.io.",
  };
}

export default BrowsePage;
