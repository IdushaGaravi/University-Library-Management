"use server";

import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateReturnDate = async (
  recordId: string,
  returnDate: string
) => {
  try {
    await db
      .update(borrowRecords)
      .set({ returnDate, status: "RETURNED" })
      .where(eq(borrowRecords.id, recordId));

    revalidatePath("/admin/book-requests");

    return { success: true };
  } catch (error) {
    console.error("Failed to update return date:", error);
    return { success: false, error: "Failed to update return date" };
  }
};