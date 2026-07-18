import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarColors = [
  "bg-green-100 text-green-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
];

const AccountRequestsPreview = async () => {
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(asc(users.createdAt))
    .limit(6);

  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-800">Account Requests</h3>
        <Link
          href="/admin/account-requests"
          className="text-sm font-medium text-blue-500 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {pendingUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 p-3 text-center"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${avatarColors[index % avatarColors.length]}`}
            >
              {getInitials(user.fullName)}
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-xs font-medium text-dark-800">
                {user.fullName}
              </span>
              <span className="line-clamp-1 text-[11px] text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        ))}

        {pendingUsers.length === 0 && (
          <p className="col-span-3 py-4 text-center text-sm text-gray-400">
            No pending requests.
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountRequestsPreview;
