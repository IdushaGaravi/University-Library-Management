"use client";

import { Button } from "@/components/ui/button";
import { approveUser, rejectUser } from "@/lib/admin/actions/userStatus";
import { XCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  userId: string;
  userName: string;
}

const AccountRequestActions = ({ userId, userName }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveUser(userId);

      if (result.success) {
        toast.success("Account approved", {
          description: `${userName} can now access the library.`,
        });
      } else {
        toast.error("Failed to approve", { description: result.error });
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectUser(userId);

      if (result.success) {
        toast.success("Account rejected", {
          description: `${userName}'s request has been rejected.`,
        });
      } else {
        toast.error("Failed to reject", { description: result.error });
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        disabled={isPending}
        onClick={handleApprove}
        className="bg-green-100 text-green-700 hover:bg-green-200"
      >
        Approve Account
      </Button>

      <button disabled={isPending} onClick={handleReject}>
        <XCircle className="size-5 text-red-500 hover:text-red-700" />
      </button>
    </div>
  );
};

export default AccountRequestActions;
