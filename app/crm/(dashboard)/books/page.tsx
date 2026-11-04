import type { Metadata } from "next";
import { BooksWorkspace } from "@/components/books/BooksWorkspace";

export const metadata: Metadata = { title: "Books" };

export default function BooksPage() {
  return <BooksWorkspace />;
}
