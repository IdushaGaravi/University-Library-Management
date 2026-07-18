"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/lib/admin/actions/user";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  userId: string;
  userName: string;
}

const DeleteUserButton = ({ userId, userName }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteUser(userId);

    setIsDeleting(false);

    if (result.success) {
      toast.success("User deleted", {
        description: `${userName} has been removed.`,
      });
    } else {
      toast.error("Delete failed", {
        description: result.error,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>
          <Trash2 className="size-4 text-red-500 hover:text-red-700" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-2 border-red-200 bg-white sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {userName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            user account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserButton;
