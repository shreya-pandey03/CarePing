"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters.").max(100),

  image: z.string().url("Invalid image URL.").or(z.literal("")).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(input: UpdateProfileInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const data = updateProfileSchema.parse(input);

  await db
    .update(users)
    .set({
      name: data.name,
      image: data.image || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}
