import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { components } from "../_generated/api";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc } from "../_generated/dataModel";

export const updateStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    await ctx.db.patch(args.conversationId, {
      status: args.status,
    });
  },
});

export const getOneConversation = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (identity === null) {
        throw new ConvexError({
          code: "UNAUTHORIZED",
          message: "Identity not found",
        });
      }

      const orgId = identity.orgId as string;
      if (!orgId) {
        throw new ConvexError({
          code: "UNAUTHORIZED",
          message: "Organization not found",
        });
      }

      const conversation = await ctx.db.get(args.conversationId);

      if(!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
      }
      if (conversation.organizationId !== orgId) {
        throw new ConvexError({
          code: "UNAUTHORZIED",
          message: "Invalid Organization ID",
        });
      }

      const contactSession = await ctx.db.get(conversation.contactSessionId);
      if (!contactSession) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Contact session not found",
        });
      }

      return {
        ...conversation,
        contactSession,
      };
    }
});

export const getManyConversations = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.optional(
          v.union(
            v.literal("unresolved"),
            v.literal("escalated"),
            v.literal("resolved")
          )
        ),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (identity === null) {
        throw new ConvexError({
          code: "UNAUTHORIZED",
          message: "Identity not found",
        });
      }
      const orgId = identity.orgId as string;
      console.log("orgId", orgId)
      if (!orgId) {
        throw new ConvexError({
          code: "UNAUTHORIZED",
          message: "Organization not found",
        });
      }

      let conversations: PaginationResult<Doc<"conversations">>;
      if (args.status) {
        conversations = await ctx.db
            .query("conversations")
            .withIndex("by_status_and_organization_id", (q) =>
              q.eq("status", args.status as Doc<"conversations">["status"])
               .eq("organizationId", orgId)
            )
            .order("desc")
            .paginate(args.paginationOpts);
        } else {
        conversations = await ctx.db
            .query("conversations")
            .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
            .order("desc")
            .paginate(args.paginationOpts);
        }

      const conversationsWithAdditionalData = await Promise.all(
        conversations.page.map(async (conversation) => {
          let lastMessage: MessageDoc | null = null;

          const contactSession = await ctx.db.get(conversation.contactSessionId);
          if (!contactSession) {
            return null;
          }

          const messages = await supportAgent.listMessages(ctx, {
            threadId: conversation.threadId,
            paginationOpts: { numItems: 1, cursor: null },
          });
          if (messages.page.length > 0) {
            lastMessage = messages.page[0] ?? null;
          }

          return {
            ...conversation,
            lastMessage,
            contactSession,
          };
        })
      );

      const validConversations = conversationsWithAdditionalData.filter(
        (conv): conv is NonNullable<typeof conv> => conv !== null,
      );

    return {
      ...conversations,
      page: validConversations,
    };
  },
});

// use internalQuery since this is only used by other server functions and we want to keep it private
export const getByThreadId = internalQuery({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    return conversation;
  },
});

export const createConversation = mutation({
    args: {
        organizationId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session",
            });
        }

        //const threadId = "123";
        const { threadId } = await supportAgent.createThread(ctx, {
            userId: args.organizationId,
        });
        await saveMessage(ctx, components.agent, {
            threadId,
            message: {
                role: "assistant",       // will show assistant message firstly
                // TODO: Later modify to widget settings' initial message
                content: "Hello, how can I help you today?",
            },
        });

        const conversationId = await ctx.db.insert("conversations", {
            threadId,
            organizationId: args.organizationId,
            contactSessionId: args.contactSessionId,
            status: "unresolved",
        });

        return conversationId;
    }
})