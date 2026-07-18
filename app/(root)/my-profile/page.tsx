import { auth, signOut } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import config from "@/lib/config";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const getCoverImageSrc = (coverUrl: string) => {
  const normalized = coverUrl?.trim() || "https://placehold.co/400x600.png";
  const isFullUrl = /^https?:\/\//i.test(normalized);

  return isFullUrl
    ? normalized
    : `${config.env.imagekit.urlEndpoint}${normalized}`;
};

const formatDate = (date: string | Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

type DisplayStatus = "Borrowed" | "Late" | "Returned";

const getDisplayStatus = (
  status: "BORROWED" | "RETURNED",
  dueDate: string,
  returnDate: string | null
): DisplayStatus => {
  if (status === "RETURNED" || returnDate) return "Returned";

  const isPastDue = new Date(dueDate) < new Date();
  return isPastDue ? "Late" : "Borrowed";
};

const statusStyles: Record<DisplayStatus, string> = {
  Borrowed: "bg-violet-100 text-violet-700",
  Late: "bg-red-100 text-red-600",
  Returned: "bg-blue-100 text-blue-700",
};

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const myBorrowedBooks = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      bookTitle: books.title,
      bookAuthor: books.author,
      bookCoverUrl: books.coverUrl,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session.user.id))
    .orderBy(desc(borrowRecords.borrowDate));

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-light-100">
          My Borrowed Books
        </h2>

        <form
          action={async () => {
            "use server";

            await signOut({ redirectTo: "/sign-in" });
          }}
        >
          <Button type="submit" variant="outline" className="bg-amber-100">
            Logout
          </Button>
        </form>
      </div>

      {myBorrowedBooks.length === 0 ? (
        <p className="mt-7 text-light-100/60">
          You haven&apos;t borrowed any books yet.
        </p>
      ) : (
        <div className="mt-7 w-full overflow-hidden">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-2/5 text-light-100">Book</TableHead>
                <TableHead className="text-light-100">Status</TableHead>
                <TableHead className="text-light-100">
                  Borrowed date
                </TableHead>
                <TableHead className="text-light-100">Due Date</TableHead>
                <TableHead className="text-light-100">
                  Return date
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {myBorrowedBooks.map((record) => {
                const displayStatus = getDisplayStatus(
                  record.status,
                  record.dueDate,
                  record.returnDate
                );

                return (
                  <TableRow key={record.id} className="hover:bg-transparent">
                    <TableCell className="flex items-center gap-3 font-medium">
                      <Image
                        src={getCoverImageSrc(record.bookCoverUrl)}
                        alt={record.bookTitle}
                        width={33}
                        height={48}
                        className="rounded-sm object-fill"
                      />
                      <div className="flex flex-col">
                        <span className="line-clamp-1 max-w-48 text-light-100">
                          {record.bookTitle}
                        </span>
                        <span className="text-xs text-light-100/60">
                          {record.bookAuthor}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[displayStatus]}`}
                      >
                        {displayStatus}
                      </span>
                    </TableCell>

                    <TableCell className="text-light-100/60">
                      {formatDate(record.borrowDate)}
                    </TableCell>
                    <TableCell className="text-light-100/60">
                      {formatDate(record.dueDate)}
                    </TableCell>
                    <TableCell className="text-light-100/60">
                      {formatDate(record.returnDate)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default Page;
