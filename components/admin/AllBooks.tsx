import DeleteBookDialog from "@/components/admin/DeleteBookDialog";
import EditBookDialog from "@/components/admin/EditBookDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import config from "@/lib/config";
import { asc } from "drizzle-orm";
import Image from "next/image";

const getCoverImageSrc = (coverUrl: string) => {
  const normalized = coverUrl?.trim() || "https://placehold.co/400x600.png";
  const isFullUrl = /^https?:\/\//i.test(normalized);

  return isFullUrl
    ? normalized
    : `${config.env.imagekit.urlEndpoint}${normalized}`;
};

const AllBooks = async () => {
  const allBooks = await db
    .select()
    .from(books)
    .orderBy(asc(books.title));

  return (
    <div className="mt-7 w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead>Book Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="flex items-center gap-3 font-medium">
                <Image
                  src={getCoverImageSrc(book.coverUrl)}
                  alt={book.title}
                  width={33}
                  height={48}
                  className="rounded-sm object-fill"
                />
                <span className="line-clamp-1">{book.title}</span>
              </TableCell>
              <TableCell className="text-dark-800">{book.author}</TableCell>
              <TableCell className="text-gray-500">{book.genre}</TableCell>
              <TableCell className="text-gray-500">
                {book.createdAt
                  ? new Date(book.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <EditBookDialog bookId={book.id} {...book} />
                  <DeleteBookDialog bookId={book.id} bookTitle={book.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllBooks;
