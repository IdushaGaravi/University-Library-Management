import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import config from "@/lib/config";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getCoverImageSrc = (coverUrl: string) => {
  const normalized = coverUrl?.trim() || "https://placehold.co/400x600.png";
  const isFullUrl = /^https?:\/\//i.test(normalized);

  return isFullUrl
    ? normalized
    : `${config.env.imagekit.urlEndpoint}${normalized}`;
};

const formatShortDate = (date: string | Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      })
    : "—";

const RecentBooksPreview = async () => {
  const recentBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(6);

  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-800">Recently Added Books</h3>
        <Link
          href="/admin/books"
          className="text-sm font-medium text-blue-500 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <Link
        href="/admin/books/new"
        className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-gray-300 p-4 text-gray-500 hover:bg-gray-50"
      >
        <Plus className="size-5" />
        Add New Book
      </Link>

      <div className="mt-4 flex flex-col gap-3">
        {recentBooks.map((book) => (
          <div key={book.id} className="flex items-center gap-3">
            <Image
              src={getCoverImageSrc(book.coverUrl)}
              alt={book.title}
              width={33}
              height={48}
              className="rounded-sm object-fill"
            />
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-medium text-dark-800">
                {book.title}
              </span>
              <span className="text-xs text-gray-400">
                By {book.author} • {book.genre}
              </span>
              <span className="mt-1 text-xs text-gray-400">
                {formatShortDate(book.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {recentBooks.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            No books added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentBooksPreview;
