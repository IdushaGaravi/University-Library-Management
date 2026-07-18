"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { createBook, updateBook } from "@/lib/admin/actions/book";
import { toast } from "sonner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ColorPicker from "../ColorPicker";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";

interface Props extends Partial<Book> {
  type?: "create" | "update";
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BookForm = ({ type = "create", onSuccess, onCancel, ...book }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title ?? "",
      description: book.description ?? "",
      author: book.author ?? "",
      genre: book.genre ?? "",
      rating: book.rating ?? 1,
      totalCopies: book.totalCopies ?? 1,
      coverUrl: book.coverUrl ?? "",
      coverColor: book.coverColor ?? "",
      videoUrl: book.videoUrl ?? "",
      summary: book.summary ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result =
      type === "update" && book.id
        ? await updateBook(book.id, values)
        : await createBook(values);

    if (result.success) {
      toast.success("Success", {
        description: `Book ${type === "update" ? "updated" : "created"} successfully`,
      });

      if (type === "update") {
        onSuccess?.(); // close the dialog
      }

      router.push("/admin/books");
      router.refresh(); // force a fresh fetch of the list with updated data
    } else {
      toast.error("Error", {
        description: result.message,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Controller
        control={form.control}
        name={"title"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Book Title
            </FieldLabel>
            <Input
              required
              placeholder="Book title"
              {...field}
              className="book-form_input"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"author"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Author
            </FieldLabel>
            <Input
              required
              placeholder="Book author"
              {...field}
              className="book-form_input"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"genre"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Genre
            </FieldLabel>
            <Input
              required
              placeholder="Book genre"
              {...field}
              className="book-form_input"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"rating"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Rating
            </FieldLabel>
            <Input
              type="number"
              min={1}
              max={5}
              placeholder="Book rating"
              {...field}
              className="book-form_input"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"totalCopies"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Total Copies
            </FieldLabel>
            <Input
              type="number"
              min={1}
              max={10000}
              placeholder="Total Copies"
              {...field}
              className="book-form_input"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"coverUrl"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Book Image
            </FieldLabel>
            <FileUpload
              type="image"
              accept="image/*"
              placeholder="Upload a book cover"
              folder="books/covers"
              variant="light"
              onFileChange={field.onChange}
              value={field.value}
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"coverColor"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Primary Color
            </FieldLabel>
            <ColorPicker value={field.value} onPickerChange={field.onChange} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"description"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Book Description
            </FieldLabel>
            <Textarea
              placeholder="Book description"
              {...field}
              rows={10}
              className="book-form_input"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"videoUrl"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Book Trailer
            </FieldLabel>
            <FileUpload
              type="video"
              accept="videos/*"
              placeholder="Upload a book trailer"
              folder="books/videos"
              variant="light"
              onFileChange={field.onChange}
              value={field.value}
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name={"summary"}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col gap-1">
            <FieldLabel className="text-base font-normal text-dark-500">
              Book Summary
            </FieldLabel>
            <Textarea
              placeholder="Book summary"
              {...field}
              rows={5}
              className="book-form_input"
            />
          </Field>
        )}
      />

      {onCancel ? (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="book-form_btn text-white">
            {type === "update" ? "Update Book" : "Add Book to Library"}
          </Button>
        </div>
      ) : (
        <Button type="submit" className="book-form_btn text-white">
          {type === "update" ? "Update Book" : "Add Book to Library"}
        </Button>
      )}
    </form>
  );
};

export default BookForm;
