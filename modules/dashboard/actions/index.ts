"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";

const revalidateDashboard = () => {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard", "layout");
};

const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

const parseMongoDate = (value: unknown): Date => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if ("$date" in record) {
      const dateValue = record.$date;

      if (typeof dateValue === "string" || typeof dateValue === "number") {
        const date = new Date(dateValue);
        return Number.isNaN(date.getTime()) ? new Date() : date;
      }

      if (dateValue && typeof dateValue === "object") {
        const nested = dateValue as Record<string, unknown>;
        if ("$numberLong" in nested && typeof nested.$numberLong === "string") {
          const millis = Number(nested.$numberLong);
          const date = new Date(millis);
          return Number.isNaN(date.getTime()) ? new Date() : date;
        }
      }
    }
  }

  return new Date();
};

export const toggleStarMarked = async (
  playgroundId: string,
  isChecked: boolean
) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User Id is Required");
  }

  try {
    if (isChecked) {
      await db.starMark.create({
        data: {
          userId: userId!,
          playgroundId,
          isMarked: isChecked,
        },
      });
    } else {
        await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: playgroundId,

          },
        },
      });
    }

    revalidateDashboard();
    return { success: true, isMarked: isChecked };
  } catch (error) {
       console.error("Error updating problem:", error);
    return { success: false, error: "Failed to update problem" };
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return [];
  }

  try {
    const result = await db.$runCommandRaw({
      aggregate: "Playground",
      pipeline: [
        {
          $match: {
            userId: { $oid: user.id },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ],
      cursor: {},
    });

    const rows = Array.isArray((result as { cursor?: { firstBatch?: unknown[] } })?.cursor?.firstBatch)
      ? ((result as { cursor?: { firstBatch?: unknown[] } }).cursor?.firstBatch as Record<string, unknown>[])
      : [];

    return rows.map((row) => ({
      id: String(row._id ?? ""),
      title: String(row.title ?? ""),
      description: (row.description as string | null) ?? null,
      template: String(row.template ?? "REACT"),
      createdAt: parseMongoDate(row.createdAt),
      updatedAt: parseMongoDate(row.updatedAt),
      userId: user.id,
      user: {
        id: user.id,
        name: user.name ?? null,
        email: user.email ?? null,
        image: user.image ?? null,
        role: user.role ?? "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      starMarks: [],
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}): Promise<{ id: string } | null> => {
  const user = await currentUser();

  const { template, title, description } = data;

  try {
    const playground = await db.playground.create({
      data: {
        title: title,
        description: description,
        template: template,
        userId: user?.id!,
      },
    });

    revalidateDashboard();

    return playground;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProjectById = async (id: string): Promise<void> => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User Id is Required");
  }

  try {
    if (isValidObjectId(id)) {
      await db.playground.deleteMany({
        where: {
          id,
          userId: user.id,
        },
      });
    } else {
      await db.$runCommandRaw({
        delete: "Playground",
        deletes: [
          {
            q: {
              _id: id,
              userId: { $oid: user.id },
            },
            limit: 1,
          },
        ],
      });
    }

    revalidateDashboard();
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
): Promise<void> => {
  try {
    await db.playground.update({
      where: {
        id,
      },
      data: data,
    });
    revalidateDashboard();
  } catch (error) {
    console.log(error);
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
      // todo: add tempalte files
    });
    if (!originalPlayground) {
      throw new Error("Original playground not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,

        // todo: add template files
      },
    });

    revalidateDashboard();
    return duplicatedPlayground;
  } catch (error) {
    console.error("Error duplicating project:", error);
    return null;
  }
};
