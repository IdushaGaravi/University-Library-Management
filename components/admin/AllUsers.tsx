import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";
import config from "@/lib/config";
import { asc, count, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import RoleDropdown from "@/components/admin/RoleDropdown";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getCardUrl = (universityCard: string) => {
  const normalized = universityCard?.trim() || "";
  const isFullUrl = /^https?:\/\//i.test(normalized);

  return isFullUrl
    ? normalized
    : `${config.env.imagekit.urlEndpoint}${normalized}`;
};

const AllUsers = async () => {
  const allUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      role: users.role,
      createdAt: users.createdAt,
      booksBorrowed: count(borrowRecords.id),
    })
    .from(users)
    .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
    .groupBy(
      users.id,
      users.fullName,
      users.email,
      users.universityId,
      users.universityCard,
      users.role,
      users.createdAt
    )
    .orderBy(asc(users.fullName));

  return (
    <div className="mt-7 w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead>Name</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Books Borrowed</TableHead>
            <TableHead>University ID No</TableHead>
            <TableHead>University ID Card</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3 font-medium">
                <div className="flex size-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
                  {getInitials(user.fullName)}
                </div>
                <div className="flex flex-col">
                  <span>{user.fullName}</span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </TableCell>
              <TableCell>
                <RoleDropdown userId={user.id} role={user.role ?? "USER"} />
              </TableCell>
              <TableCell className="text-gray-500">
                {user.booksBorrowed}
              </TableCell>
              <TableCell className="text-gray-500">
                {user.universityId}
              </TableCell>
              <TableCell>
                <a
                  href={getCardUrl(user.universityCard)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                >
                  View ID Card <ExternalLink className="size-3.5" />
                </a>
              </TableCell>
              <TableCell>
                <DeleteUserButton userId={user.id} userName={user.fullName} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllUsers;
