import { auth } from "@/auth";
import AccountRequestsPreview from "@/components/admin/AccountRequestsPreview";
import BorrowRequestsPreview from "@/components/admin/BorrowRequestsPreview";
import DashboardStats from "@/components/admin/DashboardStats";
import RecentBooksPreview from "@/components/admin/RecentBooksPreview";

const Page = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-dark-800">
          Welcome, {session?.user?.name}
        </h2>
        <p className="text-sm text-gray-500">
          Monitor all of your projects and tasks here
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <BorrowRequestsPreview />
          <AccountRequestsPreview />
        </div>

        <RecentBooksPreview />
      </div>
    </div>
  );
};

export default Page;
