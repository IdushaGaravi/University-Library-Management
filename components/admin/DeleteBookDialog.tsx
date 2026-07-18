"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { deleteBook } from "@/lib/admin/actions/book";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  bookId: string;
  bookTitle: string;
}

const DeleteBookDialog = ({ bookId, bookTitle }: Props) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) return;

    setIsDeleting(true);

    const result = await deleteBook(bookId, reason.trim());

    setIsDeleting(false);

    if (result.success) {
      toast.success("Book deleted", {
        description: `"${bookTitle}" has been removed.`,
      });
      setOpen(false);
      setReason("");
    } else {
      toast.error("Delete failed", {
        description: result.error,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          <Trash2 className="size-4 text-red-500 hover:text-red-700" />
        </button>
      </DialogTrigger>

      <DialogContent className="border-2 border-red-200 bg-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-red-700">
            Delete &quot;{bookTitle}&quot;?
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            This action cannot be undone. Please provide a reason for
            deleting this book.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Reason for deletion..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-24 border-red focus-visible:ring-red-300"
        />

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={!reason.trim() || isDeleting}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookDialog;