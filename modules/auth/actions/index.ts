"use server";

import { db } from "@/lib/db";

export async function getUserById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch {
    return null;
  }
}

export async function getAccountByUserId(userId: string) {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });

    return account;
  } catch {
    return null;
  }
}
