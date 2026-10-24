import { clerkClient } from "@clerk/nextjs/server";

type UpdateParams = Parameters<
  Awaited<ReturnType<typeof clerkClient>>["users"]["updateUser"]
>[1];

const isNotFound = (err: any) =>
  err?.status === 404 || err?.errors?.[0]?.code === "resource_not_found";

// Seeded users may exist in the database but not in Clerk.
// In that case skip Clerk and let the database update continue.
export const clerkUpdateUser = async (id: string, params: UpdateParams) => {
  try {
    await (await clerkClient()).users.updateUser(id, params);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    console.log(`Clerk user ${id} not found, skipping Clerk update`);
  }
};

export const clerkDeleteUser = async (id: string) => {
  try {
    await (await clerkClient()).users.deleteUser(id);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    console.log(`Clerk user ${id} not found, skipping Clerk delete`);
  }
};