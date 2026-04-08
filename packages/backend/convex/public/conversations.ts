import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { components, internal } from "../_generated/api";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator, PaginationResult } from "convex/server";

// export const escalateConversation = internalMutation({
//   args: {
//     threadId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const conversation =
//       await ctx.db.query("conversations")
//                   .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
//                   .unique();
//     if (!conversation) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message: "Conversation not found",
//       });
//     }

//     await ctx.db.patch(conversation._id, {status: "escalated"});
//   }

// });

// export const resolveConversation = internalMutation({
//   args: {
//     threadId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const conversation =
//       await ctx.db.query("conversations")
//                   .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
//                   .unique();
//     if (!conversation) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message: "Conversation not found",
//       });
//     }

//     await ctx.db.patch(conversation._id, {status: "resolved"});
//   }

// });

export const getOneConversation = query({
    args: {
      conversationId: v.id("conversations"),
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

      const conversation = await ctx.db.get(args.conversationId);

      if(!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
      }
      if (conversation.contactSessionId !== session._id) {
        throw new ConvexError({
          code: "UNAUTHORIZED",
          message: "Incorrect session",
        });
      }

      return {
        _id: conversation._id,
        status: conversation.status,
        threadId: conversation.threadId,
      };
    }
});

export const getManyConversations = query({
    args: {
      contactSessionId: v.id("contactSessions"),
      paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
      const contactSession = await ctx.db.get(args.contactSessionId);
      if (!contactSession || contactSession.expiresAt < Date.now()) {
        throw new ConvexError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      const conversations =
      await ctx.db.query("conversations")
                  .withIndex("by_contact_session_id", (q) =>
                    q.eq("contactSessionId", args.contactSessionId),
                  )
                  .order("desc")
                  .paginate(args.paginationOpts);

      const conversationsWithLastMessage = await Promise.all(
        conversations.page.map(async (conversation) => {
          let lastMessage: MessageDoc | null = null;

          const messages = await supportAgent.listMessages(ctx, {
            threadId: conversation.threadId,
            paginationOpts: { numItems: 1, cursor: null },
          });
          if (messages.page.length > 0) {
            lastMessage = messages.page[0] ?? null;
          }

          return {
            _id: conversation._id,
            _creationTime: conversation._creationTime,
            status: conversation.status,
            organizationId: conversation.organizationId,
            threadId: conversation.threadId,
            lastMessage,
          };
        })
      );

      return {
        ...conversations,
        page: conversationsWithLastMessage,
      };
  }
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

// export const createConversation = mutation({
//     args: {
//         organizationId: v.string(),
//         contactSessionId: v.id("contactSessions"),
//     },
//     handler: async (ctx, args) => {
//         const session = await ctx.db.get(args.contactSessionId);
//         if (!session || session.expiresAt < Date.now()) {
//             throw new ConvexError({
//                 code: "UNAUTHORIZED",
//                 message: "Invalid session",
//             });
//         }

//         //const threadId = "123";
//         // This refreshes the user's session if they are within the threshold
//         await ctx.runMutation(internal.system.contactSessions.refresh, {
//             contactSessionId: args.contactSessionId,
//         });

//         const { threadId } = await supportAgent.createThread(ctx, {
//           userId: args.organizationId,
//         });

//         await saveMessage(ctx, components.agent, {
//           threadId,
//           message: {
//             role: "assistant",
//             content: "Hello, how can I help you today?",
//           },
//         });

//         const conversationId = await ctx.db.insert("conversations", {
//             threadId,
//             organizationId: args.organizationId,
//             contactSessionId: args.contactSessionId,
//             status: "unresolved",
//         });

//         return conversationId;
//     }
// })