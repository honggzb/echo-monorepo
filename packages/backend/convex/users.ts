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
        // const identity = await db.auth.getUserIdentity();
        // if (!identity) {
        //     throw new Error("Unauthorized");
        // }
        const userId = await db.insert("users", {
            name: "New User",
        });
        return userId;
    },
});