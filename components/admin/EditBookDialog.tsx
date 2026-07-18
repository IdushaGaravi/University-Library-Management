"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookForm from "./forms/BookForm";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface Props extends Partial<Book> {
  bookId: string;
}

const EditBookDialog = ({ bookId, ...book }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          <Pencil className="size-4 text-blue-500 hover:text-blue-700" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl border-2 border-red-200 bg-white">
        <DialogHeader>
          <DialogTitle>Edit &quot;{book.title}&quot;</DialogTitle>
          <DialogDescription className="text-gray-500">
            Update the details below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <BookForm
          type="update"
          {...book}
          id={bookId}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditBookDialog;
