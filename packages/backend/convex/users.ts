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
    handler: async ({ db }) => {
        const userId = await db.insert("users", {
            name: "New User",
        });
        return userId;
    },
});