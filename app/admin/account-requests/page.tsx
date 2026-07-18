import AccountRequests from "@/components/admin/AccountRequests";
import { ArrowUpDown } from "lucide-react";

const Page = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Account Registration Requests</h2>

        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          Oldest to Recent
          <ArrowUpDown className="size-4" />
        </button>
      </div>

      <AccountRequests />
    </section>
  );
};

export default Page;
