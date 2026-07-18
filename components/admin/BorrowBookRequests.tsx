import ReturnDatePicker from "@/components/admin/ReturnDatePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import config from "@/lib/config";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";

const getCoverImageSrc = (coverUrl: string) => {
  const normalized = coverUrl?.trim() || "https://placehold.co/400x600.png";
  const isFullUrl = /^https?:\/\//i.test(normalized);

  return isFullUrl
    ? normalized
    : `${config.env.imagekit.urlEndpoint}${normalized}`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (date: string | Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

type DisplayStatus = "Borrowed" | "Late Return" | "Returned";

const getDisplayStatus = (
  status: "BORROWED" | "RETURNED",
  dueDate: string,
  returnDate: string | null
): DisplayStatus => {
  if (status === "RETURNED" || returnDate) return "Returned";

  const isPastDue = new Date(dueDate) < new Date();
  return isPastDue ? "Late Return" : "Borrowed";
};

const statusStyles: Record<DisplayStatus, string> = {
  Borrowed: "bg-violet-100 text-violet-700",
  "Late Return": "bg-red-100 text-red-600",
  Returned: "bg-blue-50 text-blue-700",
};

const BorrowBookRequests = async () => {
  const requests = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      bookTitle: books.title,
      bookCoverUrl: books.coverUrl,
      userFullName: users.fullName,
      userEmail: users.email,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .orderBy(desc(borrowRecords.borrowDate));

  return (
    <div className="mt-7 w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead>Book</TableHead>
            <TableHead>User Requested</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Borrowed date</TableHead>
            <TableHead>Return date</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.map((request) => {
            const displayStatus = getDisplayStatus(
              request.status,
              request.dueDate,
              request.returnDate
            );

            return (
              <TableRow key={request.id}>
                <TableCell className="flex items-center gap-3 font-medium">
                  <Image
                    src={getCoverImageSrc(request.bookCoverUrl)}
                    alt={request.bookTitle}
                    width={33}
                    height={48}
                    className="rounded-sm object-fill"
                  />
                  <span className="line-clamp-1 max-w-40">
                    {request.bookTitle}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                      {getInitials(request.userFullName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {request.userFullName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {request.userEmail}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[displayStatus]}`}
                  >
                    {displayStatus}
                  </span>
                </TableCell>

                <TableCell className="text-gray-500">
                  {formatDate(request.borrowDate)}
                </TableCell>
                <TableCell>
                  <ReturnDatePicker
                    recordId={request.id}
                    returnDate={request.returnDate}
                  />
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(request.dueDate)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BorrowBookRequests;
