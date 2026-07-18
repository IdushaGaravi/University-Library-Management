import AccountRequestActions from "@/components/admin/AccountRequestActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import config from "@/lib/config";
import { asc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";

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

const AccountRequests = async () => {
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(asc(users.createdAt));

  return (
    <div className="mt-7 w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead>Name</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>University ID No</TableHead>
            <TableHead>University ID Card</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pendingUsers.map((user) => (
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
                <AccountRequestActions
                  userId={user.id}
                  userName={user.fullName}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pendingUsers.length === 0 && (
        <p className="p-7 text-center text-gray-500">
          No pending account requests.
        </p>
      )}
    </div>
  );
};

export default AccountRequests;
