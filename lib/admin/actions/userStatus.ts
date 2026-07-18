"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const approveUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");

    return { success: true };
  } catch (error) {
    console.error("Failed to approve user:", error);
    return { success: false, error: "Failed to approve account" };
  }
};

export const rejectUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");

    return { success: true };
  } catch (error) {
    console.error("Failed to reject user:", error);
    return { success: false, error: "Failed to reject account" };
  }
};
