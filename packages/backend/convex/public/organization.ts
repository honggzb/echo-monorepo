import { createClerkClient } from "@clerk/backend";
import { v } from "convex/values";
import { action } from "../_generated/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

// This action validates that the provided organization ID corresponds to a valid organization in Clerk.
// https://docs.convex.dev/functions/actions
export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    const organization = await clerkClient.organizations.getOrganization({
      organizationId: args.organizationId,
    });
    //console.log(organization);
    if (organization) {
      return { valid: true }
    } else {
      return { valid: false, reason: "Organization not valid" };
    }
  },
});