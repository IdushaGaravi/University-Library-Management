import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { count, eq, sum } from "drizzle-orm";

const DashboardStats = async () => {
  const [{ borrowedCount }] = await db
    .select({ borrowedCount: count() })
    .from(borrowRecords)
    .where(eq(borrowRecords.status, "BORROWED"));

  const [{ userCount }] = await db
    .select({ userCount: count() })
    .from(users);

  const [{ totalCopies }] = await db
    .select({ totalCopies: sum(books.totalCopies) })
    .from(books);

  const stats = [
    { label: "Borrowed Books", value: borrowedCount },
    { label: "Total Users", value: userCount },
    { label: "Total Books", value: totalCopies ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl bg-white p-6">
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-dark-800">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
