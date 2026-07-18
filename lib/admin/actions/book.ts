"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    revalidatePath("/admin/books");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const deleteBook = async (bookId: string, reason: string) => {
  try {
    console.log(`Deleting book ${bookId}. Reason: ${reason}`);

    await db.delete(books).where(eq(books.id, bookId));

    revalidatePath("/admin/books");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return { success: false, error: "Failed to delete book" };
  }
};