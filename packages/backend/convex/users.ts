import { mutation, query } from "./_generated/server";

export const getUsers = query({
    args: {},
    handler: async ({ db }) => {
        const users = await db.query("users").collect();
        return users;
    }
});

export const addUser = mutation({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const orgId = identity.orgId as string;
        if (!orgId) {
            throw new Error("Missing organization");
        }

        const userId = await ctx.db.insert("users", {
            name: "New User",
        });
        return userId;
    },
});