import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import config from "@/lib/config";
import { desc, eq } from "drizzle-orm";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getCoverImageSrc = (coverUrl: string) => {
  const normalized = coverUrl?.trim() || "https://placehold.co/400x600.png";
  const isFullUrl = /^https?:\/\//i.test(normalized);

  return isFullUrl
    ? normalized
    : `${config.env.imagekit.urlEndpoint}${normalized}`;
};

const formatShortDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

const BorrowRequestsPreview = async () => {
  const requests = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      bookTitle: books.title,
      bookAuthor: books.author,
      bookGenre: books.genre,
      bookCoverUrl: books.coverUrl,
      userFullName: users.fullName,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .orderBy(desc(borrowRecords.borrowDate))
    .limit(3);

  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-800">Borrow Requests</h3>
        <Link
          href="/admin/book-requests"
          className="text-sm font-medium text-blue-500 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={getCoverImageSrc(request.bookCoverUrl)}
                alt={request.bookTitle}
                width={33}
                height={48}
                className="rounded-sm object-fill"
              />
              <div className="flex flex-col">
                <span className="line-clamp-1 text-sm font-medium text-dark-800">
                  {request.bookTitle}
                </span>
                <span className="text-xs text-gray-400">
                  By {request.bookAuthor} • {request.bookGenre}
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  {request.userFullName} · {formatShortDate(request.borrowDate)}
                </span>
              </div>
            </div>

            <Eye className="size-4 shrink-0 text-gray-400" />
          </div>
        ))}

        {requests.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            No borrow requests yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default BorrowRequestsPreview;
