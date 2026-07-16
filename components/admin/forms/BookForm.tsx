"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Path, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props extends Partial<Book> {
  type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      genre: "",
      rating: 1,
      totalCopies: 1,
      coverUrl: "",
      coverColor: "",
      videoUrl: "",
      summary: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
            control={form.control}
            name={"title"}
            render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
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
            <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
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
            <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
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
            <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
                <FieldLabel className="text-base font-normal text-dark-500">
                    Rating
                </FieldLabel>
                    <Input
                        type='number'
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
                <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
                    <FieldLabel className="text-base font-normal text-dark-500">
                        Total Copies
                    </FieldLabel>
                        <Input
                            type='number'
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
                <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
                    <FieldLabel className="text-base font-normal text-dark-500">
                        Book Image
                    </FieldLabel>
                    {/* {File Upload} */}
                </Field>
            )}
        /> 

        <Controller
            control={form.control}
            name={"coverColor"}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
                    <FieldLabel className="text-base font-normal text-dark-500">
                        Primary Color
                    </FieldLabel>
                    {/* {Color Picker} */}
                </Field>
            )}
        />

        <Controller
            control={form.control}
            name={"description"}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
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
                <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
                    <FieldLabel className="text-base font-normal text-dark-500">
                        Book Trailer
                    </FieldLabel>
                    {/* {File Upload} */}
                </Field>
            )}
        /> 

        <Controller
            control={form.control}
            name={"summary"}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}  className="flex flex-col gap-1">
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

        <Button type="submit" className='book-form_btn text-white'>
            Add Book to Library
        </Button>
    </form>
  );
};
export default BookForm;